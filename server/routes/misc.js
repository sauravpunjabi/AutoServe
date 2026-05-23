const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authMiddleware");

router.post("/invoices", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { job_card_id, booking_id, customer_id, labor_cost } = req.body;

    if (!job_card_id || !booking_id || !customer_id || labor_cost === undefined) {
      return res.status(400).json({
        success: false,
        message: "job_card_id, booking_id, customer_id, and labor_cost are required.",
      });
    }

    const labor = Number(labor_cost);
    if (Number.isNaN(labor) || labor < 0) {
      return res.status(400).json({ success: false, message: "labor_cost must be a non-negative number." });
    }

    const existing = await pool.query("SELECT id FROM invoices WHERE job_card_id = $1", [job_card_id]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Invoice already exists for this job card." });
    }

    const parts = await pool.query(
      `SELECT jp.quantity_used, p.unit_price FROM job_parts jp
       JOIN parts p ON jp.part_id = p.id
       WHERE jp.job_card_id = $1`,
      [job_card_id]
    );

    const parts_cost = parts.rows.reduce(
      (acc, curr) => acc + curr.quantity_used * parseFloat(curr.unit_price),
      0
    );
    const total_amount = labor + parts_cost;

    const invoice = await pool.query(
      `INSERT INTO invoices (job_card_id, booking_id, customer_id, labor_cost, parts_cost, total_amount)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [job_card_id, booking_id, customer_id, labor, parts_cost, total_amount]
    );
    res.json({ success: true, data: invoice.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/invoices/manager", authorize, async (req, res) => {
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const invoices = await pool.query(
      `SELECT i.*, sb.service_type, sb.booking_date, u.name as customer_name
       FROM invoices i
       JOIN service_bookings sb ON i.booking_id = sb.id
       JOIN service_centers sc ON sb.service_center_id = sc.id
       JOIN users u ON i.customer_id = u.id
       WHERE sc.manager_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: invoices.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/invoices/me", authorize, async (req, res) => {
  try {
    const invoices = await pool.query(
      "SELECT * FROM invoices WHERE customer_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ success: true, data: invoices.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/reviews", authorize, async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, message: "Only customers can leave reviews." });
    }

    const { service_center_id, rating, comment } = req.body;
    if (!service_center_id || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const review = await pool.query(
      `INSERT INTO service_center_reviews (service_center_id, customer_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [service_center_id, req.user.id, rating, comment || null]
    );
    res.json({ success: true, data: review.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/admin/users", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }
    const users = await pool.query(
      "SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC"
    );
    res.json({ success: true, data: users.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.patch("/admin/users/:id/status", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    const { status } = req.body;
    if (!status || !["active", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const user = await pool.query(
      "UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, email, role, status",
      [status, req.params.id]
    );
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, data: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/admin/analytics", authorize, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

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
      GROUP BY TO_CHAR(booking_date, 'Mon'), TO_CHAR(booking_date, 'YYYY-MM')
      ORDER BY MIN(booking_date)
    `);

    res.json({
      success: true,
      data: {
        stats: {
          users: parseInt(usersCount.rows[0].count, 10),
          bookings: parseInt(bookingsCount.rows[0].count, 10),
          revenue: revenue.rows[0].total || 0,
        },
        revenuePerCenter: revenuePerCenter.rows.map((r) => ({
          name: r.name,
          revenue: Number(r.total_revenue),
        })),
        bookingsOverTime: bookingsOverTime.rows.map((b) => ({
          name: b.name,
          bookings: Number(b.bookings),
        })),
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
