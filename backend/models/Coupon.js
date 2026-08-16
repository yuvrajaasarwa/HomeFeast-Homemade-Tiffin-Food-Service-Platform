import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  discountPercent: { type: Number, default: 0 },
  flatDiscount: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 99 },
  maxDiscount: { type: Number, default: 100 },
  description: { type: String, default: '' },
  validUntil: { type: String, default: '2026-12-31' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  collection: 'coupons'
});

export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export default Coupon;
