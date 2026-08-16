import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  providerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: 'Thali' },
  mealType: { type: String, default: 'veg' },
  cuisine: { type: String, default: 'North Indian' },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  itemsIncluded: [{ type: String }],
  calories: { type: Number, default: 520 },
  protein: { type: String, default: '16g' },
  carbs: { type: String, default: '68g' },
  fat: { type: String, default: '14g' },
  oilType: { type: String, default: 'Cold Pressed Mustard & Cow Ghee' },
  availability: { type: Boolean, default: true },
  image: { type: String, default: '' },
  dayAvailable: { type: String, default: 'All Days' },
  availableDays: [{ type: String }],
  preparationTime: { type: String, default: '20 mins' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'menu_items',
  strict: false
});

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
