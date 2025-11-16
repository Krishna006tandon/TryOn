import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserProfile } from '../controllers/userProfileController.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);

export default router;
