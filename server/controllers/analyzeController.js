import { runAnalysisWorkflow } from '../langchain/workflow.js';
import { runChatWorkflow } from '../langchain/chatWorkflow.js';
import { runCompareWorkflow } from '../langchain/compareWorkflow.js';
import { getCachedReport, setCachedReport, withDeduplication } from '../utils/cache.js';

export const analyzeCompany = async (req, res, next) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const cachedReport = getCachedReport(company);
    if (cachedReport) {
      return res.json(cachedReport);
    }

    const report = await withDeduplication(company, async () => {
      const result = await runAnalysisWorkflow(company);
      setCachedReport(company, result);
      return result;
    });

    res.json(report);
  } catch (error) {
    console.error('Error analyzing company:', error);
    if (error.message && (error.message.includes("429") || error.message.includes("Rate") || error.message.includes("quota") || error.message.includes("too quickly"))) {
      return res.status(429).json({
        error: "AI service is temporarily busy.",
        message: "Please try again in a minute."
      });
    }
    next(error);
  }
};

export const chatCompany = async (req, res, next) => {
  try {
    const { reportData, question } = req.body;
    if (!reportData || !question) {
      return res.status(400).json({ error: 'Report data and question are required' });
    }
    const answer = await runChatWorkflow(reportData, question);
    res.json({ answer });
  } catch (error) {
    console.error('Error chatting:', error);
    next(error);
  }
};

export const compareCompanies = async (req, res, next) => {
  try {
    const { companyA, companyB } = req.body;
    if (!companyA || !companyB) {
      return res.status(400).json({ error: 'Both companyA and companyB are required' });
    }
    const comparisonResult = await runCompareWorkflow(companyA, companyB);
    res.json(comparisonResult);
  } catch (error) {
    console.error('Error comparing companies:', error);
    next(error);
  }
};

