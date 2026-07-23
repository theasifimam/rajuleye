import mongoose, { Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['order', 'review', 'contact'],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    // refId stores the MongoDB ObjectId for orders/reviews, or a stringified contact ID
    refId: { type: String },
    refModel: {
      type: String,
      enum: ['Order', 'Review', 'Contact', null],
      default: null,
    },
    // Extra metadata for contact messages (stored so we can build mailto link)
    meta: {
      senderName: String,
      senderEmail: String,
      subject: String,
      message: String,
    },
    isRead: { type: Boolean, default: false },
    // TTL: auto-delete after 30 days
    expiresAt: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);

// TTL index — MongoDB deletes the document when expiresAt is reached
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isRead: 1 });

export default mongoose.model('Notification', NotificationSchema);
