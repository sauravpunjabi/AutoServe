const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

router.post("/parts", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { name, description, unit_price } = req.body;
    if (!name || unit_price === undefined || unit_price === null) {
      return res.status(400).json({ success: false, message: "name and unit_price are required." });
    }

    const price = Number(unit_price);
    if (Number.isNaN(price) || price <= 0) {
      return res.status(400).json({ success: false, message: "unit_price must be a positive number." });
    }

    const part = await pool.query(
      "INSERT INTO parts (name, description, unit_price) VALUES ($1, $2, $3) RETURNING *",
      [name, description || null, price]
    );
    res.json({ success: true, data: part.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { service_center_id, part_id, quantity, low_stock_threshold } = req.body;

    if (!service_center_id || !part_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "service_center_id, part_id, and quantity are required.",
      });
    }

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 0) {
      return res.status(400).json({ success: false, message: "quantity must be a non-negative integer." });
    }

    const inv = await pool.query(
      `INSERT INTO inventory (service_center_id, part_id, quantity, low_stock_threshold)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (service_center_id, part_id)
       DO UPDATE SET quantity = inventory.quantity + $3, updated_at = NOW()
       RETURNING *`,
      [service_center_id, part_id, qty, low_stock_threshold || 10]
    );
    res.json({ success: true, data: inv.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/:serviceCenterId", authorize, async (req, res) => {
  try {
    const { serviceCenterId } = req.params;
    const items = await pool.query(
      `SELECT i.*, p.name, p.description, p.unit_price
       FROM inventory i
       JOIN parts p ON i.part_id = p.id
       WHERE i.service_center_id = $1`,
      [serviceCenterId]
    );
    res.json({ success: true, data: items.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/job-parts/:id", authorize, async (req, res) => {
  try {
    const { id } = req.params;
    const { part_id, quantity_used, service_center_id } = req.body;

    if (!part_id || !quantity_used || !service_center_id) {
      return res.status(400).json({
        success: false,
        message: "part_id, quantity_used, and service_center_id are required.",
      });
    }

    const qty = Number(quantity_used);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ success: false, message: "quantity_used must be a positive integer." });
    }

    const stock = await pool.query(
      "SELECT quantity FROM inventory WHERE part_id = $1 AND service_center_id = $2",
      [part_id, service_center_id]
    );
    if (stock.rows.length === 0 || stock.rows[0].quantity < qty) {
      return res.status(400).json({ success: false, message: "Insufficient stock" });
    }

    await pool.query(
      "UPDATE inventory SET quantity = quantity - $1, updated_at = NOW() WHERE part_id = $2 AND service_center_id = $3",
      [qty, part_id, service_center_id]
    );

    const jobPart = await pool.query(
      "INSERT INTO job_parts (job_card_id, part_id, quantity_used) VALUES ($1, $2, $3) RETURNING *",
      [id, part_id, qty]
    );
    res.json({ success: true, data: jobPart.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
