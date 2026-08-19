import express from 'express';
import { createSession, getUserSessions, getSessionMessages } from '../controllers/sessionController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', createSession);
router.get('/', getUserSessions);
router.get('/:id/messages', getSessionMessages);

export default router;
