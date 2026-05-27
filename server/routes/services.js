const router = require("express").Router();
const pool = require("../db");
const { publicReadLimiter } = require("../middleware/rateLimiter");

// ─── GET / ────────────────────────────────────────────────────────────────────
// Public endpoint — rate-limited to prevent automated scraping of the service catalog
router.get("/", publicReadLimiter, async (req, res) => {
  try {
    const services = await pool.query(
      "SELECT * FROM services WHERE is_active = true ORDER BY name ASC"
    );
    res.json({ success: true, data: services.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
