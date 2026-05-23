const router = require("express").Router();
const pool = require("../db");

router.get("/", async (req, res) => {
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
