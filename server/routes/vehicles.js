const path = require("path");
const fs = require("fs");
const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");
const { userWriteLimiter } = require("../middleware/rateLimiter");
const { validateString, firstError } = require("../middleware/validate");

const currentYear = new Date().getFullYear();
const UPLOADS_DIR = path.join(__dirname, "..", "uploads", "vehicles");

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ─── POST / ───────────────────────────────────────────────────────────────────
router.post("/", authorize, userWriteLimiter, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can add vehicles." });
    }

    const { make, model, year, license_plate } = req.body;

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

// ─── GET / — excludes photo_url from list (fetched per-vehicle via URL) ───────
router.get("/", authorize, async (req, res) => {
  try {
    const vehicles = await pool.query(
      "SELECT id, customer_id, make, model, year, license_plate, created_at, updated_at, (photo_url IS NOT NULL) AS has_photo FROM vehicles WHERE customer_id = $1",
      [req.user.id]
    );
    // Build a usable photo_url for the frontend using the static endpoint path
    const rows = vehicles.rows.map((v) => ({
      ...v,
      photo_url: v.has_photo ? `/uploads/vehicles/${v.id}.jpg` : null,
    }));
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ─── PATCH /:id/photo — accepts base64 data URL, saves to disk ───────────────
router.patch("/:id/photo", authorize, userWriteLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { photo_url } = req.body;

    if (!photo_url) {
      return res.status(400).json({ success: false, message: "photo_url is required." });
    }
    if (!photo_url.startsWith("data:image/")) {
      return res.status(400).json({ success: false, message: "Invalid image format." });
    }
    if (photo_url.length > 4_000_000) {
      return res.status(400).json({ success: false, message: "Image too large. Max ~3 MB." });
    }

    // Confirm vehicle belongs to this user
    const check = await pool.query(
      "SELECT id FROM vehicles WHERE id = $1 AND customer_id = $2",
      [id, req.user.id]
    );
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Vehicle not found." });
    }

    // Decode base64 and write to disk as <vehicle-id>.jpg
    const base64Data = photo_url.replace(/^data:image\/\w+;base64,/, "");
    const filePath = path.join(UPLOADS_DIR, `${id}.jpg`);
    fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));

    // Store a lightweight marker in DB (just a timestamp so we know the file exists)
    await pool.query(
      "UPDATE vehicles SET photo_url = $1, updated_at = NOW() WHERE id = $2",
      [`/uploads/vehicles/${id}.jpg`, id]
    );

    res.json({ success: true, photo_url: `/uploads/vehicles/${id}.jpg` });
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

    // Clean up photo file if it exists
    const filePath = path.join(UPLOADS_DIR, `${id}.jpg`);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
