// import React, { useEffect, useState } from "react";
// import TransactionsTable from "../components/TransactionsTable";
// import { getTransactions } from "../services/api";

// function TransactionHistory() {

//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("");

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);

//       const data = await getTransactions(filter);
//       console.log("API DATA:", data); // 🔥 DEBUG

//       setTransactions(data.items || []);

//     } catch (err) {
//       console.error("Failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [filter]);

//   return (
//     <div style={{
//       background: "#111827",
//       minHeight: "100vh",
//       padding: "30px",
//       color: "white"
//     }}>

//       <h1>Transaction History</h1>

//       <div style={{ marginBottom: "20px" }}>
//         <select
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//           style={{
//             padding: "8px",
//             background: "#1f2937",
//             color: "white",
//             border: "1px solid #374151"
//           }}
//         >
//           <option value="">All</option>
//           <option value="sale">Sales</option>
//           <option value="purchase">Purchases</option>
//         </select>

//         <button
//           onClick={fetchTransactions}
//           style={{
//             marginLeft: "10px",
//             padding: "8px",
//             background: "#374151",
//             color: "white"
//           }}
//         >
//           Refresh
//         </button>
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <TransactionsTable transactions={transactions} />
//       )}

//     </div>
//   );
// }

// export default TransactionHistory;

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
      setTransactions(data.items || []);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]); // Auto-fetches when dropdown changes

  return (
    <div style={{
      background: "#0f172a", // Aligned with AddTransaction deep slate
      minHeight: "100vh",
      padding: "40px",
      color: "#f8fafc",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start" 
    }}>
      
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        {/* Page Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>Transaction Ledger</h1>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "16px" }}>
            View and filter your complete history of sales and inventory purchases.
          </p>
        </div>

        {/* Controls Bar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px",
          background: "#1e293b",
          padding: "16px 24px",
          borderRadius: "12px",
          border: "1px solid #334155",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>Filter By:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#0f172a",
                color: "#f8fafc",
                border: "1px solid #475569",
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
            onClick={fetchTransactions}
            disabled={loading}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
              color: loading ? "#94a3b8" : "#f8fafc",
              border: "1px solid #475569",
              borderRadius: "6px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s ease"
            }}
          >
            {loading ? "Refreshing..." : "↻ Refresh Data"}
          </button>

        </div>

        {/* Main Table Area */}
        {loading && transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
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