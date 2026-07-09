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

IMPORTANT: If the Financial Data section is empty or contains an error, you MUST attempt to extract the CEO, market cap, revenue, and other financial numbers directly from the "Recent News" and "Company Research/Context" sections. 
If specific data (such as the CEO, Headquarters, or exact Financial numbers) is STILL missing from the provided text, you MUST use your own internal knowledge base to fill in the most recent and accurate information available. Do not leave fields as "Not available".

Based on this information and your internal knowledge, provide a structured report in valid JSON format ONLY. 
Do not include any markdown formatting like \`\`\`json. Just the raw JSON.

The JSON MUST follow exactly this structure:
{{
  "companyName": "{company}",
  "executiveSummary": ["string (max 5 bullet points)"],
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
  "whyInvest": ["string (max 3 strengths)"],
  "whyAvoid": ["string (max 3 risks)"],
  "news": [
    {{
      "title": "string",
      "summary": "string",
      "source": "string",
      "publishedDate": "string",
      "url": "string",
      "sentiment": "Positive|Neutral|Negative"
    }}
  ],
  "overallNewsSentiment": "Positive|Neutral|Negative",
  "swot": {{
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  }},
  "risks": [
    {{
      "type": "Business Risk | Financial Risk | Competition | Market Risk",
      "description": "string"
    }}
  ],
  "recommendation": "BUY | HOLD | PASS",
  "investmentScore": 0,
  "confidence": 0,
  "confidenceReasoning": "string (brief explanation)",
  "reasoning": "string",
  "sources": [
    {{
      "name": "string",
      "url": "string"
    }}
  ]
}}
`,
  inputVariables: ["company", "financialData", "newsData", "researchData"],
});
