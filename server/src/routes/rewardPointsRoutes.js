import express from 'express';
import { getRewardPoints, earnPoints, redeemPoints, getPointsHistory } from '../controllers/rewardPointsController.js';

const router = express.Router();

router.get('/:userId', getRewardPoints);
router.post('/earn', earnPoints);
router.post('/redeem', redeemPoints);
router.get('/:userId/history', getPointsHistory);

export default router;

