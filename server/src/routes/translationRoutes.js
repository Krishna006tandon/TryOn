import express from 'express';
import { translateText, translateProduct, batchTranslateProducts } from '../controllers/translationController.js';

const router = express.Router();

router.post('/text', translateText);
router.get('/product/:productId', translateProduct);
router.post('/batch', batchTranslateProducts);

export default router;

