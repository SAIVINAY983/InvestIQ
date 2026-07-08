import 'dotenv/config';
import { getFinancialData } from './utils/yahooFinance.js';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function runTest() {
  console.log("=== DIAGNOSTIC TEST ===");
  
  // Test 1: Yahoo Finance
  console.log("\n1. Testing Yahoo Finance...");
  try {
    const data = await getFinancialData("Apple");
    if (data.error) {
      console.log("❌ Yahoo Finance Failed:", data.error);
    } else {
      console.log("✅ Yahoo Finance Success! Found ticker:", data.ticker);
    }
  } catch (err) {
    console.log("❌ Yahoo Finance Threw Error:", err.message);
  }

  // Test 2: Gemini API Key
  console.log("\n2. Testing Gemini API Key...");
  try {
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
      maxOutputTokens: 10,
    });
    
    const res = await model.invoke("Say hello");
    console.log("✅ Gemini API Success! Response:");
    console.dir(res, { depth: null });
  } catch (err) {
    console.log("❌ Gemini API Failed!");
    console.log("   Reason:", err.message);
  }
}

runTest();
