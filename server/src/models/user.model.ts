import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  mobile: string;
  isDefault: boolean;
}

export interface IEyePower {
  left: {
    sphere?: number;
    cylinder?: number;
    axis?: number;
    addition?: number;
    pd?: number;
  };
  right: {
    sphere?: number;
    cylinder?: number;
    axis?: number;
    addition?: number;
    pd?: number;
  };
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: Date;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  isEmailVerified: boolean;
  addresses: IAddress[];
  eyePower?: IEyePower;
  wishlist: mongoose.Types.ObjectId[];
  refreshToken?: string;
  isDeleted: boolean;
  deletedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AddressSchema = new Schema<IAddress>(
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
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const EyePowerSchema = new Schema(
  {
    left: {
      sphere: Number,
      cylinder: Number,
      axis: Number,
      addition: Number,
      pd: Number,
    },
    right: {
      sphere: Number,
      cylinder: Number,
      axis: Number,
      addition: Number,
      pd: Number,
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    mobile: { type: String, trim: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    dateOfBirth: { type: Date },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
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
UserSchema.pre<IUser>('save', async function (this: IUser) {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hashSync(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
