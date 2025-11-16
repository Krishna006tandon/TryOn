import express from 'express';
import { signup, verifyOtp, login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);

// Example of a protected route (can be moved to other routes later)
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        verified: req.user.verified,
    });
});

export default router;
