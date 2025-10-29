import express from 'express';
import { 
  getAllUsers, 
  registerUser, 
  loginUser, 
  updateUser, 
  deleteUser 
} from '../controllers/userController.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

// === GET ALL USERS ===
router.get('/', getAllUsers);

// === REGISTER ===
router.post('/register', registerUser);

// === LOGIN ===
router.post('/login', loginUser);

// === UPDATE USER ===
router.put('/update/:id', authenticate, updateUser);

// === DELETE USER ===
router.delete('/delete/:id', authenticate, deleteUser);

export default router;
