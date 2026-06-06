import React, { useEffect, useState } from "react";
import { getInventory } from "../services/api";

function Inventory() {
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

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    color: "white",
    marginTop: "20px"
  };

  const thStyle = {
    padding: "12px",
    borderBottom: "2px solid #374151",
    color: "#9ca3af",
    fontWeight: "bold"
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #374151",
  };

  return (
    <div style={{ background: "#111827", minHeight: "100vh", padding: "30px", color: "white" }}>
      <h1>Inventory Management</h1>
      <p style={{ color: "#9ca3af" }}>Track your current stock levels and asset valuation.</p>

      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <div style={{ background: "#1f2937", padding: "20px", borderRadius: "12px", overflowX: "auto" }}>
          {inventory.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No inventory data available.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Product Name</th>
                  <th style={thStyle}>Stock Level</th>
                  <th style={thStyle}>Avg. Cost Price</th>
                  <th style={thStyle}>Total Asset Value</th>
                  <th style={thStyle}>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => {
                  const assetValue = (item.stock * item.avg_cost).toFixed(2);
                  return (
                    <tr key={index}>
                      <td style={tdStyle}>{item.display_name}</td>
                      <td style={{ ...tdStyle, color: item.stock < 10 ? "#ef4444" : "#10b981" }}>
                        {item.stock} {item.stock < 10 && "(Low)"}
                      </td>
                      <td style={tdStyle}>₹{item.avg_cost.toFixed(2)}</td>
                      <td style={tdStyle}>₹{assetValue}</td>
                      <td style={tdStyle}>{new Date(item.updated_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Inventory;