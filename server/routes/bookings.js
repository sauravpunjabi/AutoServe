const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");
const { publicReadLimiter, userWriteLimiter } = require("../middleware/rateLimiter");
const { validateDate, validateOptionalString, firstError } = require("../middleware/validate");

const BOOKING_STATUSES = ["pending", "approved", "rejected", "completed"];
const ALLOWED_TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
];

// Correlated subqueries reused in every SELECT
const SERVICES_JSON = `(
  SELECT COALESCE(json_agg(json_build_object('id', svc.id, 'name', svc.name, 'price', bs.price)), '[]'::json)
  FROM booking_services bs JOIN services svc ON bs.service_id = svc.id
  WHERE bs.booking_id = sb.id
) AS services`;

const SERVICES_TOTAL = `(
  SELECT COALESCE(SUM(bs.price), 0)
  FROM booking_services bs WHERE bs.booking_id = sb.id
) AS services_total`;

// ─── POST / ───────────────────────────────────────────────────────────────────
router.post("/", authorize, userWriteLimiter, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can create bookings." });
    }

    const { service_center_id, vehicle_id, booking_date, time_slot, service_ids, notes } = req.body;

    if (!service_center_id || !vehicle_id) {
      return res.status(400).json({
        success: false,
        message: "service_center_id, vehicle_id, booking_date, and time_slot are required.",
      });
    }

    // ── Input validation ─────────────────────────────────────────────────────
    const err = firstError(
      validateDate(booking_date, "booking_date"),
      !time_slot ? "time_slot is required." : null,
      time_slot && !ALLOWED_TIME_SLOTS.includes(time_slot)
        ? `time_slot must be one of: ${ALLOWED_TIME_SLOTS.join(", ")}.`
        : null,
      validateOptionalString(notes, "notes", 1000)
    );
    if (err) return res.status(400).json({ success: false, message: err });

    if (!Array.isArray(service_ids) || service_ids.length === 0) {
      return res.status(400).json({ success: false, message: "At least one service must be selected." });
    }
    // Cap the number of services per booking to prevent abuse
    if (service_ids.length > 20) {
      return res.status(400).json({ success: false, message: "A maximum of 20 services per booking is allowed." });
    }

    const vehicle = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND customer_id = $2",
      [vehicle_id, req.user.id]
    );
    if (vehicle.rows.length === 0) {
      return res.status(403).json({ success: false, message: "Vehicle not found." });
    }

    const newBooking = await pool.query(
      `INSERT INTO service_bookings (customer_id, service_center_id, vehicle_id, booking_date, time_slot, service_type, notes)
       VALUES ($1, $2, $3, $4, $5, '', $6) RETURNING id`,
      [req.user.id, service_center_id, vehicle_id, booking_date, time_slot, notes || null]
    );
    const bookingId = newBooking.rows[0].id;

    await pool.query(
      `INSERT INTO booking_services (booking_id, service_id, price)
       SELECT $1, s.id, s.base_price FROM services s WHERE s.id = ANY($2::uuid[])`,
      [bookingId, service_ids]
    );

    await pool.query(
      `UPDATE service_bookings SET service_type = (
        SELECT string_agg(svc.name, ', ' ORDER BY svc.name)
        FROM booking_services bs JOIN services svc ON bs.service_id = svc.id
        WHERE bs.booking_id = $1
      ) WHERE id = $1`,
      [bookingId]
    );

    const final = await pool.query("SELECT * FROM service_bookings WHERE id = $1", [bookingId]);
    res.json({ success: true, data: final.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── GET / ────────────────────────────────────────────────────────────────────
router.get("/", authorize, async (req, res) => {
  try {
    if (req.user.role === "customer") {
      const bookings = await pool.query(
        `SELECT sb.*, ${SERVICES_JSON}, ${SERVICES_TOTAL}
         FROM service_bookings sb
         WHERE sb.customer_id = $1
         ORDER BY sb.booking_date DESC`,
        [req.user.id]
      );
      return res.json({ success: true, data: bookings.rows });
    }
    if (req.user.role === "manager") {
      const center = await pool.query("SELECT id FROM service_centers WHERE manager_id = $1", [req.user.id]);
      if (center.rows.length === 0) return res.json({ success: true, data: [] });
      const bookings = await pool.query(
        `SELECT sb.*, v.make, v.model, v.license_plate, u.name AS customer_name,
                ${SERVICES_JSON}, ${SERVICES_TOTAL}
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

// ─── GET /calendar/:serviceCenterId ──────────────────────────────────────────
// OWASP A01 fix: was fully public and leaked customer PII (name, vehicle info).
// Now unauthenticated callers receive only slot availability (date + time + status).
// Authenticated managers of this center receive full detail.
router.get("/calendar/:serviceCenterId", publicReadLimiter, async (req, res) => {
  try {
    const { serviceCenterId } = req.params;

    // Attempt to read an authenticated user from the token header (optional auth)
    let callerIsManager = false;
    const rawToken = req.header("token");
    if (rawToken) {
      try {
        const jwt = require("jsonwebtoken");
        const payload = jwt.verify(rawToken, process.env.JWT_SECRET);
        const center = await pool.query(
          "SELECT id FROM service_centers WHERE id = $1 AND manager_id = $2",
          [serviceCenterId, payload.user.id]
        );
        callerIsManager = center.rows.length > 0;
      } catch {
        // Invalid token — treat as unauthenticated
      }
    }

    if (callerIsManager) {
      // Full view for the owning manager
      const bookings = await pool.query(
        `SELECT sb.booking_date, sb.time_slot, u.name AS customer_name,
                v.make, v.model, sb.status, sb.service_type
         FROM service_bookings sb
         JOIN users u ON sb.customer_id = u.id
         JOIN vehicles v ON sb.vehicle_id = v.id
         WHERE sb.service_center_id = $1`,
        [serviceCenterId]
      );
      return res.json({ success: true, data: bookings.rows });
    }

    // Public view — only availability data, no PII
    const bookings = await pool.query(
      `SELECT sb.booking_date, sb.time_slot, sb.status
       FROM service_bookings sb
       WHERE sb.service_center_id = $1`,
      [serviceCenterId]
    );
    res.json({ success: true, data: bookings.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── GET /:id ─────────────────────────────────────────────────────────────────
// OWASP A01 fix: was missing an ownership check — any authenticated user could
// read any booking. Now enforces role-based scope:
//   customer → only their own bookings
//   manager  → only bookings at their service center
//   mechanic → only bookings linked to a job card assigned to them
router.get("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await pool.query(
      `SELECT sb.*, v.make, v.model, v.year, v.license_plate,
              u.name AS customer_name, u.email AS customer_email,
              ${SERVICES_JSON}, ${SERVICES_TOTAL}
       FROM service_bookings sb
       JOIN vehicles v ON sb.vehicle_id = v.id
       JOIN users u ON sb.customer_id = u.id
       WHERE sb.id = $1`,
      [id]
    );
    if (booking.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const b = booking.rows[0];
    const { role } = req.user;

    if (role === "customer" && b.customer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    if (role === "manager") {
      const center = await pool.query(
        "SELECT id FROM service_centers WHERE manager_id = $1 AND id = $2",
        [req.user.id, b.service_center_id]
      );
      if (center.rows.length === 0) {
        return res.status(403).json({ success: false, message: "Access Denied" });
      }
    }

    if (role === "mechanic") {
      const assigned = await pool.query(
        "SELECT id FROM job_cards WHERE booking_id = $1 AND mechanic_id = $2",
        [id, req.user.id]
      );
      if (assigned.rows.length === 0) {
        return res.status(403).json({ success: false, message: "Access Denied" });
      }
    }

    res.json({ success: true, data: b });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ─── PATCH /:id/status ────────────────────────────────────────────────────────
router.patch("/:id/status", authorize, userWriteLimiter, async (req, res) => {
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
