import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IOtp extends Document {
  email: string;
  otp: string;
  purpose: 'email-verify' | 'password-reset' | 'account-deletion';
  expiresAt: Date;
  attempts: number;
  compareOTP(candidateOTP: string): Promise<boolean>;
}

const OtpSchema = new Schema<IOtp>({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['email-verify', 'password-reset', 'account-deletion'], required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
  attempts: { type: Number, default: 0 },
});

// Hash OTP before save
OtpSchema.pre<IOtp>('save', async function (this: IOtp) {
  if (!this.isModified('otp')) return;
  this.otp = bcrypt.hashSync(this.otp, 10);
});

OtpSchema.methods.compareOTP = async function (candidateOTP: string): Promise<boolean> {
  return bcrypt.compare(candidateOTP, this.otp);
};

export default mongoose.model<IOtp>('Otp', OtpSchema);
