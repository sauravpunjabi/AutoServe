const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// --- Invoices Routes --- //
// Generate Invoice
router.post("/invoices", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json({ success: false, message: "Access Denied" });
    const { job_card_id, booking_id, customer_id, labor_cost } = req.body;
    
    // Calculate parts cost
    const parts = await pool.query(`
      SELECT jp.quantity_used, p.unit_price FROM job_parts jp
      JOIN parts p ON jp.part_id = p.id
      WHERE jp.job_card_id = $1
    `, [job_card_id]);
    
    const parts_cost = parts.rows.reduce((acc, curr) => acc + (curr.quantity_used * curr.unit_price), 0);
    const total_amount = Number(labor_cost) + parts_cost;

    const invoice = await pool.query(
      "INSERT INTO invoices (job_card_id, booking_id, customer_id, labor_cost, parts_cost, total_amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [job_card_id, booking_id, customer_id, labor_cost, parts_cost, total_amount]
    );
    res.json({ success: true, data: invoice.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Get My Invoices (Customer)
router.get("/invoices/me", authorize, async (req, res) => {
  try {
    const invoices = await pool.query("SELECT * FROM invoices WHERE customer_id = $1", [req.user.id]);
    res.json({ success: true, data: invoices.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// --- Admin Routes --- //
router.get("/admin/users", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Access Denied" });
    const users = await pool.query("SELECT id, name, email, role, status, created_at FROM users");
    res.json({ success: true, data: users.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.patch("/admin/users/:id/status", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Access Denied" });
    const { status } = req.body;
    const user = await pool.query("UPDATE users SET status = $1 WHERE id = $2 RETURNING id, name, status", [status, req.params.id]);
    res.json({ success: true, data: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/admin/analytics", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ success: false, message: "Access Denied" });
    
    // Total users, bookings, revenue
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const bookingsCount = await pool.query("SELECT COUNT(*) FROM service_bookings");
    const revenue = await pool.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM invoices");
    
    const revenuePerCenter = await pool.query(`
      SELECT sc.name, COALESCE(SUM(i.total_amount), 0) as total_revenue
      FROM service_centers sc
      LEFT JOIN service_bookings sb ON sc.id = sb.service_center_id
      LEFT JOIN invoices i ON sb.id = i.booking_id
      GROUP BY sc.name
    `);

    const bookingsOverTime = await pool.query(`
      SELECT TO_CHAR(booking_date, 'Mon') as name, COUNT(*) as bookings
      FROM service_bookings
      GROUP BY TO_CHAR(booking_date, 'Mon')
    `);

    res.json({
      success: true,
      data: {
        stats: {
          users: parseInt(usersCount.rows[0].count),
          bookings: parseInt(bookingsCount.rows[0].count),
          revenue: revenue.rows[0].total || 0
        },
        revenuePerCenter: revenuePerCenter.rows.map(r => ({ name: r.name, revenue: Number(r.total_revenue) })),
        bookingsOverTime: bookingsOverTime.rows.map(b => ({ name: b.name, bookings: Number(b.bookings) }))
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
