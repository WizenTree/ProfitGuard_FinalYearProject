import React, { useEffect, useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { getTransactions } from "../services/api";

function TransactionHistory() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const data = await getTransactions(filter);
      console.log("API DATA:", data); // 🔥 DEBUG

      setTransactions(data.items || []);

    } catch (err) {
      console.error("Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  return (
    <div style={{
      background: "#111827",
      minHeight: "100vh",
      padding: "30px",
      color: "white"
    }}>

      <h1>Transaction History</h1>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            background: "#1f2937",
            color: "white",
            border: "1px solid #374151"
          }}
        >
          <option value="">All</option>
          <option value="sale">Sales</option>
          <option value="purchase">Purchases</option>
        </select>

        <button
          onClick={fetchTransactions}
          style={{
            marginLeft: "10px",
            padding: "8px",
            background: "#374151",
            color: "white"
          }}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TransactionsTable transactions={transactions} />
      )}

    </div>
  );
}

export default TransactionHistory;