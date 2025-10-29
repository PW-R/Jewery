// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String },
  images: [{ type: String }] // URLs from Cloudinary
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
