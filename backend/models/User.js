import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, default: '' },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['CUSTOMER', 'PROVIDER', 'ADMIN', 'RIDER'], 
    default: 'CUSTOMER',
    index: true 
  },
  address: { type: String, default: '' },
  city: { type: String, default: 'jaipur' },
  area: { type: String, default: 'Malviya Nagar' },
  dietPreference: { type: String, default: 'Vegetarian' },
  allergies: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'users'
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
