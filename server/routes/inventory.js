const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Get Inventory
router.get("/:serviceCenterId", authorize, async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    const items = await pool.query("SELECT * FROM inventory WHERE service_center_id = $1", [serviceCenterId]);
    res.json(items.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add Item
router.post("/", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json("Access Denied");
    const { service_center_id, part_name, quantity, price } = req.body;
    const item = await pool.query(
      "INSERT INTO inventory (service_center_id, part_name, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [service_center_id, part_name, quantity, price]
    );
    res.json(item.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update Stock
router.patch("/:id/stock", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json("Access Denied");
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await pool.query("UPDATE inventory SET quantity = $1 WHERE id = $2 RETURNING *", [quantity, id]);
    res.json(item.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Add Part to Job
router.post("/job-parts", authorize, async (req, res) => {
  try {
    const { job_card_id, inventory_id, quantity } = req.body;
    // Check stock
    const stock = await pool.query("SELECT quantity FROM inventory WHERE id = $1", [inventory_id]);
    if (stock.rows[0].quantity < quantity) return res.status(400).json("Insufficient stock");
    
    // Deduct stock
    await pool.query("UPDATE inventory SET quantity = quantity - $1 WHERE id = $2", [quantity, inventory_id]);
    
    // Add job part
    const jobPart = await pool.query(
      "INSERT INTO job_parts (job_card_id, inventory_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [job_card_id, inventory_id, quantity]
    );
    res.json(jobPart.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
