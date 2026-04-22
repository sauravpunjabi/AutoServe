const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Create Booking
router.post("/", authorize, async (req, res) => {
  try {
    const { service_center_id, vehicle_id, booking_date, time_slot, service_type, notes } = req.body;
    const newBooking = await pool.query(
      "INSERT INTO service_bookings (customer_id, service_center_id, vehicle_id, booking_date, time_slot, service_type, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [req.user.id, service_center_id, vehicle_id, booking_date, time_slot, service_type, notes]
    );
    res.json({ success: true, data: newBooking.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// List Bookings (Customer gets theirs, Manager gets their center's)
router.get("/", authorize, async (req, res) => {
  try {
    if (req.user.role === "customer") {
      const bookings = await pool.query("SELECT * FROM service_bookings WHERE customer_id = $1", [req.user.id]);
      return res.json({ success: true, data: bookings.rows });
    } else if (req.user.role === "manager") {
      const center = await pool.query("SELECT id FROM service_centers WHERE manager_id = $1", [req.user.id]);
      if (center.rows.length === 0) return res.json({ success: true, data: [] });
      const bookings = await pool.query("SELECT * FROM service_bookings WHERE service_center_id = $1", [center.rows[0].id]);
      return res.json({ success: true, data: bookings.rows });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Update Booking Status (Manager)
router.patch("/:id/status", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedBooking = await pool.query(
      "UPDATE service_bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    
    // Auto-create job card if approved
    if (status === "approved") {
      await pool.query("INSERT INTO job_cards (booking_id) VALUES ($1) ON CONFLICT DO NOTHING", [id]);
    }
    
    res.json({ success: true, data: updatedBooking.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get Calendar Bookings
router.get("/calendar/:serviceCenterId", async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    const bookings = await pool.query(`
        SELECT sb.booking_date, sb.time_slot, u.name as customer_name, v.make, v.model, sb.status, sb.service_type
        FROM service_bookings sb
        JOIN users u ON sb.customer_id = u.id
        JOIN vehicles v ON sb.vehicle_id = v.id
        WHERE sb.service_center_id = $1
    `, [serviceCenterId]);
    res.json({ success: true, data: bookings.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
