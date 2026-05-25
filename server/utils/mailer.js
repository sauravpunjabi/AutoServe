const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

transporter.verify((error) => {
  if (error) {
    console.error('❌ Mail server error:', error.message);
  } else {
    console.log('✅ Mail server ready');
  }
});

const sendVerificationEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"AutoServe" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your AutoServe account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #f97316;">Verify your email</h2>
        <p>Click the button below to verify your AutoServe account. This link expires in 24 hours.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
        <p style="margin-top:16px;color:#888;font-size:13px;">If you didn't create this account, ignore this email.</p>
      </div>
    `
  });
};

const sendResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: `"AutoServe" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Reset your AutoServe password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #f97316;">Password Reset</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
        <p style="margin-top:16px;color:#888;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail, sendResetEmail };
