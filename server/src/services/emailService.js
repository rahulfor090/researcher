import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: env.email.host,
        port: env.email.port,
        secure: env.email.secure, // true for 465, false for other ports
        auth: {
          user: env.email.user,
          pass: env.email.pass,
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates
        }
      });

      console.log('📧 Email service initialized');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email server connection failed:', error);
      return false;
    }
  }

  createPasswordResetEmailHTML(userName, resetUrl, expiryTime = '1 hour') {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Research Locker</title>
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                line-height: 1.6; 
                color: #333; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc;
            }
            .email-container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff; 
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header { 
                background: linear-gradient(135deg, #0d9488, #f97316); 
                color: white; 
                text-align: center; 
                padding: 40px 20px;
            }
            .header h1 { 
                margin: 0; 
                font-size: 28px; 
                font-weight: 700; 
            }
            .content { 
                padding: 40px 30px; 
            }
            .greeting { 
                font-size: 18px; 
                font-weight: 600; 
                color: #1f2937; 
                margin-bottom: 20px; 
            }
            .message { 
                font-size: 16px; 
                color: #4b5563; 
                margin-bottom: 30px; 
                line-height: 1.6;
            }
            .reset-button { 
                display: inline-block; 
                background: linear-gradient(135deg, #0d9488, #059669); 
                color: white; 
                text-decoration: none; 
                padding: 16px 32px; 
                border-radius: 8px; 
                font-weight: 600; 
                font-size: 16px; 
                margin: 20px 0; 
                box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
                transition: all 0.3s ease;
            }
            .reset-button:hover { 
                transform: translateY(-2px); 
                box-shadow: 0 6px 16px rgba(13, 148, 136, 0.4);
            }
            .alternative-link { 
                background-color: #f3f4f6; 
                padding: 20px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #0d9488;
            }
            .alternative-link p { 
                margin: 0; 
                font-size: 14px; 
                color: #6b7280; 
            }
            .alternative-link a { 
                color: #0d9488; 
                word-break: break-all; 
            }
            .warning { 
                background-color: #fef3cd; 
                padding: 15px; 
                border-radius: 8px; 
                margin: 20px 0; 
                border-left: 4px solid #f59e0b;
            }
            .warning p { 
                margin: 0; 
                font-size: 14px; 
                color: #92400e; 
            }
            .footer { 
                background-color: #f9fafb; 
                text-align: center; 
                padding: 30px 20px; 
                font-size: 14px; 
                color: #6b7280; 
            }
            .security-tips {
                background-color: #f0f9ff;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #3b82f6;
            }
            .security-tips h3 {
                margin: 0 0 10px 0;
                color: #1e40af;
                font-size: 16px;
            }
            .security-tips ul {
                margin: 0;
                padding-left: 20px;
                color: #1e40af;
            }
            .security-tips li {
                margin-bottom: 5px;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🔐 Research Locker</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${userName},</div>
                
                <div class="message">
                    We received a request to reset the password for your Research Locker account. 
                    If you made this request, click the button below to reset your password.
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" class="reset-button">
                        🔑 Reset My Password
                    </a>
                </div>
                
                <div class="alternative-link">
                    <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                    <a href="${resetUrl}">${resetUrl}</a>
                </div>
                
                <div class="warning">
                    <p><strong>⚠️ Important:</strong> This link will expire in ${expiryTime}. If you didn't request a password reset, you can safely ignore this email.</p>
                </div>

                <div class="security-tips">
                    <h3>🔒 Security Tips:</h3>
                    <ul>
                        <li>Never share your password reset link with anyone</li>
                        <li>Always verify the sender's email address</li>
                        <li>Use a strong, unique password for your account</li>
                        <li>Enable two-factor authentication when available</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Research Locker Team</strong></p>
                <p>This is an automated message. Please do not reply to this email.</p>
                <p style="margin-top: 20px;">
                    <a href="${env.webAppUrl}" style="color: #0d9488;">Visit Research Locker</a> | 
                    <a href="${env.webAppUrl}/help-center" style="color: #0d9488;">Help Center</a> | 
                    <a href="${env.webAppUrl}/privacy" style="color: #0d9488;">Privacy Policy</a>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  createPasswordResetEmailText(userName, resetUrl, expiryTime = '1 hour') {
    return `
Hello ${userName},

We received a request to reset the password for your Research Locker account.

If you made this request, click the link below to reset your password:
${resetUrl}

Important: This link will expire in ${expiryTime}.

If you didn't request a password reset, you can safely ignore this email.

Security Tips:
- Never share your password reset link with anyone
- Always verify the sender's email address  
- Use a strong, unique password for your account

Best regards,
The Research Locker Team

---
This is an automated message. Please do not reply to this email.
Visit Research Locker: ${env.webAppUrl}
    `.trim();
  }

  async sendPasswordResetEmail(toEmail, userName, resetUrl) {
    try {
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      const mailOptions = {
        from: `"${env.email.fromName}" <${env.email.fromAddress}>`,
        to: toEmail,
        subject: '🔑 Reset Your Research Locker Password',
        text: this.createPasswordResetEmailText(userName, resetUrl),
        html: this.createPasswordResetEmailHTML(userName, resetUrl)
      };

      console.log(`📧 Sending password reset email to: ${toEmail}`);
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Password reset email sent successfully:', result.messageId);
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testEmail() {
    try {
      const isConnected = await this.verifyConnection();
      if (!isConnected) {
        return { success: false, error: 'Email server connection failed' };
      }

      // Send test email to the configured email address
      const testResult = await this.sendPasswordResetEmail(
        env.email.user,
        'Test User',
        `${env.webAppUrl}/reset-password?token=test-token-123`
      );

      return testResult;
    } catch (error) {
      console.error('❌ Email test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export singleton instance
const emailService = new EmailService();

export default emailService;