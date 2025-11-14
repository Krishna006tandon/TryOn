import express from 'express';
import { generateInvoice, getInvoiceUrl, serveInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

router.get('/:orderId/generate', generateInvoice);
router.get('/:orderId/url', getInvoiceUrl);
router.get('/file/:fileName', serveInvoice);

export default router;

