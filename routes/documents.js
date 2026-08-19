import express from 'express';
import multer from 'multer';
import requireAuth from '../middleware/requireAuth.js';
import { uploadDocument, getUserDocuments } from '../controllers/documentController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(requireAuth);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getUserDocuments);

export default router;
