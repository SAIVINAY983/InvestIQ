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
