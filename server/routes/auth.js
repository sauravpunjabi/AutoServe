const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const authorize = require("../middleware/authMiddleware");
const jwtGenerator = require("../utils/jwtGenerator");
const { sendResetEmail } = require("../utils/mailer");
const { authLimiter, passwordResetLimiter } = require("../middleware/rateLimiter");
const {
  validateEmail,
  validatePassword,
  validateString,
  validatePhone,
  firstError,
} = require("../middleware/validate");

const ALLOWED_REGISTER_ROLES = ["customer", "mechanic", "manager"];

// UUID v4 pattern — used to reject obviously malformed reset tokens before hitting the DB
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// ─── POST /register ───────────────────────────────────────────────────────────
// authLimiter: 10 attempts / 15 min per IP (only failed requests count).
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // ── Schema validation ────────────────────────────────────────────────────
    const err = firstError(
      validateString(name, "Name", 100),
      validateEmail(email),
      validatePassword(password),
      validatePhone(phone, false) // optional
    );
    if (err) return res.status(400).json({ success: false, message: err });

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required." });
    }
    // Whitelist check — blocks attempts to self-register as admin
    if (!ALLOWED_REGISTER_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [trimmedEmail]
    );
    if (existing.rows.length > 0) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const initialStatus = role === "mechanic" ? "pending" : "active";

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role, phone, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        name.trim(),
        trimmedEmail,
        bcryptPassword,
        role,
        phone ? phone.trim() : null,
        initialStatus,
      ]
    );

    const userObj = { ...newUser.rows[0] };
    delete userObj.password;
    const token = jwtGenerator(newUser.rows[0]);

    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── POST /login ──────────────────────────────────────────────────────────────
// authLimiter: counts only failed attempts so legitimate users are not blocked.
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Schema validation ────────────────────────────────────────────────────
    // Length-only checks here — full format validation would hint which field is
    // wrong, which helps enumerators. A generic "required" check is enough.
    if (!email || typeof email !== "string" || email.length > 254) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }
    if (!password || typeof password !== "string" || password.length > 128) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email.trim().toLowerCase(),
    ]);
    if (user.rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Password or Email is incorrect" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password or Email is incorrect" });
    }

    if (user.rows[0].status === "rejected") {
      return res
        .status(403)
        .json({ success: false, message: "Account is suspended." });
    }

    const token = jwtGenerator(user.rows[0]);
    const userObj = { ...user.rows[0] };
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── GET /me ──────────────────────────────────────────────────────────────────
router.get("/me", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email, role, phone, status, service_center_id FROM users WHERE id = $1",
      [req.user.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── GET /is-verify ───────────────────────────────────────────────────────────
router.get("/is-verify", authorize, async (_req, res) => {
  try {
    res.json({ success: true, data: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── POST /forgot-password ────────────────────────────────────────────────────
// passwordResetLimiter: 5 req / hour per IP to prevent email-spam abuse.
router.post("/forgot-password", passwordResetLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // ── Schema validation ────────────────────────────────────────────────────
    const err = validateEmail(email);
    if (err) return res.status(400).json({ success: false, message: err });

    const trimmedEmail = email.trim().toLowerCase();
    const user = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [trimmedEmail]
    );

    // Always return the same response to prevent email enumeration (OWASP A07)
    if (user.rows.length === 0) {
      return res.json({
        success: true,
        message:
          "If that email exists in our system, we've sent a link to reset your password.",
      });
    }

    const userId = user.rows[0].id;
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);
    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    await sendResetEmail(trimmedEmail, resetLink);

    res.json({
      success: true,
      message:
        "If that email exists in our system, we've sent a link to reset your password.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── POST /reset-password/:token ──────────────────────────────────────────────
// passwordResetLimiter: prevents token brute-force via repeated guesses.
router.post("/reset-password/:token", passwordResetLimiter, async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // ── Schema validation ────────────────────────────────────────────────────
    // Reject non-UUID tokens immediately — no DB round-trip needed
    if (!UUID_REGEX.test(token)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token." });
    }

    const err = validatePassword(password);
    if (err) return res.status(400).json({ success: false, message: err });

    const resetRequest = await pool.query(
      "SELECT * FROM password_resets WHERE token = $1",
      [token]
    );

    if (resetRequest.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token." });
    }

    const { user_id, expires_at } = resetRequest.rows[0];

    if (new Date() > new Date(expires_at)) {
      await pool.query("DELETE FROM password_resets WHERE token = $1", [token]);
      return res
        .status(400)
        .json({ success: false, message: "Reset token has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [bcryptPassword, user_id]
    );

    // Consume the token so it cannot be reused
    await pool.query("DELETE FROM password_resets WHERE token = $1", [token]);

    res.json({ success: true, message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
