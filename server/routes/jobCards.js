const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

const JOB_STATUSES = ["open", "in_progress", "completed"];
const TASK_STATUSES = ["pending", "in_progress", "completed"];

router.get("/", authorize, async (req, res) => {
  try {
    if (req.user.role === "mechanic") {
      const jobs = await pool.query(
        `SELECT j.*, b.booking_date, b.service_type, b.time_slot
         FROM job_cards j
         JOIN service_bookings b ON j.booking_id = b.id
         WHERE j.mechanic_id = $1
         ORDER BY j.created_at DESC`,
        [req.user.id]
      );
      return res.json({ success: true, data: jobs.rows });
    }
    if (req.user.role === "manager") {
      const jobs = await pool.query(
        `SELECT j.*, b.booking_date, b.service_type, b.time_slot, m.name as mechanic_name
         FROM job_cards j
         JOIN service_bookings b ON j.booking_id = b.id
         JOIN service_centers s ON b.service_center_id = s.id
         LEFT JOIN users m ON j.mechanic_id = m.id
         WHERE s.manager_id = $1
         ORDER BY j.created_at DESC`,
        [req.user.id]
      );
      return res.json({ success: true, data: jobs.rows });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:id", authorize, async (req, res) => {
  try {
    const jobRes = await pool.query(
      `SELECT jc.*, sb.service_type, sb.booking_date, sb.time_slot, sb.customer_id, sb.notes as booking_notes,
              v.make, v.model, v.year, v.license_plate, u.name as customer_name, u.email as customer_email,
              m.name as mechanic_name
       FROM job_cards jc
       JOIN service_bookings sb ON jc.booking_id = sb.id
       JOIN vehicles v ON sb.vehicle_id = v.id
       JOIN users u ON sb.customer_id = u.id
       LEFT JOIN users m ON jc.mechanic_id = m.id
       WHERE jc.id = $1`,
      [req.params.id]
    );
    if (jobRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job card not found" });
    }
    const tasks = await pool.query(
      "SELECT * FROM job_tasks WHERE job_card_id = $1 ORDER BY created_at ASC",
      [req.params.id]
    );
    const parts = await pool.query(
      `SELECT jp.*, p.name as part_name, p.unit_price
       FROM job_parts jp JOIN parts p ON jp.part_id = p.id
       WHERE jp.job_card_id = $1`,
      [req.params.id]
    );
    res.json({
      success: true,
      data: { ...jobRes.rows[0], tasks: tasks.rows, parts: parts.rows },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.patch("/:id/mechanic", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { id } = req.params;
    const { mechanic_id } = req.body;

    if (!mechanic_id) {
      return res.status(400).json({ success: false, message: "mechanic_id is required." });
    }

    const mechCheck = await pool.query(
      `SELECT u.id FROM users u
       JOIN job_cards jc ON jc.id = $1
       JOIN service_bookings sb ON jc.booking_id = sb.id
       WHERE u.id = $2 AND u.service_center_id = sb.service_center_id AND u.role = 'mechanic'`,
      [id, mechanic_id]
    );
    if (mechCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Mechanic does not belong to this service center.",
      });
    }

    const updated = await pool.query(
      "UPDATE job_cards SET mechanic_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [mechanic_id, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job card not found" });
    }
    res.json({ success: true, data: updated.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.patch("/:id/status", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !JOB_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: open, in_progress, completed",
      });
    }

    const updated = await pool.query(
      "UPDATE job_cards SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (updated.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job card not found" });
    }

    const updatedJob = updated.rows[0];
    const io = req.app.get("socketio");
    if (io) {
      io.emit("job_updated", {
        job_card_id: id,
        status: updatedJob.status,
      });
    }

    res.json({ success: true, data: updatedJob });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/:id/tasks", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: "Task description is required." });
    }

    const task = await pool.query(
      "INSERT INTO job_tasks (job_card_id, description) VALUES ($1, $2) RETURNING *",
      [id, description.trim()]
    );
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

    if (!status || !TASK_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: pending, in_progress, completed",
      });
    }

    const task = await pool.query(
      "UPDATE job_tasks SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, taskId]
    );
    if (task.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    const updatedTask = task.rows[0];
    const io = req.app.get("socketio");
    if (io) {
      io.emit("task_updated", {
        job_card_id: updatedTask.job_card_id,
        taskId: updatedTask.id,
        status: updatedTask.status,
      });
    }

    res.json({ success: true, data: updatedTask });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
