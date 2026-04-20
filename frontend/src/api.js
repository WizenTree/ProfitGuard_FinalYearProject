import axios from "axios";

const API = process.env.REACT_APP_API_URL;

// Upload file
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return await axios.post(`${API}/upload`, formData);
};

// Get analysis
export const getAnalysis = async () => {
  return await axios.get(`${API}/analysis`);
};