import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  providerId: { type: String, required: true, index: true },
  providerName: { type: String, required: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  orderId: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  favoriteDish: { type: String, default: '' },
  verifiedMeal: { type: String, default: 'Homestyle Thali' },
  providerResponse: {
    comment: { type: String },
    respondedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'reviews'
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
