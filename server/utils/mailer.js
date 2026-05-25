const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) console.error('❌ Mail server error:', error.message);
  else console.log('✅ Mail server ready');
});

async function sendResetEmail(to, link) {
  console.log(`\n======================================================`);
  console.log(`[MAILER] Password reset link for ${to}:`);
  console.log(link);
  console.log(`======================================================\n`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("[MAILER] EMAIL_USER or EMAIL_PASS not set in .env. Skipping actual email transmission.");
    return;
  }

  const mailOptions = {
    from: `"AutoServe" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "AutoServe Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #f5f5f5; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #1e1e1e;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #f97316; margin: 0;">AutoServe</h2>
          <p style="color: #888888; font-size: 14px; margin: 5px 0 0;">Password Reset Request</p>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #f5f5f5;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #f5f5f5;">We received a request to reset the password for your AutoServe account. Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="display: inline-block; background-color: #f97316; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; text-align: center;">Reset Password</a>
        </div>
        <p style="font-size: 13px; color: #888888; line-height: 1.6;">If you didn't request a password reset, you can safely ignore this email. Your password won't change until you click the link and create a new one.</p>
        <hr style="border: none; border-top: 1px solid #1e1e1e; margin: 30px 0;" />
        <p style="font-size: 11px; color: #555555; text-align: center; margin: 0;">AutoServe Inc. &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[MAILER] Email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (err) {
    console.error("[MAILER] Failed to send email via SMTP:", err.message);
    console.warn("[MAILER] Please check your credentials in .env. In the meantime, use the link printed above.");
    return { success: false, error: err.message };
  }
}

async function sendVerificationEmail(to, link) {
  console.log(`\n======================================================`);
  console.log(`[MAILER] Email verification link for ${to}:`);
  console.log(link);
  console.log(`======================================================\n`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("[MAILER] EMAIL_USER or EMAIL_PASS not set in .env. Skipping actual email transmission.");
    return;
  }

  const mailOptions = {
    from: `"AutoServe" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Verify your AutoServe account",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: #f5f5f5; padding: 40px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #1e1e1e;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #f97316; margin: 0;">AutoServe</h2>
          <p style="color: #888888; font-size: 14px; margin: 5px 0 0;">Email Verification</p>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #f5f5f5;">Hello,</p>
        <p style="font-size: 15px; line-height: 1.6; color: #f5f5f5;">Thanks for signing up! Please verify your email address to activate your AutoServe account. This link is valid for 24 hours.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="display: inline-block; background-color: #f97316; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; text-align: center;">Verify Email</a>
        </div>
        <p style="font-size: 13px; color: #888888; line-height: 1.6;">If you didn't create an AutoServe account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #1e1e1e; margin: 30px 0;" />
        <p style="font-size: 11px; color: #555555; text-align: center; margin: 0;">AutoServe Inc. &copy; ${new Date().getFullYear()}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[MAILER] Email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (err) {
    console.error("[MAILER] Failed to send email via SMTP:", err.message);
    console.warn("[MAILER] Please check your credentials in .env. In the meantime, use the link printed above.");
    return { success: false, error: err.message };
  }
}

module.exports = { sendResetEmail, sendVerificationEmail };
