import React, { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";
import { useTheme } from "../context/ThemeContext";

function TransactionHistory() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState("");
  const { transactions, loading, error, refetch } = useTransactions(filter);

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>Transaction Ledger</h1>
          <p style={{ color: theme.textMuted, margin: 0, fontSize: "16px" }}>
            View and filter your complete history of sales and inventory purchases.
          </p>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px",
          background: theme.cardBg,
          padding: "16px 24px",
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ color: theme.text, fontSize: "14px", fontWeight: "500" }}>Filter By:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                background: theme.bg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: "6px",
                outline: "none",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              <option value="">All Transactions</option>
              <option value="sale">Sales Only</option>
              <option value="purchase">Purchases Only</option>
            </select>
          </div>

          <button
            onClick={refetch}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: theme.accent,
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.15s ease"
            }}
          >
            {loading ? "Refreshing..." : "↻ Refresh Data"}
          </button>
        </div>

        {error && <div style={{ color: "#ef4444", padding: "10px" }}>Error: {error}</div>}

        {loading && transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted }}>
            Fetching database records...
          </div>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}

      </div>
    </div>
  );
}

export default TransactionHistory;