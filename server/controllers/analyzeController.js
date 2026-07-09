import { runAnalysisWorkflow } from '../langchain/workflow.js';
import { runChatWorkflow } from '../langchain/chatWorkflow.js';
import { runCompareWorkflow } from '../langchain/compareWorkflow.js';

export const analyzeCompany = async (req, res, next) => {
  try {
    const { company } = req.body;

    if (!company) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    // Run the LangChain AI workflow
    const report = await runAnalysisWorkflow(company);

    res.json(report);
  } catch (error) {
    console.error('Error analyzing company:', error);
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

