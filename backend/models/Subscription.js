import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  providerId: { type: String, required: true, index: true },
  providerName: { type: String, required: true },
  mealPlanId: { type: String, required: true },
  mealPlanName: { type: String, required: true },
  planType: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], default: 'MONTHLY' },
  mealSlot: { type: String, default: 'Lunch (12:15 PM - 01:45 PM)' },
  dietPreference: { type: String, default: 'Vegetarian' },
  totalMeals: { type: Number, default: 30 },
  consumedMeals: { type: Number, default: 0 },
  remainingMeals: { type: Number, default: 30 },
  price: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'], default: 'ACTIVE', index: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  pausedDates: [{ type: String }],
  autoRenew: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'subscriptions'
});

export const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
