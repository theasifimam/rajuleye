import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const OtpSchema = new Schema({
  mobile: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['mobile-verify', 'password-reset', 'account-deletion'], required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  attempts: { type: Number, default: 0 },
});

// Hash OTP before save
OtpSchema.pre('save', async function () {
  if (!this.isModified('otp')) return;
  this.otp = bcrypt.hashSync(this.otp, 10);
});

OtpSchema.methods.compareOTP = async function (candidateOTP) {
  return bcrypt.compare(candidateOTP, this.otp);
};

export default mongoose.model('Otp', OtpSchema);
