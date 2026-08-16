import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  customerId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  providerId: { type: String, required: true, index: true },
  providerName: { type: String, required: true },
  orderId: { type: String, required: true },
  issueType: { type: String, required: true }, // 'Late Delivery', 'Spilled Dabba', 'Food Quality', 'Wrong Meal'
  description: { type: String, required: true },
  status: { type: String, enum: ['OPEN', 'INVESTIGATING', 'RESOLVED', 'CLOSED'], default: 'OPEN', index: true },
  resolutionNotes: { type: String, default: '' },
  refundIssued: { type: Boolean, default: false },
  refundAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'complaints'
});

export const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
export default Complaint;
