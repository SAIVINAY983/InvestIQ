import { runAnalysisWorkflow } from '../langchain/workflow.js';

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
