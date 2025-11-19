import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration (non-blocking)
transporter.verify((error) => {
  if (error) {
    const err = error as any;
    if (err.code === 'EAUTH') {
      console.warn('⚠️  Email service: Invalid SMTP credentials. Email sending will be disabled.');
      console.warn('   To enable email, configure SMTP_USER and SMTP_PASS in .env');
      console.warn('   For Gmail, use an App Password: https://support.google.com/accounts/answer/185833');
    } else {
      console.warn('⚠️  Email service configuration error:', error.message);
      console.warn('   Email sending will be disabled. Check your SMTP settings.');
    }
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Skip sending if SMTP is not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email service not configured. Skipping email send.');
      console.log('   Would send email to:', options.to);
      console.log('   Subject:', options.subject);
      return true; // Return true to not break the flow
    }

    const mailOptions = {
      from: `"HabitLink" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId, 'to', options.to);
    return true;
  } catch (error: any) {
    // Handle authentication errors gracefully
    if (error.code === 'EAUTH') {
      console.warn('⚠️  Email authentication failed. Email not sent.');
      console.warn('   Check your SMTP credentials in .env');
      console.warn('   For Gmail, use an App Password instead of your regular password');
      console.warn('   Would have sent to:', options.to);
      return false;
    }
    
    // Log other errors but don't crash
    console.error('❌ Error sending email:', error.message || 'Unknown error');
    console.error('   Email to:', options.to, 'was not sent');
    return false;
  }
};

// Send habit reminder email
export const sendHabitReminder = async (
  email: string,
  userName: string,
  habitTitle: string,
  habitDescription?: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 Habit Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Don't forget to complete your habit today:</p>
            <h2>${habitTitle}</h2>
            ${habitDescription ? `<p>${habitDescription}</p>` : ''}
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard" class="button">Complete Habit</a>
            <p style="margin-top: 30px;">Keep building those habits! 💪</p>
          </div>
          <div class="footer">
            <p>This is an automated reminder from HabitLink</p>
            <p>You can manage your reminder preferences in your account settings.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `🔔 Reminder: ${habitTitle}`,
    html,
  });
};

// Send team invitation email
export const sendTeamInvite = async (
  email: string,
  inviterName: string,
  teamName: string,
  inviteLink: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>👥 Team Invitation</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p><strong>${inviterName}</strong> has invited you to join the team:</p>
            <h2>${teamName}</h2>
            <p>Join your team and start building habits together!</p>
            <a href="${inviteLink}" class="button">Accept Invitation</a>
            <p style="margin-top: 30px;">Or copy this link: <br><code style="background: #e0e0e0; padding: 5px; border-radius: 3px;">${inviteLink}</code></p>
          </div>
          <div class="footer">
            <p>This invitation was sent from HabitLink</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `👥 ${inviterName} invited you to join ${teamName}`,
    html,
  });
};

