process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import 'dotenv/config';
import { getFinancialData } from './utils/yahooFinance.js';

async function testYahoo() {
  console.log("Testing Yahoo Finance for Apple...");
  try {
    const data = await getFinancialData("Apple");
    console.dir(data, { depth: null });
  } catch (err) {
    console.error("Crash Error:", err);
  }
}

testYahoo();
