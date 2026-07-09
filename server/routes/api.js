import express from 'express';
import { analyzeCompany, chatCompany, compareCompanies } from '../controllers/analyzeController.js';

const router = express.Router();

router.post('/analyze', analyzeCompany);
router.post('/chat', chatCompany);
router.post('/compare', compareCompanies);

export default router;
