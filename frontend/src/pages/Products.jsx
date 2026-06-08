import React, { useEffect, useState } from "react";
import { getInventory, deleteProduct } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Products() {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getInventory();
        // ✅ Change .items to .data here as well
        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // ✅ NEW: Delete Handler
  const handleDelete = async (productName, displayName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${displayName}"?`);
    
    if (isConfirmed) {
      try {
        await deleteProduct(productName);
        // Optimistic UI Update
        setProducts(prev => prev.filter(item => item.name !== productName));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("❌ Failed to delete product.");
      }
    }
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", padding: "40px", color: theme.text, transition: "all 0.3s ease" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Product Catalog</h1>
            <p style={{ color: theme.textMuted, margin: 0 }}>Manage your product listings and details.</p>
          </div>
          <button style={{
            background: theme.accent, color: "#fff", border: "none", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
          }}>
            + New Product
          </button>
        </div>

        {loading ? (
          <p style={{ color: theme.textMuted }}>Loading catalog...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {products.map((item, index) => (
              <div key={index} style={{
                position: "relative", // Needed to position the delete button
                background: theme.cardBg, border: `1px solid ${theme.border}`, boxShadow: theme.shadow, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column"
              }}>
                
                {/* Delete Button top right */}
                <button 
                  onClick={() => handleDelete(item.name, item.display_name)}
                  title="Delete Product"
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    background: "transparent",
                    border: "none",
                    color: theme.textMuted,
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "6px",
                    borderRadius: "4px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = theme.textMuted; e.currentTarget.style.background = "transparent"; }}
                >
                  🗑️
                </button>

                <div style={{ width: "48px", height: "48px", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "10px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                  📦
                </div>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem", paddingRight: "30px" }}>{item.display_name}</h3>
                
                <div style={{ color: theme.textMuted, fontSize: "0.95rem", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span>In Stock:</span>
                    <strong style={{ color: theme.text }}>{item.stock} units</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Avg Cost:</span>
                    <strong style={{ color: theme.text }}>₹{item.avg_cost.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Products;