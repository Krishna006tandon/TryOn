import express from 'express';
import { voiceSearch, upload } from '../controllers/voiceSearchController.js';

const router = express.Router();

router.post('/audio', upload.single('audio'), voiceSearch);
router.post('/text', voiceSearch);

export default router;

