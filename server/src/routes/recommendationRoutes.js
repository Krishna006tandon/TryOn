import express from 'express';
import { getSimilarProducts, generateAllEmbeddings } from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/:productId', getSimilarProducts);
router.post('/generate-embeddings', generateAllEmbeddings);

export default router;

