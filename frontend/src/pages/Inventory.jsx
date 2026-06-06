import React, { useEffect, useState } from "react";
import { getInventory, deleteProduct } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Inventory() {
  const { theme } = useTheme();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await getInventory();
        setInventory(data.items || []);
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // ✅ NEW: Delete Handler
  const handleDelete = async (productName, displayName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${displayName}"? This will remove it from your catalog.`);
    
    if (isConfirmed) {
      try {
        await deleteProduct(productName);
        // Optimistic UI Update: Remove item from state without refreshing the page
        setInventory(prev => prev.filter(item => item.name !== productName));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("❌ Failed to delete product. Please try again.");
      }
    }
  };

  const thStyle = {
    padding: "14px 12px",
    borderBottom: `2px solid ${theme.border}`,
    color: theme.textMuted,
    fontWeight: "600",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "14px 12px",
    borderBottom: `1px solid ${theme.border}`,
    color: theme.text
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", padding: "40px", color: theme.text, transition: "all 0.3s ease" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Inventory Management</h1>
        <p style={{ color: theme.textMuted, marginBottom: "32px" }}>Track your current stock levels and asset valuation.</p>

        {loading ? (
          <p style={{ color: theme.textMuted }}>Loading inventory...</p>
        ) : (
          <div style={{ background: theme.cardBg, padding: "24px", borderRadius: "12px", border: `1px solid ${theme.border}`, boxShadow: theme.shadow, overflowX: "auto" }}>
            {inventory.length === 0 ? (
              <p style={{ color: theme.textMuted }}>No inventory data available.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Product Name</th>
                    <th style={thStyle}>Stock Level</th>
                    <th style={thStyle}>Avg. Cost Price</th>
                    <th style={thStyle}>Total Asset Value</th>
                    <th style={thStyle}>Last Updated</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item, index) => {
                    const assetValue = (item.stock * item.avg_cost).toFixed(2);
                    return (
                      <tr key={index}>
                        <td style={{ ...tdStyle, fontWeight: "500" }}>{item.display_name}</td>
                        <td style={{ ...tdStyle, color: item.stock < 10 ? "#ef4444" : "#10b981", fontWeight: "600" }}>
                          {item.stock} {item.stock < 10 && " (Low)"}
                        </td>
                        <td style={tdStyle}>₹{item.avg_cost.toFixed(2)}</td>
                        <td style={tdStyle}>₹{assetValue}</td>
                        <td style={tdStyle}>{new Date(item.updated_at).toLocaleDateString()}</td>
                        <td style={{ ...tdStyle, textAlign: "center" }}>
                          {/* Clean Delete Button */}
                          <button 
                            onClick={() => handleDelete(item.name, item.display_name)}
                            title="Delete Product"
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "16px",
                              padding: "6px",
                              borderRadius: "4px",
                              transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;