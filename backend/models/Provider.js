import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  businessName: { type: String, required: true },
  ownerName: { type: String },
  cookName: { type: String },
  email: { type: String },
  phone: { type: String },
  cuisines: [{ type: String }],
  cuisineTypes: [{ type: String }],
  mealType: { type: String, default: 'veg' },
  mealTypes: [{ type: String }], // 'veg', 'non-veg', 'jain'
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  city: { type: String, required: true, index: true },
  area: { type: String, required: true },
  address: { type: String },
  serviceArea: {
    city: { type: String },
    cities: [{ type: String }],
    localities: [{ type: String }],
    deliveryRadiusKm: { type: Number, default: 8 }
  },
  deliveryTimings: {
    lunch: { type: String, default: '12:15 PM - 01:45 PM' },
    dinner: { type: String, default: '07:30 PM - 09:00 PM' }
  },
  deliveryAreas: [{ type: String }],
  approvalStatus: { type: String, default: 'APPROVED' },
  rating: { type: Number, default: 4.9 },
  ratingCount: { type: Number, default: 120 },
  totalReviews: { type: Number, default: 0 },
  startingPrice: { type: Number, default: 85 },
  pricePerMeal: { type: Number, default: 85 },
  availableMealPlans: [{ type: String }],
  isAcceptingOrders: { type: Boolean, default: true },
  minOrder: { type: Number, default: 80 },
  fssaiNumber: { type: String, default: '10023011000941' },
  hygieneScore: { type: String, default: '99.4%' },
  packagingType: { type: String, default: 'Insulated Stainless Steel Dabba' },
  earnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'providers',
  strict: false
});

export const Provider = mongoose.models.Provider || mongoose.model('Provider', providerSchema);
export default Provider;
