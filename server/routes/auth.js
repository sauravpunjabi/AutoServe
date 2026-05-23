const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const pool = require("../db");
const bcrypt = require("bcryptjs");
const authorize = require("../middleware/authMiddleware");
const jwtGenerator = require("../utils/jwtGenerator");
const crypto = require("crypto");
const { sendResetEmail } = require("../utils/mailer");


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many attempts, please try again later." },
});

const ALLOWED_REGISTER_ROLES = ["customer", "mechanic", "manager"];

router.post("/register", authLimiter, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "Name, email, password, and role are required." });
    }

    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Admin registration is not allowed." });
    }

    if (!ALLOWED_REGISTER_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(401).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);
    const initialStatus = role === "mechanic" ? "pending" : "active";

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role, phone, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, bcryptPassword, role, phone || null, initialStatus]
    );

    const token = jwtGenerator(newUser.rows[0]);
    const userObj = { ...newUser.rows[0] };
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Password or Email is incorrect" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Password or Email is incorrect" });
    }

    if (user.rows[0].status === "rejected") {
      return res.status(403).json({ success: false, message: "Account is suspended." });
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

router.get("/is-verify", authorize, async (req, res) => {
  try {
    res.json({ success: true, data: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await pool.query("SELECT id FROM users WHERE LOWER(email) = LOWER($1)", [email.trim()]);
    if (user.rows.length === 0) {
      return res.json({ success: true, message: "If that email exists in our system, we've sent a link to reset your password." });
    }

    const userId = user.rows[0].id;
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Clean up old reset requests for this user
    await pool.query("DELETE FROM password_resets WHERE user_id = $1", [userId]);

    await pool.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, token, expiresAt]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    await sendResetEmail(email.trim(), resetLink);

    res.json({ success: true, message: "If that email exists in our system, we've sent a link to reset your password." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "New password is required." });
    }

    const resetRequest = await pool.query(
      "SELECT * FROM password_resets WHERE token = $1",
      [token]
    );

    if (resetRequest.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token." });
    }

    const { user_id, expires_at } = resetRequest.rows[0];

    if (new Date() > new Date(expires_at)) {
      await pool.query("DELETE FROM password_resets WHERE token = $1", [token]);
      return res.status(400).json({ success: false, message: "Reset token has expired." });
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    await pool.query(
      "UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2",
      [bcryptPassword, user_id]
    );

    await pool.query("DELETE FROM password_resets WHERE token = $1", [token]);

    res.json({ success: true, message: "Password has been reset successfully." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
