import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { investmentReportPrompt } from "./prompts.js";
import { getFinancialData } from "../utils/yahooFinance.js";
import { searchCompanyNews, researchCompanyInfo } from "../utils/tavilySearch.js";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const runAnalysisWorkflow = async (company) => {
  console.log(`Starting analysis workflow for ${company}...`);

  // 1 & 2 & 3. Gather Data concurrently
  const [financialData, newsData, researchData] = await Promise.all([
    getFinancialData(company),
    searchCompanyNews(company),
    researchCompanyInfo(company)
  ]);

  // If Gemini API key is missing, return mock data for testing UI
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("GOOGLE_API_KEY is not set. Returning mock data.");
    return getMockReport(company);
  }

  // 4, 5 & 6. LangChain processing
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    maxOutputTokens: 2048,
    temperature: 0.2,
  });

  const chain = investmentReportPrompt.pipe(model).pipe(new StringOutputParser());

  try {
    const responseText = await chain.invoke({
      company: company,
      financialData: JSON.stringify(financialData),
      newsData: JSON.stringify(newsData),
      researchData: JSON.stringify(researchData)
    });

    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("\`\`\`json")) {
      cleanedText = cleanedText.replace(/^\`\`\`json/, "").replace(/\`\`\`$/, "").trim();
    }
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("🚨 Gemini API Error:", error.message);
    console.warn("Returning fallback mock data because the Gemini API key is invalid or restricted.");
    return getMockReport(company);
  }
};

function getMockReport(company) {
  return {
    "companyName": company,
    "overview": {
      "industry": "Technology & Consumer Electronics",
      "ceo": "Tim Cook (or Current CEO)",
      "headquarters": "Cupertino, California",
      "employees": 164000,
      "marketCap": "$3.0T",
      "businessSummary": `${company} is a multinational technology company that designs, manufactures, and markets consumer electronics, software, and services.`
    },
    "financials": {
      "revenue": "$96.7B",
      "netIncome": "$15.0B",
      "peRatio": "45.2",
      "eps": "$3.12",
      "profitMargin": "15.5%",
      "cashFlow": "$13.3B",
      "debt": "$5.7B"
    },
    "news": [
      {
        "title": `${company} Q3 Deliveries Beat Expectations`,
        "summary": `${company} reported higher than expected deliveries in the third quarter...`,
        "source": "CNBC",
        "sentiment": "Positive"
      },
      {
        "title": `New ${company} Factory Announced`,
        "summary": `${company} plans to build a new factory to expand production.`,
        "source": "Reuters",
        "sentiment": "Positive"
      }
    ],
    "swot": {
      "strengths": ["Strong brand recognition", "Innovative technology", "Charging infrastructure"],
      "weaknesses": ["High price points", "Production bottlenecks"],
      "opportunities": ["Expansion into new markets", "Robotaxi potential"],
      "threats": ["Increasing competition from legacy automakers", "Supply chain issues"]
    },
    "risks": [
      {
        "type": "Competition",
        "description": "Intense competition from BYD and traditional automakers."
      }
    ],
    "recommendation": "BUY",
    "investmentScore": 85,
    "confidence": 90,
    "reasoning": `${company} remains a market leader with strong growth prospects and high margins, despite increasing competition.`
  };
}
