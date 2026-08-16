import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  qty: { type: Number, default: 1 }
}, { _id: false });

const riderInfoSchema = new mongoose.Schema({
  name: { type: String, default: 'Vikas Saini (Express Rider)' },
  phone: { type: String, default: '+91 98290 30001' },
  vehicleNumber: { type: String, default: 'RJ 14 EV 4022' },
  vehicle: { type: String, default: 'EV Scooter (RJ 14 EV 4022)' },
  rating: { type: Number, default: 4.9 },
  currentLocation: { type: String, default: 'Kitchen Station #1' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orderNumber: { type: String, index: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '+91 98290 12345' },
  providerId: { type: String, required: true, index: true },
  providerName: { type: String, required: true },
  providerAddress: { type: String, default: '' },
  providerPhone: { type: String, default: '' },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  address: { type: String, required: true },
  deliveryAddress: { type: String },
  city: { type: String, default: 'jaipur' },
  deliveryTime: { type: String, default: 'Lunch (12:30 PM)' },
  paymentMethod: { type: String, default: 'UPI' },
  paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'FAILED'], default: 'PAID' },
  orderStatus: {
    type: String,
    enum: [
      'PENDING',
      'CREATED',
      'ACCEPTED',
      'REJECTED',
      'COOKING',
      'PREPARING',
      'PACKED',
      'OUT_FOR_DELIVERY',
      'RIDER_OUT',
      'DELIVERED',
      'CANCELLED'
    ],
    default: 'PENDING',
    index: true
  },
  statusStep: { type: Number, default: 0 },
  deliveryPin: { type: String, default: '4821' },
  dabbaSealId: { type: String, default: '' },
  estimatedDistanceKm: { type: Number, default: 2.5 },
  deliveryFeeEarned: { type: Number, default: 45 },
  rider: riderInfoSchema,
  deliveredAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'orders'
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
