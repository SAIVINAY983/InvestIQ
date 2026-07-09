import { PromptTemplate } from "@langchain/core/prompts";

export const investmentReportPrompt = new PromptTemplate({
  template: `You are an expert AI Investment Analyst.
Analyze the following company data and generate a comprehensive investment report.

Company Name: {company}

Financial Data:
{financialData}

Recent News:
{newsData}

Company Research/Context:
{researchData}

IMPORTANT INSTRUCTIONS: 
1. If the Financial Data section is empty or contains an error, attempt to extract the CEO, market cap, revenue, and other financial numbers directly from the "Recent News" and "Company Research/Context" sections. 
2. If specific data is missing, use your internal knowledge base to fill in the most recent information.
3. Automatically detect if the company is Public or Private based on available stock data and context.
4. Provide detailed reasoning for every score, confident assessments, and a clear investment thesis.
5. Create a valid JSON output matching the EXACT structure below. Do not include markdown formatting like \`\`\`json.

The JSON MUST follow exactly this structure:
{{
  "companyName": "{company}",
  "isPublic": true,
  "executiveSummary": ["string (max 5 bullet points)"],
  "investmentThesis": "string (3-5 lines concise summary of why to invest or not)",
  "overview": {{
    "industry": "string",
    "ceo": "string",
    "headquarters": "string",
    "employees": 0,
    "marketCap": "string",
    "businessSummary": "string"
  }},
  "financials": {{
    "revenue": "string",
    "netIncome": "string",
    "peRatio": "string",
    "eps": "string",
    "profitMargin": "string",
    "cashFlow": "string",
    "debt": "string"
  }},
  "scoreBreakdown": {{
    "financialHealth": 0,
    "growthPotential": 0,
    "riskScore": 0,
    "newsSentiment": 0,
    "overall": 0
  }},
  "scoreReasoning": {{
    "financialHealth": ["string (bullet point reasons)"],
    "growthPotential": ["string"],
    "riskScore": ["string"],
    "newsSentiment": ["string"]
  }},
  "bullCase": ["string (max 3 points)"],
  "bearCase": ["string (max 3 points)"],
  "whyInvest": ["string (max 3 strengths)"],
  "whyAvoid": ["string (max 3 risks)"],
  "positiveCatalysts": ["string (max 3)"],
  "negativeCatalysts": ["string (max 3)"],
  "recommendationScenarios": {{
    "downgradeScenario": ["string (max 2 points)"],
    "upgradeScenario": ["string (max 2 points)"]
  }},
  "news": [
    {{
      "title": "string",
      "summary": "string (keep very brief)",
      "source": "string",
      "publishedDate": "string",
      "url": "string",
      "sentiment": "Positive|Neutral|Negative"
    }} // MAX 3 NEWS ITEMS
  ],
  "overallNewsSentiment": "Positive|Neutral|Negative",
  "swot": {{
    "strengths": ["string (max 3)"],
    "weaknesses": ["string (max 3)"],
    "opportunities": ["string (max 3)"],
    "threats": ["string (max 3)"]
  }},
  "risks": [
    {{
      "type": "Business Risk | Financial Risk | Competition | Market Risk",
      "description": "string (max 1 sentence)"
    }} // MAX 3 RISKS
  ],
  "redFlags": ["string (max 3 serious warnings or empty array)"],
  "portfolioSuitability": {{
    "suitableFor": ["string (max 2)"],
    "notSuitableFor": ["string (max 2)"]
  }},
  "recommendation": "BUY | HOLD | PASS",
  "investmentScore": 0,
  "confidence": 0,
  "confidenceReasoning": "string (brief overall explanation)",
  "confidenceReasons": ["string (bullet points explaining why confidence is high or low)"],
  "reasoning": "string",
  "sources": [
    {{
      "name": "string",
      "url": "string",
      "reliabilityScore": 0
    }}
  ]
}}
`,
  inputVariables: ["company", "financialData", "newsData", "researchData"],
});
