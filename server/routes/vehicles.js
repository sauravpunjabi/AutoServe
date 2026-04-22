const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Add Vehicle
router.post("/", authorize, async (req, res) => {
  try {
    const { make, model, year, license_plate } = req.body;
    const newVehicle = await pool.query(
      "INSERT INTO vehicles (customer_id, make, model, year, license_plate) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [req.user.id, make, model, year, license_plate]
    );
    res.json({ success: true, data: newVehicle.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// List My Vehicles
router.get("/", authorize, async (req, res) => {
  try {
    const vehicles = await pool.query("SELECT * FROM vehicles WHERE customer_id = $1", [req.user.id]);
    res.json({ success: true, data: vehicles.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Delete Vehicle
router.delete("/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM vehicles WHERE id = $1 AND customer_id = $2", [id, req.user.id]);
    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
