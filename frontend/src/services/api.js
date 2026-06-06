import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// BULK UPLOAD
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API}/bulk-upload/`, formData);
  return response.data;
};

// TRANSACTIONS
export const createTransaction = async (data) => {
  const response = await axios.post(`${API}/transaction/`, data);
  return response.data;
};

export const getTransactions = async (type = "") => {
  const url = type ? `${API}/transactions/?type=${type}` : `${API}/transactions/`;
  const response = await axios.get(url);
  return response.data;
};

// INVENTORY & PRODUCTS
export const getInventory = async () => {
  const response = await axios.get(`${API}/inventory/`);
  return response.data;
};

// ✅ NEW: Delete Product API Call
export const deleteProduct = async (productName) => {
  const response = await axios.delete(`${API}/inventory/${encodeURIComponent(productName)}`);
  return response.data;
};

// REPORTS
export const getReports = async () => {
  const response = await axios.get(`${API}/reports/`);
  return response.data;
};