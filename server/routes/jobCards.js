const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Get Job Cards
router.get("/", authorize, async (req, res) => {
  try {
    if (req.user.role === "mechanic") {
      const jobs = await pool.query(`
        SELECT j.*, b.booking_date, b.service_type, b.time_slot
        FROM job_cards j
        JOIN service_bookings b ON j.booking_id = b.id
        WHERE j.mechanic_id = $1
        ORDER BY j.created_at DESC
      `, [req.user.id]);
      return res.json({ success: true, data: jobs.rows });
    } else if (req.user.role === "manager") {
      const jobs = await pool.query(`
        SELECT j.*, b.booking_date, b.service_type, b.time_slot, m.name as mechanic_name
        FROM job_cards j 
        JOIN service_bookings b ON j.booking_id = b.id
        JOIN service_centers s ON b.service_center_id = s.id
        LEFT JOIN users m ON j.mechanic_id = m.id
        WHERE s.manager_id = $1
        ORDER BY j.created_at DESC
      `, [req.user.id]);
      return res.json({ success: true, data: jobs.rows });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get single job card with tasks and parts
router.get("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await pool.query(`
      SELECT j.*, b.id as booking_id, b.booking_date, b.time_slot, b.service_type, b.status as booking_status,
             b.customer_id, b.notes as booking_notes,
             v.make, v.model, v.year, v.license_plate,
             u.name as customer_name, u.email as customer_email,
             m.name as mechanic_name
      FROM job_cards j
      JOIN service_bookings b ON j.booking_id = b.id
      JOIN vehicles v ON b.vehicle_id = v.id
      JOIN users u ON b.customer_id = u.id
      LEFT JOIN users m ON j.mechanic_id = m.id
      WHERE j.id = $1
    `, [id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job card not found" });
    }
    const tasks = await pool.query("SELECT * FROM job_tasks WHERE job_card_id = $1 ORDER BY created_at", [id]);
    const parts = await pool.query(`
      SELECT jp.*, p.name as part_name, p.unit_price
      FROM job_parts jp
      JOIN parts p ON jp.part_id = p.id
      WHERE jp.job_card_id = $1
    `, [id]);
    res.json({
      success: true,
      data: { ...job.rows[0], tasks: tasks.rows, parts: parts.rows },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Assign Mechanic
router.patch("/:id/mechanic", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { id } = req.params;
    const { mechanic_id } = req.body;
    const updated = await pool.query("UPDATE job_cards SET mechanic_id = $1 WHERE id = $2 RETURNING *", [mechanic_id, id]);
    res.json({ success: true, data: updated.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Update Job Card Status
router.patch("/:id/status", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await pool.query("UPDATE job_cards SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    res.json({ success: true, data: updated.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Tasks
router.post("/:id/tasks", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const task = await pool.query("INSERT INTO job_tasks (job_card_id, description) VALUES ($1, $2) RETURNING *", [id, description]);
    res.json({ success: true, data: task.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.patch("/tasks/:taskId/status", authorize, async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const task = await pool.query("UPDATE job_tasks SET status = $1 WHERE id = $2 RETURNING *", [status, taskId]);
    res.json({ success: true, data: task.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
