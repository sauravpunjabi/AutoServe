const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

const BOOKING_STATUSES = ["pending", "approved", "rejected", "completed"];

router.post("/", authorize, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can create bookings." });
    }

    const { service_center_id, vehicle_id, booking_date, time_slot, service_type, notes } = req.body;

    if (!service_center_id || !vehicle_id || !booking_date || !time_slot || !service_type) {
      return res.status(400).json({
        success: false,
        message: "service_center_id, vehicle_id, booking_date, time_slot, and service_type are required.",
      });
    }

    const vehicle = await pool.query(
      "SELECT * FROM vehicles WHERE id = $1 AND customer_id = $2",
      [vehicle_id, req.user.id]
    );
    if (vehicle.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Vehicle not found." });
    }

    const newBooking = await pool.query(
      `INSERT INTO service_bookings (customer_id, service_center_id, vehicle_id, booking_date, time_slot, service_type, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, service_center_id, vehicle_id, booking_date, time_slot, service_type, notes || null]
    );
    res.json({ success: true, data: newBooking.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/", authorize, async (req, res) => {
  try {
    if (req.user.role === "customer") {
      const bookings = await pool.query(
        "SELECT * FROM service_bookings WHERE customer_id = $1 ORDER BY booking_date DESC",
        [req.user.id]
      );
      return res.json({ success: true, data: bookings.rows });
    }
    if (req.user.role === "manager") {
      const center = await pool.query("SELECT id FROM service_centers WHERE manager_id = $1", [req.user.id]);
      if (center.rows.length === 0) return res.json({ success: true, data: [] });
      const bookings = await pool.query(
        `SELECT sb.*, v.make, v.model, v.license_plate, u.name as customer_name
         FROM service_bookings sb
         JOIN vehicles v ON sb.vehicle_id = v.id
         JOIN users u ON sb.customer_id = u.id
         WHERE sb.service_center_id = $1
         ORDER BY sb.booking_date DESC`,
        [center.rows[0].id]
      );
      return res.json({ success: true, data: bookings.rows });
    }
    res.json({ success: true, data: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/calendar/:serviceCenterId", async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    const bookings = await pool.query(
      `SELECT sb.booking_date, sb.time_slot, u.name as customer_name, v.make, v.model, sb.status, sb.service_type
       FROM service_bookings sb
       JOIN users u ON sb.customer_id = u.id
       JOIN vehicles v ON sb.vehicle_id = v.id
       WHERE sb.service_center_id = $1`,
      [serviceCenterId]
    );
    res.json({ success: true, data: bookings.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:id", authorize, async (req, res) => {
  try {
    const booking = await pool.query(
      `SELECT sb.*, v.make, v.model, v.year, v.license_plate, u.name as customer_name, u.email as customer_email
       FROM service_bookings sb
       JOIN vehicles v ON sb.vehicle_id = v.id
       JOIN users u ON sb.customer_id = u.id
       WHERE sb.id = $1`,
      [req.params.id]
    );
    if (booking.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    res.json({ success: true, data: booking.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.patch("/:id/status", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be one of: pending, approved, rejected, completed",
      });
    }

    const updatedBooking = await pool.query(
      "UPDATE service_bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (updatedBooking.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (status === "approved") {
      await pool.query(
        "INSERT INTO job_cards (booking_id) VALUES ($1) ON CONFLICT (booking_id) DO NOTHING",
        [id]
      );
      if (req.body.mechanic_id) {
        await pool.query(
          "UPDATE job_cards SET mechanic_id = $1 WHERE booking_id = $2",
          [req.body.mechanic_id, id]
        );
      }
    }

    res.json({ success: true, data: updatedBooking.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
