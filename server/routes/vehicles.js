const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");
const { userWriteLimiter } = require("../middleware/rateLimiter");
const { validateString, firstError } = require("../middleware/validate");

const currentYear = new Date().getFullYear();

// ─── POST / ───────────────────────────────────────────────────────────────────
router.post("/", authorize, userWriteLimiter, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can add vehicles." });
    }

    const { make, model, year, license_plate } = req.body;

    // ── Input validation ─────────────────────────────────────────────────────
    const err = firstError(
      validateString(make, "make", 60),
      validateString(model, "model", 60),
      validateString(license_plate, "license_plate", 20)
    );
    if (err) return res.status(400).json({ success: false, message: err });

    if (!year) {
      return res.status(400).json({ success: false, message: "year is required." });
    }
    const yearNum = Number(year);
    if (!Number.isInteger(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
      return res.status(400).json({
        success: false,
        message: `Year must be between 1900 and ${currentYear + 1}.`,
      });
    }

    // License plate: allow alphanumeric, hyphens, and spaces only
    if (!/^[A-Za-z0-9\s\-]+$/.test(license_plate.trim())) {
      return res.status(400).json({
        success: false,
        message: "License plate may only contain letters, numbers, hyphens, and spaces.",
      });
    }

    const newVehicle = await pool.query(
      "INSERT INTO vehicles (customer_id, make, model, year, license_plate) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, make.trim(), model.trim(), yearNum, license_plate.trim().toUpperCase()]
    );
    res.json({ success: true, data: newVehicle.rows[0] });
  } catch (err) {
    console.error(err.message);
    if (err.code === "23505") {
      return res.status(400).json({ success: false, message: "License plate already registered." });
    }
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── GET / ────────────────────────────────────────────────────────────────────
router.get("/", authorize, async (req, res) => {
  try {
    const vehicles = await pool.query(
      "SELECT * FROM vehicles WHERE customer_id = $1",
      [req.user.id]
    );
    res.json({ success: true, data: vehicles.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── DELETE /:id ──────────────────────────────────────────────────────────────
router.delete("/:id", authorize, userWriteLimiter, async (req, res) => {
  try {
    const { id } = req.params;

    const activeBookings = await pool.query(
      `SELECT id FROM service_bookings WHERE vehicle_id = $1 AND status IN ('pending','approved')`,
      [id]
    );
    if (activeBookings.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a vehicle with active bookings.",
      });
    }

    const result = await pool.query(
      "DELETE FROM vehicles WHERE id = $1 AND customer_id = $2 RETURNING id",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }
    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
