const { BrevoClient } = require('@getbrevo/brevo');

if (!process.env.BREVO_API_KEY) {
  console.warn("⚠️ WARNING: BREVO_API_KEY is not defined in the environment variables!");
}

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

const sendResetEmail = async (to, link) => {
  console.log(`\n======================================================`);
  console.log(`[MAILER] Password reset link for ${to}:`);
  console.log(link);
  console.log(`======================================================\n`);

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
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
    console.log(`[MAILER] Reset email sent successfully to ${to}.`);
    return response;
  } catch (error) {
    console.error(`[MAILER] Failed to send password reset email to ${to}:`, error.message || error);
    throw error;
  }
};

module.exports = { sendResetEmail };