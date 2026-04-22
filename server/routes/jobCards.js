const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Get Job Cards
router.get("/", authorize, async (req, res) => {
  try {
    if (req.user.role === "mechanic") {
      const jobs = await pool.query("SELECT * FROM job_cards WHERE mechanic_id = $1", [req.user.id]);
      return res.json({ success: true, data: jobs.rows });
    } else if (req.user.role === "manager") {
      const jobs = await pool.query(`
        SELECT j.* FROM job_cards j 
        JOIN service_bookings b ON j.booking_id = b.id
        JOIN service_centers s ON b.service_center_id = s.id
        WHERE s.manager_id = $1
      `, [req.user.id]);
      return res.json({ success: true, data: jobs.rows });
    }
    res.json({ success: true, data: [] });
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
