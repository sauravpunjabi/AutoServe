const SibApiV3Sdk = require('@getbrevo/brevo');

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const sendVerificationEmail = async (to, link) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { name: 'AutoServe', email: 'noreply@autoserve.app' };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = 'Verify your AutoServe account';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #f97316;">Verify your email</h2>
      <p>Click the button below to verify your AutoServe account. This link expires in 24 hours.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
      <p style="margin-top:16px;color:#888;font-size:13px;">If you didn't create this account, ignore this email.</p>
    </div>
  `;
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

const sendResetEmail = async (to, link) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = { name: 'AutoServe', email: 'noreply@autoserve.app' };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = 'Reset your AutoServe password';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #f97316;">Password Reset</h2>
      <p>Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
      <p style="margin-top:16px;color:#888;font-size:13px;">If you didn't request this, ignore this email.</p>
    </div>
  `;
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendVerificationEmail, sendResetEmail };
