const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { apiLimiter } = require("./middleware/rateLimiter");

// ─── Startup: fail fast if required secrets are absent ───────────────────────
// OWASP A05: Security Misconfiguration — a missing JWT_SECRET means any token
// would fail silently or use an empty string. Crash loudly instead.
const REQUIRED_ENV = ["DATABASE_URL", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
    : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: corsOptions });
app.set("socketio", io);

// ─── Security headers (OWASP A05) ────────────────────────────────────────────
// helmet sets X-Content-Type-Options, X-Frame-Options, HSTS, Referrer-Policy,
// and a dozen more headers that harden every response.
app.use(helmet());

app.use(cors(corsOptions));

// ─── Body-size cap (OWASP A04 / DoS) ─────────────────────────────────────────
// Express default is 100 kB; 16 kB is plenty for every endpoint in this app.
// Rejects oversized payloads before any route handler runs.
app.use(express.json({ limit: "16kb" }));

// ─── Global rate limiter (OWASP A04 / DoS) ───────────────────────────────────
// 300 requests / 15 min per IP across all /api routes.
// Per-endpoint limiters in each router further tighten specific surfaces.
app.use("/api", apiLimiter);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/service-centers", require("./routes/serviceCenters"));
app.use("/api/vehicles", require("./routes/vehicles"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/job-cards", require("./routes/jobCards"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/services", require("./routes/services"));
app.use("/api/misc", require("./routes/misc"));

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// Log full stack internally; send a generic message to the client.
// Never expose stack traces or internal details to untrusted clients (OWASP A09).
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
