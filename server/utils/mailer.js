const { BrevoClient } = require('@getbrevo/brevo');

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendVerificationEmail = async (to, link) => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: 'AutoServe', email: 'noreply@autoserve.app' },
    to: [{ email: to }],
    subject: 'Verify your AutoServe account',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #f97316;">Verify your email</h2>
        <p>Click below to verify your account. Link expires in 24 hours.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
      </div>
    `,
  });
};

const sendResetEmail = async (to, link) => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender: { name: 'AutoServe', email: 'noreply@autoserve.app' },
    to: [{ email: to }],
    subject: 'Reset your AutoServe password',
    htmlContent: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #f97316;">Password Reset</h2>
        <p>Click below to reset your password. Link expires in 1 hour.</p>
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendResetEmail };