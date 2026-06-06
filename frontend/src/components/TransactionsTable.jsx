// import React from 'react';

// function TransactionsTable({ transactions = [] }) {

//   const containerStyle = {
//     background: "#1f2937",
//     padding: "20px",
//     borderRadius: "12px",
//     marginTop: "20px",
//     overflowX: "auto"
//   };

//   const tableStyle = {
//     width: "100%",
//     borderCollapse: "collapse",
//     textAlign: "left",
//     color: "white"
//   };

//   const thStyle = {
//     padding: "12px",
//     borderBottom: "2px solid #374151",
//     color: "#9ca3af",
//     fontWeight: "bold",
//     fontSize: "0.85rem"
//   };

//   const tdStyle = {
//     padding: "12px",
//     borderBottom: "1px solid #374151",
//     fontSize: "0.9rem"
//   };

//   return (
//     <div style={containerStyle}>
//       <h3 style={{ marginBottom: "20px" }}>Recent Transactions</h3>

//       {transactions.length === 0 ? (
//         <p style={{ color: "#9ca3af" }}>No transactions available.</p>
//       ) : (
//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Date</th>
//               <th style={thStyle}>Product</th>
//               <th style={thStyle}>Type</th>
//               <th style={thStyle}>Qty</th>
//               <th style={thStyle}>Revenue</th>
//               <th style={thStyle}>Cost</th>
//               <th style={thStyle}>Profit</th>
//             </tr>
//           </thead>

//           <tbody>
//             {transactions.map((tx, index) => (
//               <tr key={index}>
//                 <td style={tdStyle}>
//                   {new Date(tx.created_at).toLocaleDateString()}
//                 </td>

//                 <td style={tdStyle}>
//                   {tx.display_name || tx.product}
//                 </td>

//                 <td style={tdStyle}>
//                   <span style={{
//                     padding: "4px 8px",
//                     borderRadius: "6px",
//                     background: tx.type === 'sale' ? '#064e3b' : '#7f1d1d',
//                     color: "white",
//                     fontSize: "12px"
//                   }}>
//                     {tx.type}
//                   </span>
//                 </td>

//                 <td style={tdStyle}>{tx.quantity}</td>

//                 {/* ✅ NEW VALUES */}
//                 <td style={tdStyle}>₹{tx.total_revenue}</td>
//                 <td style={tdStyle}>₹{tx.total_cost}</td>

//                 <td style={{
//                   ...tdStyle,
//                   color: tx.profit >= 0 ? "#10b981" : "#ef4444"
//                 }}>
//                   ₹{tx.profit}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default TransactionsTable;

import React from 'react';

function TransactionsTable({ transactions = [] }) {

  const containerStyle = {
    background: "#1e293b", // Premium slate card background
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #334155",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
    overflowX: "auto"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    color: "#f8fafc"
  };

  const thStyle = {
    padding: "14px 12px",
    borderBottom: "2px solid #334155",
    color: "#94a3b8",
    fontWeight: "600",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #334155",
    fontSize: "0.95rem"
  };

  // Safe currency formatter to prevent long decimal layout breaking
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₹0.00";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div style={containerStyle}>
      {transactions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📭</div>
          <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>No transactions found.</p>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Type</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Revenue</th>
              <th style={thStyle}>Cost</th>
              <th style={thStyle}>Profit</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, index) => {
              const isSale = tx.type === 'sale';

              return (
                <tr key={index} style={{ transition: "background 0.2s", ":hover": { background: "#0f172a" } }}>
                  
                  <td style={{ ...tdStyle, color: "#cbd5e1" }}>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>

                  <td style={{ ...tdStyle, fontWeight: "500", color: "#f8fafc" }}>
                    {tx.display_name || tx.product}
                  </td>

                  <td style={tdStyle}>
                    {/* Modern Translucent Pill Badges */}
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: isSale ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isSale ? '#34d399' : '#f87171',
                      border: `1px solid ${isSale ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      letterSpacing: "0.5px"
                    }}>
                      {tx.type}
                    </span>
                  </td>

                  <td style={tdStyle}>{tx.quantity}</td>

                  {/* Smart logic: Purchases don't have Revenue */}
                  <td style={tdStyle}>
                    {isSale ? formatCurrency(tx.total_revenue) : <span style={{ color: "#475569" }}>-</span>}
                  </td>
                  
                  <td style={tdStyle}>
                    {formatCurrency(tx.total_cost)}
                  </td>

                  {/* Smart logic: Purchases don't have Profit */}
                  <td style={{
                    ...tdStyle,
                    color: !isSale ? "#475569" : tx.profit > 0 ? "#34d399" : tx.profit < 0 ? "#f87171" : "#94a3b8",
                    fontWeight: isSale ? "600" : "normal"
                  }}>
                    {isSale ? formatCurrency(tx.profit) : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionsTable;