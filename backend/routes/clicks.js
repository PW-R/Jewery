import express from "express";
import {
  recordUserClick,
  recordProductClick,
  getUserClicksByUserId,
  getProductClicksByProductId,
  getAllClicks,
} from "../controllers/clicksController.js";

const router = express.Router();

// === USER CLICK ROUTES ===

// @route   POST /api/clicks/user
// @desc    Record a user clicking a product
// @body    { userId, productId, category }
router.post("/user", recordUserClick);

// @route   GET /api/clicks/user/:userId
// @desc    Get all product clicks made by a user
router.get("/user/:userId", getUserClicksByUserId);

// === PRODUCT CLICK ROUTES ===

// @route   POST /api/clicks/product
// @desc    Record a click for a product
// @body    { productId }
router.post("/product", recordProductClick);

// @route   GET /api/clicks/product/:productId
// @desc    Get total clicks and stats for a product
router.get("/product/:productId", getProductClicksByProductId);

// === ADMIN / ANALYTICS ROUTES ===

// @route   GET /api/clicks
// @desc    Get all click records (both user & product)
router.get("/", getAllClicks);

export default router;
