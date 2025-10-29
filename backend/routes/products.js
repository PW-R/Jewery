import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import authenticate from '../middleware/auth.js';
import multer from 'multer';
import cloudinaryConfig from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: cloudinaryConfig.storage });

// === GET ALL PRODUCTS ===
router.get('/', getProducts);

// === GET SINGLE PRODUCT BY ID ===
router.get('/:id', getProductById);

// === CREATE NEW PRODUCT === (authenticated + file upload)
router.post('/', authenticate, upload.array('images', 5), createProduct);

// === UPDATE PRODUCT === (authenticated + file upload)
router.put('/:id', authenticate, upload.array('images', 5), updateProduct);

// === DELETE PRODUCT === (authenticated)
router.delete('/:id', authenticate, deleteProduct);

export default router;
