import express from 'express';
import { chat } from '../controllers/chatController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/:sessionId', chat);

export default router;
