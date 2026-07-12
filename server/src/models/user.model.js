import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const AddressSchema = new Schema(
  {
    label: { type: String, default: 'Home' },
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    mobile: { type: String, required: true },
    alternateMobile: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const EyePowerSchema = new Schema(
  {
    left: {
      sphere: String,
      cylinder: String,
      axis: String,
      addition: String,
      pd: String,
    },
    right: {
      sphere: String,
      cylinder: String,
      axis: String,
      addition: String,
      pd: String,
    },
    name: String,
    phone: String,
    prescriptionImage: String,
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    mobile: { type: String, required: true, unique: true, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: Date },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    isMobileVerified: { type: Boolean, default: false },
    addresses: { type: [AddressSchema], default: [] },
    eyePower: { type: EyePowerSchema },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
