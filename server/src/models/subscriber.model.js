import mongoose, { Schema } from 'mongoose';

const SubscriberSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
    },
    { timestamps: true }
);

export default mongoose.model('Subscriber', SubscriberSchema);
