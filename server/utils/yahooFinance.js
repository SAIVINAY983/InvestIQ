import yahooFinance from 'yahoo-finance2';

export const getFinancialData = async (companySymbol) => {
  try {
    // 1. Search for the ticker
    const searchRes = await yahooFinance.search(companySymbol);
    const ticker = searchRes.quotes?.[0]?.symbol;

    if (!ticker) {
      return { error: "Could not find stock ticker for this company." };
    }

    // 2. Fetch financial data modules
    const quoteSummary = await yahooFinance.quoteSummary(ticker, {
      modules: ['financialData', 'defaultKeyStatistics', 'summaryProfile']
    });

    return {
      ticker,
      financialData: quoteSummary.financialData || {},
      keyStatistics: quoteSummary.defaultKeyStatistics || {},
      profile: quoteSummary.summaryProfile || {}
    };
  } catch (error) {
    console.error("Yahoo Finance API Error:", error.message);
    return { error: "Failed to fetch financial data" };
  }
};
