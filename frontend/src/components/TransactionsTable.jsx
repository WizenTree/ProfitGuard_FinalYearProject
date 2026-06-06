import React from 'react';
import { useTheme } from '../context/ThemeContext';

function TransactionsTable({ transactions = [] }) {
  const { theme } = useTheme();

  const containerStyle = {
    background: theme.cardBg,
    padding: "24px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`,
    boxShadow: theme.shadow,
    overflowX: "auto"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    color: theme.text
  };

  const thStyle = {
    padding: "14px 12px",
    borderBottom: `2px solid ${theme.border}`,
    color: theme.textMuted,
    fontWeight: "600",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const tdStyle = {
    padding: "14px 12px",
    borderBottom: `1px solid ${theme.border}`,
    fontSize: "0.95rem"
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "₹0.00";
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  return (
    <div style={containerStyle}>
      {transactions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: theme.textMuted, fontSize: "16px", margin: 0 }}>No transactions found.</p>
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
                <tr key={index}>
                  <td style={tdStyle}>{new Date(tx.created_at).toLocaleDateString()}</td>
                  <td style={{ ...tdStyle, fontWeight: "500" }}>{tx.display_name || tx.product}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: "20px",
                      background: isSale ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isSale ? '#059669' : '#dc2626',
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "capitalize"
                    }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={tdStyle}>{tx.quantity}</td>
                  <td style={tdStyle}>{isSale ? formatCurrency(tx.total_revenue) : "-"}</td>
                  <td style={tdStyle}>{formatCurrency(tx.total_cost)}</td>
                  <td style={{
                    ...tdStyle,
                    color: !isSale ? theme.textMuted : tx.profit > 0 ? "#059669" : "#dc2626",
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