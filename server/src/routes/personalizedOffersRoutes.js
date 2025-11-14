import express from 'express';
import { getPersonalizedOffers, trackBrowsing } from '../controllers/personalizedOffersController.js';

const router = express.Router();

router.get('/:userId', getPersonalizedOffers);
router.post('/track', trackBrowsing);

export default router;

