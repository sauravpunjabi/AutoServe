require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const pool = require('../db');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Idempotency check
    const check = await pool.query("SELECT id FROM users WHERE email = 'manager@autoserve.demo'");
    if (check.rows.length > 0) {
      console.log('Already seeded. Skipping.');
      await pool.end();
      return;
    }

    const hash = await bcrypt.hash('Demo@1234', await bcrypt.genSalt(10));

    // ── 1. Users ──────────────────────────────────────────────────────────────
    const upsertUser = async (name, email, role, status = 'active') => {
      await pool.query(
        `INSERT INTO users (name, email, password, role, status) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (email) DO NOTHING`,
        [name, email, hash, role, status]
      );
      return (await pool.query('SELECT id FROM users WHERE email = $1', [email])).rows[0].id;
    };

    await upsertUser('Admin User',    'admin@autoserve.demo',     'admin');
    const managerId = await upsertUser('Raj Sharma',    'manager@autoserve.demo',   'manager');
    const mech1Id   = await upsertUser('Arjun Mehta',   'mechanic1@autoserve.demo', 'mechanic', 'pending');
    const mech2Id   = await upsertUser('Vikram Singh',  'mechanic2@autoserve.demo', 'mechanic', 'pending');
    const cust1Id   = await upsertUser('Priya Patel',   'customer1@autoserve.demo', 'customer');
    const cust2Id   = await upsertUser('Rahul Gupta',   'customer2@autoserve.demo', 'customer');

    // ── 2. Service center ─────────────────────────────────────────────────────
    let centerRes = await pool.query('SELECT id FROM service_centers WHERE manager_id = $1', [managerId]);
    let centerId;
    if (centerRes.rows.length === 0) {
      const r = await pool.query(
        `INSERT INTO service_centers (name, address, phone, email, manager_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
        ['AutoServe Express - Pune', '123 MG Road, Pune, Maharashtra 411001', '020-12345678', 'pune@autoserve.demo', managerId]
      );
      centerId = r.rows[0].id;
    } else {
      centerId = centerRes.rows[0].id;
    }

    // ── 3. Assign mechanics (and manager) to service center ───────────────────
    await pool.query(
      `UPDATE users SET service_center_id = $1, status = 'active' WHERE email IN ('mechanic1@autoserve.demo', 'mechanic2@autoserve.demo')`,
      [centerId]
    );
    await pool.query(`UPDATE users SET service_center_id = $1 WHERE email = 'manager@autoserve.demo'`, [centerId]);

    // ── 4. Vehicles ───────────────────────────────────────────────────────────
    const upsertVehicle = async (customerId, make, model, year, plate) => {
      await pool.query(
        `INSERT INTO vehicles (customer_id, make, model, year, license_plate) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (license_plate) DO NOTHING`,
        [customerId, make, model, year, plate]
      );
      return (await pool.query('SELECT id FROM vehicles WHERE license_plate = $1', [plate])).rows[0].id;
    };
    const v1Id = await upsertVehicle(cust1Id, 'Honda',   'City',  2022, 'MH12AB1234');
    const v2Id = await upsertVehicle(cust1Id, 'Maruti',  'Swift', 2020, 'MH14CD5678');
    const v3Id = await upsertVehicle(cust2Id, 'Hyundai', 'Creta', 2023, 'MH04EF9012');

    // ── 5. Services (look up existing, insert if missing) ─────────────────────
    const SERVICE_DEFAULTS = {
      'Oil Change':        800,
      'Brake Inspection':  500,
      'Wheel Alignment':   600,
      'General Inspection':400,
      'AC Service':       1200,
    };
    const svc = {};
    for (const [name, defaultPrice] of Object.entries(SERVICE_DEFAULTS)) {
      let r = await pool.query('SELECT id, base_price FROM services WHERE name = $1 AND is_active = true LIMIT 1', [name]);
      if (r.rows.length === 0) {
        r = await pool.query('INSERT INTO services (name, base_price) VALUES ($1,$2) RETURNING id, base_price', [name, defaultPrice]);
      }
      svc[name] = { id: r.rows[0].id, price: parseFloat(r.rows[0].base_price) };
    }

    // ── 6. Bookings ───────────────────────────────────────────────────────────
    const getOrCreateBooking = async (customerId, vehicleId, serviceType, dateExpr, timeSlot, status) => {
      const existing = await pool.query(
        `SELECT id FROM service_bookings WHERE customer_id = $1 AND vehicle_id = $2 AND time_slot = $3::time`,
        [customerId, vehicleId, timeSlot]
      );
      if (existing.rows.length > 0) return existing.rows[0].id;
      const r = await pool.query(
        // dateExpr is a safe hard-coded SQL expression (CURRENT_DATE, CURRENT_DATE + 1, etc.)
        `INSERT INTO service_bookings (customer_id, vehicle_id, service_center_id, service_type, booking_date, time_slot, status)
         VALUES ($1,$2,$3,$4,${dateExpr},$5,$6) RETURNING id`,
        [customerId, vehicleId, centerId, serviceType, timeSlot, status]
      );
      return r.rows[0].id;
    };

    const b1Id = await getOrCreateBooking(cust1Id, v1Id, 'Oil Change, Brake Inspection', 'CURRENT_DATE',     '10:00', 'completed');
    const b2Id = await getOrCreateBooking(cust1Id, v2Id, 'Wheel Alignment',              'CURRENT_DATE + 1', '11:00', 'approved');
    const b3Id = await getOrCreateBooking(cust2Id, v3Id, 'General Inspection, AC Service','CURRENT_DATE + 2', '14:00', 'pending');

    // ── 7. Booking services ───────────────────────────────────────────────────
    const addBookingSvc = async (bookingId, svcName) => {
      const { id, price } = svc[svcName];
      await pool.query(
        `INSERT INTO booking_services (booking_id, service_id, price)
         SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT 1 FROM booking_services WHERE booking_id=$1 AND service_id=$2)`,
        [bookingId, id, price]
      );
    };
    await addBookingSvc(b1Id, 'Oil Change');
    await addBookingSvc(b1Id, 'Brake Inspection');
    await addBookingSvc(b2Id, 'Wheel Alignment');
    await addBookingSvc(b3Id, 'General Inspection');
    await addBookingSvc(b3Id, 'AC Service');

    // ── 8. Job cards ──────────────────────────────────────────────────────────
    const getOrCreateJobCard = async (bookingId, mechanicId, status, laborCost) => {
      const r = await pool.query(
        `INSERT INTO job_cards (booking_id, mechanic_id, status, labor_cost) VALUES ($1,$2,$3,$4) ON CONFLICT (booking_id) DO NOTHING RETURNING id`,
        [bookingId, mechanicId, status, laborCost]
      );
      if (r.rows.length > 0) return r.rows[0].id;
      return (await pool.query('SELECT id FROM job_cards WHERE booking_id = $1', [bookingId])).rows[0].id;
    };
    const jc1Id = await getOrCreateJobCard(b1Id, mech1Id, 'completed',   500.00);
    const jc2Id = await getOrCreateJobCard(b2Id, mech2Id, 'in_progress', 0);

    // ── 9. Job tasks ──────────────────────────────────────────────────────────
    const addTask = async (jobCardId, description, status) => {
      await pool.query(
        `INSERT INTO job_tasks (job_card_id, description, status)
         SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT 1 FROM job_tasks WHERE job_card_id=$1 AND description=$2)`,
        [jobCardId, description, status]
      );
    };
    for (const [desc, st] of [
      ['Drain old engine oil',       'completed'],
      ['Replace oil filter',         'completed'],
      ['Add new synthetic oil',      'completed'],
      ['Inspect brake pads',         'completed'],
      ['Check brake fluid level',    'completed'],
    ]) await addTask(jc1Id, desc, st);

    for (const [desc, st] of [
      ['Check tire pressure',         'completed'],
      ['Align front wheels',          'in_progress'],
      ['Align rear wheels',           'pending'],
      ['Test drive for verification', 'pending'],
    ]) await addTask(jc2Id, desc, st);

    // ── 10. Parts & inventory ─────────────────────────────────────────────────
    const partsData = [
      ['Engine Oil 5W30',   'Synthetic engine oil',  350.00, 50, 10],
      ['Oil Filter',        'Standard oil filter',   120.00, 30,  5],
      ['Brake Pads (Front)','Front brake pads set',  800.00, 20,  4],
      ['Coolant',           'Engine coolant',        200.00, 25,  5],
      ['Air Filter',        'Engine air filter',     150.00, 15,  3],
    ];
    for (const [name, desc, price, qty, threshold] of partsData) {
      let r = await pool.query('SELECT id FROM parts WHERE name = $1 LIMIT 1', [name]);
      let partId;
      if (r.rows.length === 0) {
        r = await pool.query('INSERT INTO parts (name, description, unit_price) VALUES ($1,$2,$3) RETURNING id', [name, desc, price]);
        partId = r.rows[0].id;
      } else {
        partId = r.rows[0].id;
      }
      await pool.query(
        `INSERT INTO inventory (service_center_id, part_id, quantity, low_stock_threshold) VALUES ($1,$2,$3,$4) ON CONFLICT (service_center_id, part_id) DO NOTHING`,
        [centerId, partId, qty, threshold]
      );
    }

    // ── 11. Invoice (booking 1 / job card 1) ──────────────────────────────────
    const servicesTotal = svc['Oil Change'].price + svc['Brake Inspection'].price;
    await pool.query(
      `INSERT INTO invoices (job_card_id, booking_id, customer_id, labor_cost, parts_cost, services_total, total_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (job_card_id) DO NOTHING`,
      [jc1Id, b1Id, cust1Id, 500.00, 0, servicesTotal, 500.00 + servicesTotal, 'paid']
    );

    // ── 12. Review ────────────────────────────────────────────────────────────
    const reviewExists = await pool.query(
      'SELECT 1 FROM service_center_reviews WHERE service_center_id = $1 AND customer_id = $2',
      [centerId, cust1Id]
    );
    if (!reviewExists.rows.length) {
      await pool.query(
        'INSERT INTO service_center_reviews (service_center_id, customer_id, rating, comment) VALUES ($1,$2,$3,$4)',
        [centerId, cust1Id, 5, 'Excellent service! The team was professional and finished on time.']
      );
    }

    console.log('✅ Seed complete');
  } catch (err) {
    console.error('❌ Seed failed:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
