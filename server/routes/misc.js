const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// --- Invoices Routes --- //
// Generate Invoice
router.post("/invoices", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json("Access Denied");
    const { job_card_id, customer_id, labor_cost } = req.body;
    
    // Calculate parts cost
    const parts = await pool.query(`
      SELECT jp.quantity, i.price FROM job_parts jp
      JOIN inventory i ON jp.inventory_id = i.id
      WHERE jp.job_card_id = $1
    `, [job_card_id]);
    
    const parts_cost = parts.rows.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    const total_cost = Number(labor_cost) + parts_cost;

    const invoice = await pool.query(
      "INSERT INTO invoices (job_card_id, customer_id, labor_cost, parts_cost, total_cost) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [job_card_id, customer_id, labor_cost, parts_cost, total_cost]
    );
    res.json(invoice.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get My Invoices (Customer)
router.get("/invoices/me", authorize, async (req, res) => {
  try {
    const invoices = await pool.query("SELECT * FROM invoices WHERE customer_id = $1", [req.user.id]);
    res.json(invoices.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Admin Routes --- //
router.get("/admin/users", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json("Access Denied");
    const users = await pool.query("SELECT user_id, full_name, email, role, created_at FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
