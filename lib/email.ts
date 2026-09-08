import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'AGRINOVA <noreply@agrinova.com>',
      to: email,
      subject: '🔐 Reset Your AGRINOVA Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 12px; margin-top: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #059669; }
            .header h1 { color: #059669; margin: 0; font-size: 24px; }
            .content { padding: 30px 0; }
            .content p { color: #333; font-size: 16px; line-height: 1.6; }
            .btn { display: inline-block; padding: 14px 32px; background: #059669; color: white !important; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .btn:hover { background: #047857; }
            .footer { text-align: center; padding: 20px 0; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            .warning { background: #fef3c7; padding: 12px 16px; border-radius: 8px; margin: 16px 0; color: #92400e; font-size: 14px; }
            .code-box { background: #f3f4f6; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 18px; text-align: center; letter-spacing: 4px; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌾 AGRINOVA</h1>
              <p style="color: #6b7280; margin: 4px 0 0;">Smart Agriculture Platform</p>
            </div>
            <div class="content">
              <h2>🔐 Password Reset Request</h2>
              <p>Hello,</p>
              <p>We received a request to reset the password for your AGRINOVA account.</p>
              <p>Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="btn">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <div class="code-box">${resetLink}</div>
              <div class="warning">
                <strong>⚠️ This link will expire in 1 hour.</strong><br>
                If you didn't request this, please ignore this email or contact support.
              </div>
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                For security, this link can only be used once.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AGRINOVA. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        AGRINOVA Password Reset

        Hello,

        We received a request to reset the password for your AGRINOVA account.

        Click the link below to reset your password:
        ${resetLink}

        This link will expire in 1 hour.

        If you didn't request this, please ignore this email.

        © ${new Date().getFullYear()} AGRINOVA
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: 'Failed to send email' };
  }
}