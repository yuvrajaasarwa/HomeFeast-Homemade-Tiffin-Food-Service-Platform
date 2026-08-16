import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  providerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  planType: { type: String, default: 'MONTHLY' },
  durationDays: { type: Number, default: 30 },
  duration: { type: Number, default: 30 },
  totalMeals: { type: Number, default: 30 },
  price: { type: Number, required: true },
  totalPrice: { type: Number },
  pricePerMeal: { type: Number, required: true },
  savings: { type: String, default: '' },
  badge: { type: String, default: 'BEST VALUE' },
  idealFor: { type: String, default: '' },
  popular: { type: Boolean, default: false },
  features: [{ type: String }],
  includedMenuItems: [{ type: String }],
  mealSlot: { type: String, default: 'Lunch & Dinner' },
  dietPreference: { type: String, default: 'Vegetarian' },
  status: { type: String, default: 'ACTIVE' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'meal_plans',
  strict: false
});

export const MealPlan = mongoose.models.MealPlan || mongoose.model('MealPlan', mealPlanSchema);
export default MealPlan;
