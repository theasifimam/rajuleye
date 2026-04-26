import transporter from '../config/email.js';

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"Rajul Eye" `,
    to,
    subject,
    html,
  });
};

export const sendOTPEmail = async (to, otp, purpose) => {
  const isVerify = purpose === 'verify';
  const isReset = purpose === 'reset';
  const subject = isVerify
    ? 'Verify Your Email – Rajul Eye'
    : isReset
      ? 'Password Reset OTP – Rajul Eye'
      : 'Account Deletion OTP – Rajul Eye';
  const heading = isVerify ? 'Email Verification' : isReset ? 'Password Reset' : 'Account Deletion';
  const message = isVerify
    ? 'Use the OTP below to verify your email address.'
    : isReset
      ? 'Use the OTP below to reset your password.'
      : 'Use the OTP below to confirm your account deletion. This action is irreversible.';

  const html = `
    
    
    
      
      
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 520px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: #1a1a2e; padding: 32px; text-align: center; }
        .header h1 { color: #e2b96f; margin: 0; font-size: 24px; letter-spacing: 1px; }
        .body { padding: 36px 32px; }
        .body h2 { color: #1a1a2e; margin-top: 0; }
        .body p { color: #555; line-height: 1.6; }
        .otp-box { background: #f0f0f0; border-radius: 8px; text-align: center; padding: 20px; margin: 24px 0; }
        .otp { font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #1a1a2e; }
        .expiry { color: #888; font-size: 13px; margin-top: 8px; }
        .footer { background: #f9f9f9; padding: 16px 32px; text-align: center; color: #aaa; font-size: 12px; border-top: 1px solid #eee; }
      
    
    
      
        👓 Rajul Eye
        
          ${heading}
          ${message}
          
            ${otp}
            Expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes
          
          If you did not request this, please ignore this email.
        
        © ${new Date().getFullYear()} Rajul Eye. All rights reserved.
      
    
    
  `;

  await sendEmail({ to, subject, html });
};
