// frontend/src/services/api.js
import axios from "axios";
import { auth } from "./firebase"; 

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
    
    this.client = axios.create({
      baseURL: this.baseURL,
    });

    this.initializeInterceptors();
  }

  initializeInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // --- API METHODS ---
  async uploadFile(file) { // Renamed to exactly match your imports
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.client.post("/bulk-upload/", formData);
    return response.data;
  }

  async createTransaction(data) {
    const response = await this.client.post("/transaction/", data);
    return response.data;
  }

  async getTransactions(type = "") {
    const url = type ? `/transactions/?type=${type}` : "/transactions/";
    const response = await this.client.get(url);
    return response.data;
  }

  async getInventory() {
    const response = await this.client.get("/inventory/");
    return response.data;
  }

  async deleteProduct(productName) {
    const response = await this.client.delete(`/inventory/${encodeURIComponent(productName)}`);
    return response.data;
  }

  async getReports(period = "month") {
    const response = await this.client.get(`/reports/?period=${period}`);
    return response.data;
  }

  async deleteAllData() {
    const response = await this.client.delete("/transaction/all");
    return response.data;
  }
}

// 1. Create the Singleton instance
const apiService = new ApiService();

// 2. Export the instance as default for future OOP usage
export default apiService;

// 3. ✅ Export the bound methods individually to fix all 9 React import errors instantly!
export const uploadFile = apiService.uploadFile.bind(apiService);
export const createTransaction = apiService.createTransaction.bind(apiService);
export const getTransactions = apiService.getTransactions.bind(apiService);
export const getInventory = apiService.getInventory.bind(apiService);
export const deleteProduct = apiService.deleteProduct.bind(apiService);
export const getReports = apiService.getReports.bind(apiService);
export const deleteAllData = apiService.deleteAllData.bind(apiService);