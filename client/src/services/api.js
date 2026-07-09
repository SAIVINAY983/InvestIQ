import axios from 'axios';

// Ensure this matches the port your backend runs on
const API_URL = 'http://localhost:5000/api';

export const analyzeCompany = async (companyName) => {
  try {
    const response = await axios.post(`${API_URL}/analyze`, { company: companyName }, {
      timeout: 90000 // 90 second timeout
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('The request timed out. The AI took too long to generate the massive report. Please try again.');
    }
    throw error;
  }
};

export const sendChatMessage = async (reportData, question) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, { reportData, question }, {
      timeout: 30000
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const compareCompanies = async (companyA, companyB) => {
  try {
    const response = await axios.post(`${API_URL}/compare`, { companyA, companyB }, {
      timeout: 120000 // 120 second timeout for comparison
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('The comparison request timed out. Please try again.');
    }
    throw error;
  }
};
