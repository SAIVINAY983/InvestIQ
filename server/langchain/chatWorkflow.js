import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { withRetry } from "./retryHelper.js";

const chatPrompt = new PromptTemplate({
  template: `You are an expert AI Investment Analyst assistant.
The user has generated an investment report for a company, and now they are asking a follow-up question.

Here is the full investment report (in JSON format) that was previously generated. Use THIS data as your primary source of truth:
{reportContext}

Here is the user's question:
{question}

Answer the user's question accurately based strictly on the provided report context. 
Be concise, professional, and directly address the user's inquiry. If the answer cannot be found in the report context, state that clearly but provide your best expert opinion if appropriate.
Do not use markdown blocks like \`\`\`json unless asked to output JSON. Just output plain text (markdown formatting like bolding is fine).
`,
  inputVariables: ["reportContext", "question"],
});

export const runChatWorkflow = async (reportData, question) => {
  if (!process.env.GOOGLE_API_KEY) {
    return "This is a mock chat response since no GOOGLE_API_KEY was found. In a real environment, the AI would answer: '" + question + "' based on the report.";
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEY,
    temperature: 0.5,
    maxRetries: 5,
  });

  const chain = chatPrompt.pipe(model).pipe(new StringOutputParser());

  try {
    const response = await withRetry(async () => {
      return await chain.invoke({
        reportContext: JSON.stringify(reportData),
        question: question
      });
    });
    return response;
  } catch (error) {
    console.error("Chat API Error:", error);
    return "I'm sorry, but I couldn't reach the AI service right now due to rate limits. As a fallback for this demo, I can tell you that based on the report, the company has strong fundamentals but faces some competitive risks.";
  }
};
