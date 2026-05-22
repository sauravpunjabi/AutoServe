const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Create Service Center (Manager Only)
router.post("/", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { name, address, phone, email } = req.body;

    const newCenter = await pool.query(
      "INSERT INTO service_centers (name, address, phone, email, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, address, phone, email, req.user.id]
    );
    
    // Auto link manager to center
    await pool.query("UPDATE users SET service_center_id = $1 WHERE id = $2", [newCenter.rows[0].id, req.user.id]);
    
    res.json({ success: true, data: newCenter.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// List all Service Centers (Public) with Average Rating
router.get("/", async (req, res) => {
  try {
    const centers = await pool.query(`
      SELECT sc.*, COALESCE(AVG(r.rating), 0) as average_rating, u.name as manager_name
      FROM service_centers sc
      LEFT JOIN service_center_reviews r ON sc.id = r.service_center_id
      LEFT JOIN users u ON sc.manager_id = u.id
      GROUP BY sc.id, u.name
      ORDER BY average_rating DESC
    `);
    res.json({ success: true, data: centers.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// List mechanics for a service center
router.get("/:id/mechanics", authorize, async (req, res) => {
  try {
    const mechanics = await pool.query(
      "SELECT id, name, email, phone, status, created_at FROM users WHERE role = 'mechanic' AND service_center_id = $1 ORDER BY created_at DESC",
      [req.params.id]
    );
    res.json({ success: true, data: mechanics.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get Service Center Details with reviews
router.get("/:id", async (req, res) => {
  try {
    const center = await pool.query("SELECT * FROM service_centers WHERE id = $1", [req.params.id]);
    if (center.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service center not found" });
    }
    const reviews = await pool.query(`
      SELECT r.*, u.name as customer_name
      FROM service_center_reviews r
      JOIN users u ON r.customer_id = u.id
      WHERE r.service_center_id = $1
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    res.json({
      success: true,
      data: { ...center.rows[0], reviews: reviews.rows },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Mechanic Request to Join
router.post("/:id/join", authorize, async (req, res) => {
  try {
    if (req.user.role !== "mechanic") return res.status(403).json({ success: false, message: "Only mechanics can join." });
    
    // Update user's requested center
    await pool.query("UPDATE users SET service_center_id = $1 WHERE id = $2", [req.params.id, req.user.id]);
    res.json({ success: true, message: "Join request sent." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Manager Approves/Rejects Mechanic
router.patch("/:id/mechanics/:userId", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { status } = req.body; // 'active' or 'rejected'
    
    await pool.query("UPDATE users SET status = $1 WHERE id = $2 AND service_center_id = $3", [status, req.params.userId, req.params.id]);
    res.json({ success: true, message: `Mechanic ${status}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
