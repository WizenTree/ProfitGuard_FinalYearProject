import { useState, useEffect } from "react";
import { getTransactions } from "../services/api";

// Encapsulates state management and API fetching (Abstraction)
export const useTransactions = (filter) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions(filter);
      setTransactions(data.items || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  // Expose only what the UI needs (Encapsulation)
  return { transactions, loading, error, refetch: fetchTransactions };
};