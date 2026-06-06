import React, { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions"; // Import our OOP-style hook

function TransactionHistory() {
  const [filter, setFilter] = useState("");
  
  // Clean Abstraction: The component doesn't know HOW data is fetched, just that it HAS it.
  const { transactions, loading, error, refetch } = useTransactions(filter);

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "40px", color: "#f8fafc" }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>Transaction Ledger</h1>
        </div>

        {/* Controls */}
        <div style={{ /* ... your existing control bar styles ... */ }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Transactions</option>
            <option value="sale">Sales Only</option>
            <option value="purchase">Purchases Only</option>
          </select>

          <button onClick={refetch} disabled={loading}>
            {loading ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </div>

        {/* Error Handling */}
        {error && <div style={{ color: "#ef4444", padding: "10px" }}>Error: {error}</div>}

        {/* Table View */}
        {loading && transactions.length === 0 ? (
          <p>Fetching database records...</p>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}

      </div>
    </div>
  );
}

export default TransactionHistory;