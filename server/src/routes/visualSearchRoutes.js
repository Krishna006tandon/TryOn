import express from 'express';
import { visualSearch, upload } from '../controllers/visualSearchController.js';

const router = express.Router();

router.post('/', upload.single('image'), visualSearch);

export default router;

