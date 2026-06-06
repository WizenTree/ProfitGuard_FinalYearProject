import React from 'react';

function TransactionsTable({ transactions = [] }) {

  const containerStyle = {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    overflowX: "auto"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    color: "white"
  };

  const thStyle = {
    padding: "12px",
    borderBottom: "2px solid #374151",
    color: "#9ca3af",
    fontWeight: "bold",
    fontSize: "0.85rem"
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #374151",
    fontSize: "0.9rem"
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: "20px" }}>Recent Transactions</h3>

      {transactions.length === 0 ? (
        <p style={{ color: "#9ca3af" }}>No transactions available.</p>
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
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td style={tdStyle}>
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>

                <td style={tdStyle}>
                  {tx.display_name || tx.product}
                </td>

                <td style={tdStyle}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    background: tx.type === 'sale' ? '#064e3b' : '#7f1d1d',
                    color: "white",
                    fontSize: "12px"
                  }}>
                    {tx.type}
                  </span>
                </td>

                <td style={tdStyle}>{tx.quantity}</td>

                {/* ✅ NEW VALUES */}
                <td style={tdStyle}>₹{tx.total_revenue}</td>
                <td style={tdStyle}>₹{tx.total_cost}</td>

                <td style={{
                  ...tdStyle,
                  color: tx.profit >= 0 ? "#10b981" : "#ef4444"
                }}>
                  ₹{tx.profit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TransactionsTable;