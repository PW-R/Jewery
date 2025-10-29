import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // optional if anonymous
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  category: { type: String },
  clickedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Click = mongoose.model('Click', clickSchema);
export default Click;
