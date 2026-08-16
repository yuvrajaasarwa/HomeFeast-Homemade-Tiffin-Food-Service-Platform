import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  role: { type: String, enum: ['CUSTOMER', 'PROVIDER', 'ADMIN', 'RIDER'], default: 'CUSTOMER' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'general' }, // 'order', 'subscription', 'review', 'system'
  targetId: { type: String },
  actionUrl: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'notifications'
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
