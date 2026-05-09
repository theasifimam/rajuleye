import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACC_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

export const sendSMS = async ({ to, body }) => {
  if (!client) {
    console.error('Twilio client not initialized. Check TWILIO_ACC_SID and TWILIO_AUTH_TOKEN');
    throw new Error('Twilio credentials missing');
  }
  if (!fromNumber) {
    console.error('TWILIO_PHONE_NUMBER is missing in .env file');
    throw new Error('TWILIO_PHONE_NUMBER is missing in .env file');
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    return message;
  } catch (error) {
    console.error('Failed to send SMS via Twilio:', error.message);
    if (process.env.MODE === 'development' || process.env.NODE_ENV === 'development') {
      return { sid: 'fallback_sid' };
    }
    throw error;
  }
};

export const sendOTPSMS = async (to, otp, purpose) => {
  const isVerify = purpose === 'verify';
  const isReset = purpose === 'reset';

  let message = '';
  if (isVerify) {
    message = `Your Rajul Eye verification code is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`;
  } else if (isReset) {
    message = `Your Rajul Eye password reset code is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`;
  } else {
    message = `Your Rajul Eye OTP is: ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.`;
  }

  await sendSMS({ to, body: message });
};
