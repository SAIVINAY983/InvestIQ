import express from 'express';
import { analyzeCompany } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/analyze', analyzeCompany);

export default router;
