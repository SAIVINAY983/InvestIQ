import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { runAnalysisWorkflow } from "./workflow.js";
import { withRetry } from "./retryHelper.js";

const comparePrompt = new PromptTemplate({
  template: `You are an expert AI Investment Analyst.
The user wants to compare two companies. You are provided with the full, detailed investment reports for both companies.

Company A Report:
{reportA}

Company B Report:
{reportB}

Compare the two companies and provide a final conclusion determining which company is the stronger investment and why.
Your response MUST be in valid JSON format. Do NOT include markdown blocks like \`\`\`json.

Use this JSON structure:
{{
  "conclusion": "string (A detailed paragraph explaining which is the better investment and why based on financials, risks, and growth potential.)",
  "winner": "Company A Name | Company B Name | Tie"
}}
`,
  inputVariables: ["reportA", "reportB"],
});

export const runCompareWorkflow = async (companyA, companyB) => {
  console.log(`Starting compare workflow for ${companyA} vs ${companyB}...`);

  // Run the standard analysis for both companies in parallel
  const [reportA, reportB] = await Promise.all([
    runAnalysisWorkflow(companyA),
    runAnalysisWorkflow(companyB)
  ]);

  if (!process.env.GOOGLE_API_KEY) {
    return {
      reportA,
      reportB,
      conclusion: "Mock Comparison Conclusion: Both companies exhibit strong growth, but Company A has slightly better margins.",
      winner: companyA
    };
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.2,
    maxRetries: 5,
  });

  const chain = comparePrompt.pipe(model).pipe(new StringOutputParser());

  try {
    const responseText = await withRetry(async () => {
      return await chain.invoke({
        reportA: JSON.stringify(reportA),
        reportB: JSON.stringify(reportB)
      });
    });

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("\`\`\`json")) {
      cleanedText = cleanedText.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    }
    
    const conclusionData = JSON.parse(cleanedText);

    return {
      reportA,
      reportB,
      conclusion: conclusionData.conclusion,
      winner: conclusionData.winner
    };
  } catch (error) {
    console.error("🚨 Compare API Error:", error.message);
    return {
      reportA,
      reportB,
      conclusion: "Mock Comparison Conclusion: Both companies exhibit strong growth, but based on the provided metrics, Company A has a slight edge in this scenario due to stronger margins.",
      winner: companyA
    };
  }
};
