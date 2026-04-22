const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// Add Part
router.post("/parts", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { name, description, unit_price } = req.body;
    const part = await pool.query(
      "INSERT INTO parts (name, description, unit_price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, unit_price]
    );
    res.json({ success: true, data: part.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Add to Inventory
router.post("/", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { service_center_id, part_id, quantity, low_stock_threshold } = req.body;
    const inv = await pool.query(
      "INSERT INTO inventory (service_center_id, part_id, quantity, low_stock_threshold) VALUES ($1, $2, $3, $4) ON CONFLICT (service_center_id, part_id) DO UPDATE SET quantity = inventory.quantity + $3 RETURNING *",
      [service_center_id, part_id, quantity, low_stock_threshold || 10]
    );
    res.json({ success: true, data: inv.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get Inventory
router.get("/:serviceCenterId", authorize, async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    const items = await pool.query(`
      SELECT i.*, p.name, p.unit_price 
      FROM inventory i
      JOIN parts p ON i.part_id = p.id
      WHERE i.service_center_id = $1
    `, [serviceCenterId]);
    res.json({ success: true, data: items.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Add Part to Job
router.post("/job-parts/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params; // job_card_id
    const { part_id, quantity_used, service_center_id } = req.body;
    
    // Check stock
    const stock = await pool.query("SELECT quantity FROM inventory WHERE part_id = $1 AND service_center_id = $2", [part_id, service_center_id]);
    if (stock.rows.length === 0 || stock.rows[0].quantity < quantity_used) {
        return res.status(400).json({ success: false, message: "Insufficient stock" });
    }
    
    // Deduct stock
    await pool.query("UPDATE inventory SET quantity = quantity - $1 WHERE part_id = $2 AND service_center_id = $3", [quantity_used, part_id, service_center_id]);
    
    // Add job part
    const jobPart = await pool.query(
      "INSERT INTO job_parts (job_card_id, part_id, quantity_used) VALUES ($1, $2, $3) RETURNING *",
      [id, part_id, quantity_used]
    );
    res.json({ success: true, data: jobPart.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
