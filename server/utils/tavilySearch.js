import axios from 'axios';

export const searchCompanyNews = async (company) => {
  if (!process.env.TAVILY_API_KEY) {
    return { error: "Tavily API key not set" };
  }

  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: `${company} latest business and financial news`,
      search_depth: "basic",
      include_images: false,
      include_answers: false,
      max_results: 5
    });

    return response.data.results;
  } catch (error) {
    console.error("Tavily News Error:", error);
    return { error: "Failed to fetch news" };
  }
};

export const researchCompanyInfo = async (company) => {
  if (!process.env.TAVILY_API_KEY) {
    return { error: "Tavily API key not set" };
  }

  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: `${company} company overview, business model, competitors, and recent developments`,
      search_depth: "advanced",
      include_images: false,
      include_answers: true,
      max_results: 3
    });

    return {
      answer: response.data.answer,
      results: response.data.results
    };
  } catch (error) {
    console.error("Tavily Research Error:", error);
    return { error: "Failed to fetch research" };
  }
};
