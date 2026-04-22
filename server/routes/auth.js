const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authorize = require("../middleware/authMiddleware");

// Helper if jwtGenerator is external, but let's inline it for clarity or use their utility
const jwtGenerator = require("../utils/jwtGenerator"); // Assuming it takes (id, role)

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length > 0) {
      return res.status(401).send("User already exists");
    }

    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Mechanics start as pending
    const initialStatus = role === 'mechanic' ? 'pending' : 'active';

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role, phone, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, bcryptPassword, role, phone, initialStatus]
    );

    const token = jwtGenerator(newUser.rows[0]);

    // Return full user object matching prompt requirements
    res.json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json("Password or Email is incorrect");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("Password or Email is incorrect");
    }

    const token = jwtGenerator(user.rows[0]);

    // Omit password from response
    const userObj = { ...user.rows[0] };
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Verify & Get Me
router.get("/me", authorize, async (req, res) => {
  try {
    const user = await pool.query("SELECT id, name, email, role, phone, status, service_center_id FROM users WHERE id = $1", [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/is-verify", authorize, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
