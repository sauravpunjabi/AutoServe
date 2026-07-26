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

// Origins are compared exactly, so normalise away trailing slashes and case —
// "https://app.example.com/" and the browser's Origin header must still match.
const normaliseOrigin = (o) => o.trim().replace(/\/+$/, "").toLowerCase();

const allowedOrigins = [
  "http://localhost:5173",
  ...[process.env.CLIENT_URL, process.env.FRONTEND_URL]
    .filter(Boolean)
    .flatMap((v) => v.split(","))
    .map(normaliseOrigin)
    .filter(Boolean),
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(normaliseOrigin(origin))) {
      return callback(null, true);
    }
    console.warn(
      `CORS: rejected origin "${origin}" — allowed: ${allowedOrigins.join(", ")}`
    );
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

// ─── Static uploads (vehicle photos, etc.) ───────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Body-size cap (OWASP A04 / DoS) ─────────────────────────────────────────
// Vehicle photo uploads are base64-encoded images — allow up to 5 MB for that
// one endpoint. Everything else stays at 16 kB.
app.use((req, res, next) => {
  const isPhotoUpload =
    req.method === "PATCH" && /^\/api\/vehicles\/[^/]+\/photo$/.test(req.path);
  express.json({ limit: isPhotoUpload ? "5mb" : "16kb" })(req, res, next);
});

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
