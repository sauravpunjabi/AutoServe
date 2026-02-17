const router = require("express").Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authMiddleware");

// Register
router.post("/register", async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length > 0) {
            return res.status(401).send("User already exists");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (full_name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
            [full_name, email, bcryptPassword, role]
        );

        const token = jwtGenerator(newUser.rows[0].user_id, newUser.rows[0].role);

        res.json({ token, role: newUser.rows[0].role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }

        const token = jwtGenerator(user.rows[0].user_id, user.rows[0].role);

        res.json({ token, role: user.rows[0].role });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Verify (Optional, for frontend session persistence)
router.get("/is-verify", authorize, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
