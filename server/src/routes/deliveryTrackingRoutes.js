import express from 'express';
import {
  createDeliveryTracking,
  getDeliveryTracking,
  getTrackingByNumber,
  updateDeliveryStatus,
  getActiveDeliveries,
} from '../controllers/deliveryTrackingController.js';

const router = express.Router();

router.post('/', createDeliveryTracking);
router.get('/order/:orderId', getDeliveryTracking);
router.get('/track/:trackingNumber', getTrackingByNumber);
router.put('/:trackingId', updateDeliveryStatus);
router.get('/', getActiveDeliveries);

export default router;

