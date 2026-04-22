const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

// --- Invoices Routes --- //
// Generate Invoice
router.post("/invoices", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") return res.status(403).json("Access Denied");
    const { job_card_id, customer_id, labor_cost } = req.body;
    
    // Calculate parts cost
    const parts = await pool.query(`
      SELECT jp.quantity, i.price FROM job_parts jp
      JOIN inventory i ON jp.inventory_id = i.id
      WHERE jp.job_card_id = $1
    `, [job_card_id]);
    
    const parts_cost = parts.rows.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    const total_cost = Number(labor_cost) + parts_cost;

    const invoice = await pool.query(
      "INSERT INTO invoices (job_card_id, customer_id, labor_cost, parts_cost, total_cost) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [job_card_id, customer_id, labor_cost, parts_cost, total_cost]
    );
    res.json(invoice.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get My Invoices (Customer)
router.get("/invoices/me", authorize, async (req, res) => {
  try {
    const invoices = await pool.query("SELECT * FROM invoices WHERE customer_id = $1", [req.user.id]);
    res.json(invoices.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- Admin Routes --- //
router.get("/admin/users", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json("Access Denied");
    const users = await pool.query("SELECT user_id, full_name, email, role, created_at FROM users");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/admin/analytics", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json("Access Denied");
    
    // Total users, bookings, revenue
    const usersCount = await pool.query("SELECT COUNT(*) FROM users");
    const bookingsCount = await pool.query("SELECT COUNT(*) FROM service_bookings");
    const revenue = await pool.query("SELECT SUM(total_cost) as total FROM invoices");
    
    // Revenue per service center (mocked structure if not fully JOINed)
    const revenuePerCenter = await pool.query(`
      SELECT sc.name, COALESCE(SUM(i.total_cost), 0) as total_revenue
      FROM service_centers sc
      LEFT JOIN service_bookings sb ON sc.id = sb.service_center_id
      LEFT JOIN job_cards jc ON sb.id = jc.booking_id
      LEFT JOIN invoices i ON jc.id = i.job_card_id
      GROUP BY sc.name
    `);

    // Bookings over time (by month)
    const bookingsOverTime = await pool.query(`
      SELECT TO_CHAR(booking_date, 'Mon') as name, COUNT(*) as bookings
      FROM service_bookings
      GROUP BY TO_CHAR(booking_date, 'Mon')
    `);

    res.json({
      stats: {
        users: parseInt(usersCount.rows[0].count),
        bookings: parseInt(bookingsCount.rows[0].count),
        revenue: revenue.rows[0].total || 0
      },
      revenuePerCenter: revenuePerCenter.rows.map(r => ({ name: r.name, revenue: Number(r.total_revenue) })),
      bookingsOverTime: bookingsOverTime.rows.map(b => ({ name: b.name, bookings: Number(b.bookings) }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
