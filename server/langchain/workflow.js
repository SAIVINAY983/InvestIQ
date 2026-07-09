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
    maxOutputTokens: 8192,
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
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "").trim();
    }
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("🚨 Gemini API Error:", error.message);
    return {
      "companyName": company,
      "isPublic": true,
      "executiveSummary": ["Error generating report."],
      "investmentThesis": "Error generating report.",
      "recommendation": "ERROR",
      "reasoning": "The API failed with error: " + error.message,
      "scoreBreakdown": { "financialHealth": 0, "growthPotential": 0, "riskScore": 0, "newsSentiment": 0, "overall": 0 },
      "scoreReasoning": { "financialHealth": [], "growthPotential": [], "riskScore": [], "newsSentiment": [] },
      "bullCase": [],
      "bearCase": [],
      "whyInvest": [],
      "whyAvoid": [],
      "positiveCatalysts": [],
      "negativeCatalysts": [],
      "recommendationScenarios": { "downgradeScenario": [], "upgradeScenario": [] },
      "overallNewsSentiment": "Neutral",
      "sources": [],
      "confidenceReasoning": "API Error",
      "confidenceReasons": [],
      "redFlags": [],
      "portfolioSuitability": { "suitableFor": [], "notSuitableFor": [] },
      "overview": {}, "financials": {}, "news": [], "swot": {strengths:[], weaknesses:[], opportunities:[], threats:[]}, "risks": []
    };
  }
};

function getMockReport(company) {
  return {
    "companyName": company,
    "isPublic": true,
    "executiveSummary": [
      `${company} is a leading technology company with strong brand recognition.`,
      "Q3 deliveries beat expectations, signaling growth.",
      "Increasing competition remains a primary risk."
    ],
    "investmentThesis": `${company} remains a financially strong IT services leader with robust margins, strategic AI investments, and consistent cash generation, making it suitable for long-term investors despite moderate growth.`,
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
    "scoreBreakdown": {
      "financialHealth": 90,
      "growthPotential": 80,
      "riskScore": 75,
      "newsSentiment": 85,
      "overall": 85
    },
    "scoreReasoning": {
      "financialHealth": ["Strong operating margin", "Healthy cash flow", "Low debt"],
      "growthPotential": ["AI investments", "Cloud growth", "New contracts"],
      "riskScore": ["Competition from startups", "Regulatory scrutiny"],
      "newsSentiment": ["Recent product announcements received well", "Positive analyst coverage"]
    },
    "bullCase": ["Growth Drivers in AI", "Positive Margin Expansion", "Competitive Advantages"],
    "bearCase": ["Risks in supply chain", "Challenges in emerging markets", "Weaknesses in legacy products"],
    "whyInvest": [
      "Consistent revenue growth.",
      "Dominant market position.",
      "Strong consumer brand loyalty."
    ],
    "whyAvoid": [
      "High valuation multiples.",
      "Supply chain vulnerabilities.",
      "Increasing regulatory scrutiny."
    ],
    "positiveCatalysts": ["AI adoption", "New enterprise deals", "Margin improvement"],
    "negativeCatalysts": ["Competition", "Economic slowdown", "Currency fluctuations"],
    "recommendationScenarios": {
      "downgradeScenario": ["Revenue growth slows", "Margins decline"],
      "upgradeScenario": ["Continuous earnings growth", "Debt decreases significantly"]
    },
    "overallNewsSentiment": "Positive",
    "sources": [
      { "name": "Yahoo Finance", "url": "https://finance.yahoo.com", "reliabilityScore": 5 },
      { "name": "CNBC", "url": "https://cnbc.com", "reliabilityScore": 4 }
    ],
    "news": [
      {
        "title": `${company} Q3 Deliveries Beat Expectations`,
        "summary": `${company} reported higher than expected deliveries in the third quarter...`,
        "source": "CNBC",
        "publishedDate": "2026-07-09",
        "url": "https://cnbc.com/news",
        "sentiment": "Positive"
      },
      {
        "title": `New ${company} Factory Announced`,
        "summary": `${company} plans to build a new factory to expand production.`,
        "source": "Reuters",
        "publishedDate": "2026-07-08",
        "url": "https://reuters.com/news",
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
    "redFlags": ["High Debt", "Falling Revenue in specific sectors"],
    "portfolioSuitability": {
      "suitableFor": ["Long-Term Investors", "Growth Investors", "Moderate Risk Investors"],
      "notSuitableFor": ["Dividend Investors", "Conservative Investors"]
    },
    "recommendation": "BUY",
    "investmentScore": 85,
    "confidence": 90,
    "confidenceReasoning": "High confidence due to consistent financial performance and strong market position.",
    "confidenceReasons": [
      "Recent financial reports available",
      "Multiple trusted sources found",
      "Strong news coverage"
    ],
    "reasoning": `${company} remains a market leader with strong growth prospects and high margins, despite increasing competition.`
  };
}
