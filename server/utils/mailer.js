const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (to, link) => {
  await resend.emails.send({
    from: 'AutoServe <onboarding@resend.dev>',
    to,
    subject: 'Verify your AutoServe account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #f97316;">Verify your email</h2>
        <p>Click the button below to verify your account. Link expires in 24 hours.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
        <p style="margin-top:16px;color:#888;font-size:13px;">If you didn't create this account, ignore this email.</p>
      </div>
    `
  });
};

const sendResetEmail = async (to, link) => {
  await resend.emails.send({
    from: 'AutoServe <onboarding@resend.dev>',
    to,
    subject: 'Reset your AutoServe password',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #f97316;">Password Reset</h2>
        <p>Click the button below to reset your password. Link expires in 1 hour.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
        <p style="margin-top:16px;color:#888;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail, sendResetEmail };
