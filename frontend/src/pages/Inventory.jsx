// frontend/src/pages/Inventory.jsx
import React, { useEffect, useState } from "react";
import { getInventory, deleteProduct } from "../services/api";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await getInventory();
        setInventory(response.data || []); // ✅ Using the corrected API data structure
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const handleDelete = async (productName, displayName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${displayName}"?`);
    if (isConfirmed) {
      try {
        await deleteProduct(productName);
        setInventory(prev => prev.filter(item => item.name !== productName));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("❌ Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="pg-page-container">
      <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Inventory Management</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Track your current stock levels and asset valuation.</p>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading inventory...</p>
      ) : (
        <div className="pg-card" style={{ overflowX: "auto" }}>
          {inventory.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No inventory data available.</p>
          ) : (
            <table className="pg-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Stock Level</th>
                  <th>Avg. Cost Price</th>
                  <th>Total Asset Value</th>
                  <th>Last Updated</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => {
                  const assetValue = (item.stock * item.avg_cost).toFixed(2);
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: "500" }}>{item.display_name}</td>
                      <td style={{ color: item.stock < 10 ? "#ef4444" : "#10b981", fontWeight: "600" }}>
                        {item.stock} {item.stock < 10 && " (Low)"}
                      </td>
                      <td>₹{item.avg_cost.toFixed(2)}</td>
                      <td>₹{assetValue}</td>
                      <td>{new Date(item.updated_at).toLocaleDateString()}</td>
                      <td style={{ textAlign: "center" }}>
                        <button 
                          className="pg-icon-btn danger"
                          onClick={() => handleDelete(item.name, item.display_name)}
                          title="Delete Product"
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
  );
}

export default Inventory;