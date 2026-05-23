const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

router.post("/", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { name, address, phone, email } = req.body;
    if (!name || !address || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "name, address, phone, and email are required.",
      });
    }

    const existing = await pool.query("SELECT id FROM service_centers WHERE manager_id = $1", [req.user.id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "You already manage a service center." });
    }

    const newCenter = await pool.query(
      "INSERT INTO service_centers (name, address, phone, email, manager_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, address, phone, email, req.user.id]
    );

    await pool.query(
      "UPDATE users SET service_center_id = $1, updated_at = NOW() WHERE id = $2",
      [newCenter.rows[0].id, req.user.id]
    );

    res.json({ success: true, data: newCenter.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const centers = await pool.query(`
      SELECT sc.*, u.name as manager_name,
             COALESCE(AVG(r.rating), 0) as average_rating
      FROM service_centers sc
      LEFT JOIN users u ON sc.manager_id = u.id
      LEFT JOIN service_center_reviews r ON sc.id = r.service_center_id
      GROUP BY sc.id, u.name
      ORDER BY average_rating DESC
    `);
    res.json({ success: true, data: centers.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id/mechanics", authorize, async (req, res) => {
  try {
    const mechanics = await pool.query(
      `SELECT id, name, email, phone, status FROM users
       WHERE role = 'mechanic' AND service_center_id = $1`,
      [req.params.id]
    );
    res.json({ success: true, data: mechanics.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const center = await pool.query(
      `SELECT sc.*, COALESCE(AVG(r.rating), 0) as average_rating
       FROM service_centers sc
       LEFT JOIN service_center_reviews r ON sc.id = r.service_center_id
       WHERE sc.id = $1
       GROUP BY sc.id`,
      [req.params.id]
    );
    if (center.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Service center not found" });
    }
    const reviews = await pool.query(
      `SELECT r.*, u.name as customer_name
       FROM service_center_reviews r
       JOIN users u ON r.customer_id = u.id
       WHERE r.service_center_id = $1
       ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    res.json({
      success: true,
      data: { ...center.rows[0], reviews: reviews.rows },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/:id/join", authorize, async (req, res) => {
  try {
    if (req.user.role !== "mechanic") {
      return res.status(403).json({ success: false, message: "Only mechanics can join." });
    }

    await pool.query(
      "UPDATE users SET service_center_id = $1, status = 'pending', updated_at = NOW() WHERE id = $2",
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: "Join request sent." });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.patch("/:id/mechanics/:userId", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { status } = req.body;
    if (!status || !["active", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be active or rejected." });
    }

    const center = await pool.query("SELECT id FROM service_centers WHERE manager_id = $1 AND id = $2", [
      req.user.id,
      req.params.id,
    ]);
    if (center.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Not your service center." });
    }

    await pool.query(
      "UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 AND service_center_id = $3",
      [status, req.params.userId, req.params.id]
    );
    res.json({ success: true, message: `Mechanic ${status}.` });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
