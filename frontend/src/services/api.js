// frontend/src/services/api.js
import axios from "axios";
import { auth } from "./firebase"; // Import your Firebase auth instance

const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

// 1. Create an Axios instance instead of using the global axios
const apiClient = axios.create({
  baseURL: API,
});

// 2. Add a request interceptor to inject the Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    // Check if Firebase has a logged-in user
    if (auth.currentUser) {
      // Get the fresh JWT token
      const token = await auth.currentUser.getIdToken();
      // Attach it to the headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// BULK UPLOAD
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  // Use apiClient instead of axios
  const response = await apiClient.post(`/bulk-upload/`, formData);
  return response.data;
};

// TRANSACTIONS
export const createTransaction = async (data) => {
  const response = await apiClient.post(`/transaction/`, data);
  return response.data;
};

export const getTransactions = async (type = "") => {
  const url = type ? `/transactions/?type=${type}` : `/transactions/`;
  const response = await apiClient.get(url);
  return response.data;
};

// INVENTORY & PRODUCTS
export const getInventory = async () => {
  const response = await apiClient.get(`/inventory/`);
  return response.data;
};

// Delete Product API Call
export const deleteProduct = async (productName) => {
  const response = await apiClient.delete(`/inventory/${encodeURIComponent(productName)}`);
  return response.data;
};

// REPORTS
export const getReports = async () => {
  const response = await apiClient.get(`/reports/`);
  return response.data;
};