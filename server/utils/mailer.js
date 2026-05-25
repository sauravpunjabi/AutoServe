const brevo = require('@getbrevo/brevo');

const defaultClient = brevo.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

const sendVerificationEmail = async (to, link) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.sender = { name: 'AutoServe', email: 'noreply@autoserve.app' };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = 'Verify your AutoServe account';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #f97316;">Verify your email</h2>
      <p>Click below to verify your account. Link expires in 24 hours.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Verify Email</a>
    </div>
  `;
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

const sendResetEmail = async (to, link) => {
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.sender = { name: 'AutoServe', email: 'noreply@autoserve.app' };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = 'Reset your AutoServe password';
  sendSmtpEmail.htmlContent = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #f97316;">Password Reset</h2>
      <p>Click below to reset your password. Link expires in 1 hour.</p>
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
    </div>
  `;
  await apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = { sendVerificationEmail, sendResetEmail };