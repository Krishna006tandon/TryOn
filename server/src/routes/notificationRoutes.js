import express from 'express';
import {
  sendOrderConfirmationEmail,
  sendDeliveryUpdateEmail,
  sendSMS,
  sendOrderConfirmationSMS,
} from '../controllers/notificationController.js';

const router = express.Router();

router.post('/email/order-confirmation', sendOrderConfirmationEmail);
router.post('/email/delivery-update', sendDeliveryUpdateEmail);
router.post('/sms', sendSMS);
router.post('/sms/order-confirmation', sendOrderConfirmationSMS);

export default router;

