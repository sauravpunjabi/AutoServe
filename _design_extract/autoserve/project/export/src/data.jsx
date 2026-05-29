// Mock data for AutoServe. Globally exposed for other scripts.

const DB = {
  user: {
    customer: { id: 'CU-44193', name: 'Marcus Holloway', email: 'marcus.h@protonmail.com', phone: '+1 415 555 0188', tier: 'PLATINUM' },
    manager:  { id: 'MG-00047', name: 'Priya Chandrasekaran', email: 'priya.c@autoserve.io', center: 'SF-MISSION-01' },
    mechanic: { id: 'MC-01182', name: 'Diego Marquez', email: 'diego.m@autoserve.io', cert: 'ASE Master · L1', center: 'SF-MISSION-01' },
    admin:    { id: 'AD-00003', name: 'Yuki Tanaka', email: 'yuki.t@autoserve.io', region: 'NORAM-WEST' },
  },

  vehicles: [
    { id: 'VH-9201', make: 'Tesla',   model: 'Model 3 Long Range', year: 2023, plate: '8KQA-291', vin: '5YJ3E1EA7PF483912', miles: 24187, color: 'Solid Black',     nextService: '2026-08-12', battery: 84 },
    { id: 'VH-9202', make: 'Honda',   model: 'Civic Si',            year: 2019, plate: '6BFD-104', vin: '2HGFC3B98KH700421', miles: 71204, color: 'Rallye Red',     nextService: '2026-06-04', battery: null },
    { id: 'VH-9203', make: 'Toyota',  model: 'Tacoma TRD Off-Road', year: 2021, plate: '9LMC-877', vin: '3TMCZ5AN6MM411203', miles: 43891, color: 'Cement Gray',    nextService: '2026-07-22', battery: null },
  ],

  services: [
    { code: 'SVC-OIL-01', name: 'Full Synthetic Oil & Filter Change',          duration: 45,  price: 89.00 },
    { code: 'SVC-BRK-02', name: 'Brake Pad Replacement (Front)',               duration: 120, price: 320.00 },
    { code: 'SVC-DGN-01', name: 'Full OBD-II Diagnostic Scan',                 duration: 60,  price: 145.00 },
    { code: 'SVC-TIR-03', name: 'Tire Rotation & Pressure Balance',            duration: 30,  price: 49.00 },
    { code: 'SVC-AC-01',  name: 'AC Recharge + Refrigerant Pressure Test',     duration: 75,  price: 175.00 },
    { code: 'SVC-BAT-04', name: 'High Voltage Battery Health Report (EV)',     duration: 90,  price: 220.00 },
    { code: 'SVC-ALN-02', name: '4-Wheel Laser Alignment',                     duration: 60,  price: 189.00 },
  ],

  // Active job for the customer's hero (live progress)
  activeJob: {
    id: 'JC-2026-08471',
    vehicleId: 'VH-9201',
    centerId: 'SF-MISSION-01',
    mechanicId: 'MC-01182',
    startedAt: '2026-05-27T09:14:00-07:00',
    estComplete: '2026-05-27T12:30:00-07:00',
    services: ['SVC-DGN-01', 'SVC-BAT-04', 'SVC-TIR-03'],
    bayId: 'BAY-03',
    tasks: [
      { id: 't1', label: 'Vehicle intake & exterior walkaround',          status: 'done',       at: '09:14' },
      { id: 't2', label: 'OBD-II port connected · ECU snapshot captured', status: 'done',       at: '09:28' },
      { id: 't3', label: 'High voltage battery health scan (96 cells)',   status: 'done',       at: '09:51' },
      { id: 't4', label: 'Tire rotation — FL/FR/RL/RR · torque to spec',  status: 'in_progress',at: '10:32' },
      { id: 't5', label: 'Brake fluid moisture test',                     status: 'pending',    at: null },
      { id: 't6', label: 'Final QA · road test · client handoff',         status: 'pending',    at: null },
    ],
  },

  history: [
    { id: 'JC-2026-07112', date: '2026-04-18', vehicleId: 'VH-9201', services: 'Full Synthetic Oil & Filter Change, Tire Rotation', total: 138.00, status: 'completed', invoice: 'INV-08901' },
    { id: 'JC-2026-06088', date: '2026-03-02', vehicleId: 'VH-9202', services: '4-Wheel Laser Alignment, Brake Pad Replacement (Front), Brake Fluid Flush', total: 612.00, status: 'completed', invoice: 'INV-08712' },
    { id: 'JC-2026-05031', date: '2026-02-11', vehicleId: 'VH-9203', services: 'AC Recharge + Refrigerant Pressure Test', total: 175.00, status: 'completed', invoice: 'INV-08501' },
    { id: 'JC-2025-09917', date: '2025-12-04', vehicleId: 'VH-9201', services: 'Full OBD-II Diagnostic Scan, Cabin Air Filter, Wiper Blade Set', total: 218.00, status: 'completed', invoice: 'INV-08124' },
    { id: 'JC-2025-09431', date: '2025-11-21', vehicleId: 'VH-9202', services: 'Tire Rotation & Pressure Balance', total: 49.00, status: 'cancelled', invoice: null },
  ],

  invoices: [
    { id: 'INV-08901', date: '2026-04-18', amount: 138.00, status: 'paid',    job: 'JC-2026-07112' },
    { id: 'INV-08712', date: '2026-03-02', amount: 612.00, status: 'paid',    job: 'JC-2026-06088' },
    { id: 'INV-08501', date: '2026-02-11', amount: 175.00, status: 'paid',    job: 'JC-2026-05031' },
    { id: 'INV-09014', date: '2026-05-27', amount: 540.00, status: 'pending', job: 'JC-2026-08471' },
  ],

  // Manager view
  approvals: [
    { id: 'BK-2026-1142', customer: 'Anika Rao',         vehicle: '2020 Subaru Outback · 5VNR-882',  services: 'Brake Pad Replacement (Rear), Brake Fluid Flush', requested: '2026-05-28 10:00', priority: 'normal',   created: '2m ago' },
    { id: 'BK-2026-1141', customer: 'Jonas Eriksen',     vehicle: '2024 Ford F-150 Lightning · 7TQE-405', services: 'High Voltage Battery Health Report (EV)',         requested: '2026-05-28 14:30', priority: 'high',     created: '7m ago' },
    { id: 'BK-2026-1140', customer: 'Tomás Beltrán',     vehicle: '2017 BMW 340i · 3KCV-188',         services: 'Full OBD-II Diagnostic Scan, Coolant Flush',        requested: '2026-05-29 08:00', priority: 'normal',   created: '14m ago' },
    { id: 'BK-2026-1139', customer: 'Eleanor Whitcombe', vehicle: '2022 Rivian R1T · 4RIV-771',       services: '4-Wheel Laser Alignment, Tire Rotation',           requested: '2026-05-29 11:15', priority: 'critical', created: '23m ago' },
    { id: 'BK-2026-1138', customer: 'Wei-Lun Chang',     vehicle: '2018 Mazda CX-5 · 2MZD-902',       services: 'AC Recharge + Refrigerant Pressure Test',          requested: '2026-05-30 09:00', priority: 'normal',   created: '41m ago' },
  ],

  mechanics: [
    { id: 'MC-01182', name: 'Diego Marquez',    cert: 'ASE Master · L1', activeJobs: 1, capacity: 3, status: 'on-shift',  shiftEnds: '18:00', utilization: 67 },
    { id: 'MC-01183', name: 'Hailey Okafor',    cert: 'ASE · Brakes',    activeJobs: 2, capacity: 3, status: 'on-shift',  shiftEnds: '18:00', utilization: 88 },
    { id: 'MC-01184', name: 'Rafael Costa',     cert: 'EV Specialist',   activeJobs: 0, capacity: 2, status: 'on-shift',  shiftEnds: '20:00', utilization: 12 },
    { id: 'MC-01185', name: 'Sandra Petrov',    cert: 'ASE · Engine',    activeJobs: 3, capacity: 3, status: 'at-capacity',shiftEnds: '18:00', utilization: 100 },
    { id: 'MC-01186', name: 'Kenji Watanabe',   cert: 'ASE · Suspension',activeJobs: 1, capacity: 3, status: 'on-shift',  shiftEnds: '22:00', utilization: 42 },
    { id: 'MC-01187', name: 'Beatrix Lindqvist',cert: 'Diagnostics',     activeJobs: 0, capacity: 2, status: 'off-shift', shiftEnds: '—',     utilization: 0 },
  ],

  bays: [
    { id: 'BAY-01', status: 'occupied', jobId: 'JC-2026-08469', vehicle: '2018 Audi A4',         eta: '11:45' },
    { id: 'BAY-02', status: 'occupied', jobId: 'JC-2026-08470', vehicle: '2022 Honda Odyssey',   eta: '13:20' },
    { id: 'BAY-03', status: 'occupied', jobId: 'JC-2026-08471', vehicle: '2023 Tesla Model 3',   eta: '12:30' },
    { id: 'BAY-04', status: 'open',     jobId: null,            vehicle: null,                   eta: null },
    { id: 'BAY-05', status: 'occupied', jobId: 'JC-2026-08472', vehicle: '2019 Toyota RAV4',     eta: '14:10' },
    { id: 'BAY-06', status: 'service',  jobId: null,            vehicle: null,                   eta: null },
  ],

  inventory: [
    { sku: 'OIL-5W30-MOB1', name: 'Mobil 1 Full Synthetic 5W-30 · 1qt',    stock: 4,  reorder: 12, supplier: 'Mobil USA',    cost: 9.80 },
    { sku: 'BRK-PAD-AKB-F', name: 'Akebono ProACT Brake Pads · Front',     stock: 2,  reorder: 6,  supplier: 'Akebono',      cost: 78.50 },
    { sku: 'FLT-AIR-K&N-1', name: 'K&N High-Flow Air Filter · Universal',  stock: 18, reorder: 10, supplier: 'K&N Eng.',     cost: 42.00 },
    { sku: 'BAT-12V-OPT-3', name: 'Optima YellowTop 12V · D34/78',          stock: 0,  reorder: 4,  supplier: 'Clarios',      cost: 268.00 },
    { sku: 'REF-R1234YF-A', name: 'R-1234yf Refrigerant · 10oz can',        stock: 7,  reorder: 8,  supplier: 'Honeywell',    cost: 31.00 },
    { sku: 'WIP-BLD-BSH-22',name: 'Bosch ICON Wiper Blade · 22"',           stock: 22, reorder: 12, supplier: 'Bosch',        cost: 24.99 },
  ],

  // Mechanic view — assigned cards
  jobCards: [
    {
      id: 'JC-2026-08471',
      vehicle: '2023 Tesla Model 3 LR · 8KQA-291',
      customer: 'Marcus Holloway',
      priority: 'normal',
      bay: 'BAY-03',
      started: '09:14',
      eta: '12:30',
      progress: 58,
      services: ['Full OBD-II Diagnostic Scan', 'High Voltage Battery Health Report (EV)', 'Tire Rotation & Pressure Balance'],
      status: 'in_progress',
    },
    {
      id: 'JC-2026-08475',
      vehicle: '2021 Toyota Tacoma TRD · 9LMC-877',
      customer: 'Marcus Holloway',
      priority: 'normal',
      bay: '—',
      started: null,
      eta: '15:00',
      progress: 0,
      services: ['4-Wheel Laser Alignment'],
      status: 'pending',
    },
    {
      id: 'JC-2026-08478',
      vehicle: '2019 Honda Civic Si · 6BFD-104',
      customer: 'Marcus Holloway',
      priority: 'high',
      bay: '—',
      started: null,
      eta: '16:45',
      progress: 0,
      services: ['Brake Pad Replacement (Front)', 'Brake Fluid Flush'],
      status: 'pending',
    },
  ],

  // Admin — system-wide
  centers: [
    { id: 'SF-MISSION-01',  name: 'SF · Mission',          city: 'San Francisco', bays: 6, occ: 5, mechs: 6, revenue: 18420, jobs: 14, sla: 98.2 },
    { id: 'SF-SUNSET-02',   name: 'SF · Sunset',           city: 'San Francisco', bays: 4, occ: 3, mechs: 4, revenue: 11280, jobs: 9,  sla: 96.7 },
    { id: 'OAK-DOWNTOWN-01',name: 'Oakland · Downtown',    city: 'Oakland',       bays: 8, occ: 7, mechs: 9, revenue: 24190, jobs: 19, sla: 94.1 },
    { id: 'SJ-NORTH-01',    name: 'San Jose · North',      city: 'San Jose',      bays: 6, occ: 4, mechs: 7, revenue: 16730, jobs: 12, sla: 97.4 },
    { id: 'BRK-WEST-01',    name: 'Berkeley · West',       city: 'Berkeley',      bays: 4, occ: 4, mechs: 5, revenue: 13050, jobs: 11, sla: 92.8 },
    { id: 'PAL-EMBR-01',    name: 'Palo Alto · Embarcadero',city:'Palo Alto',     bays: 5, occ: 2, mechs: 5, revenue: 9870,  jobs: 7,  sla: 99.1 },
  ],

  feed: [
    { t: '11:02:14', center: 'SF-MISSION-01',  msg: 'Job JC-2026-08471 · task complete · Tire rotation initiated', sev: 'info' },
    { t: '11:01:08', center: 'OAK-DOWNTOWN-01',msg: 'Bay 04 occupancy released · ready for assignment',           sev: 'ok' },
    { t: '10:59:42', center: 'BRK-WEST-01',    msg: 'SLA warning · job JC-2026-08440 exceeds estimate by 18m',     sev: 'warn' },
    { t: '10:58:17', center: 'SJ-NORTH-01',    msg: 'Inventory low · SKU REF-R1234YF-A at 2 units',                sev: 'warn' },
    { t: '10:57:01', center: 'SF-SUNSET-02',   msg: 'Mechanic Hailey Okafor reached 88% utilization',              sev: 'info' },
    { t: '10:55:33', center: 'SF-MISSION-01',  msg: 'Booking BK-2026-1139 flagged CRITICAL · pending approval',    sev: 'crit' },
    { t: '10:54:12', center: 'PAL-EMBR-01',    msg: 'Customer payment INV-09011 settled · $612.00',                sev: 'ok' },
    { t: '10:52:48', center: 'OAK-DOWNTOWN-01',msg: 'Diagnostic ECU snapshot uploaded · 14.2MB',                   sev: 'info' },
  ],

  // 30-day revenue sparkline (synthetic)
  revenue30: [42,48,51,44,49,55,61,57,52,58,63,67,62,58,64,71,68,72,76,73,78,82,79,85,88,84,91,94,89,93],
};

// helpers
function fmtMoney(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtCount(n) {
  return n.toLocaleString('en-US');
}
function vehicleById(id) { return DB.vehicles.find(v => v.id === id); }
function serviceByCode(c) { return DB.services.find(s => s.code === c); }

window.DB = DB;
window.fmtMoney = fmtMoney;
window.fmtCount = fmtCount;
window.vehicleById = vehicleById;
window.serviceByCode = serviceByCode;
