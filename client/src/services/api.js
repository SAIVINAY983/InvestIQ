import axios from 'axios';

// Ensure this matches the port your backend runs on
const API_URL = 'http://localhost:5000/api';

export const analyzeCompany = async (companyName) => {
  const response = await axios.post(`${API_URL}/analyze`, { company: companyName });
  return response.data;
};
