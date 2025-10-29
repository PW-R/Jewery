import express from 'express';
import { trackClick, getAllClicks } from '../controllers/clickController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// === TRACK PRODUCT CLICK ===
// Only logged-in users
router.post('/', authenticate, trackClick);

// === GET ALL CLICKS (analytics) ===
// Protected route: only admins or authorized users can fetch clicks
router.get('/', authenticate, getAllClicks);

export default router;
