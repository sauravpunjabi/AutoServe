const rateLimit = require("express-rate-limit");

// Shared 429 response — all limiters use the same shape so clients handle one case
const handler429 = (_req, res) => {
  res.status(429).json({
    success: false,
    message: "Too many requests. Please slow down and try again later.",
  });
};

const base = {
  standardHeaders: "draft-7", // Sends a single RateLimit header (RFC 9110 draft-7)
  legacyHeaders: false,        // Disable deprecated X-RateLimit-* headers
  handler: handler429,
};

// ─── Global limiter ──────────────────────────────────────────────────────────
// Applied to ALL /api routes at the app level. First line of defence against
// bulk scraping or DDoS. 300 req / 15 min per IP is generous for real users.
const apiLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, max: 300 });

// ─── Auth limiter ─────────────────────────────────────────────────────────────
// Tight limit for login and register to slow brute-force and credential stuffing.
// 10 attempts / 15 min per IP; only failed requests count toward the limit.
const authLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
});

// ─── Password-reset limiter ───────────────────────────────────────────────────
// Very tight to prevent email-spam abuse and token brute-force.
// 5 requests / 1 hour per IP.
const passwordResetLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  max: 5,
});

// ─── Public-read limiter ──────────────────────────────────────────────────────
// Applied to unauthenticated listing/detail GET endpoints.
// Allows light browsing while blocking automated scraping.
const publicReadLimiter = rateLimit({ ...base, windowMs: 15 * 60 * 1000, max: 100 });

// ─── Authenticated write limiter ─────────────────────────────────────────────
// Keyed on the authenticated user ID when available; falls back to IP.
// User-keyed limits are fairer for clients behind NAT/shared IPs.
const userWriteLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  max: 60,
  keyGenerator: (req) => (req.user ? `uid:${req.user.id}` : req.ip),
});

module.exports = {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  publicReadLimiter,
  userWriteLimiter,
};
