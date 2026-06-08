// frontend/src/pages/Products.jsx
import React, { useEffect, useState } from "react";
import { getInventory, deleteProduct } from "../services/api";
import Button from "../components/ui/Button"; // ✅ Imported the modular Button

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getInventory();
        setProducts(response.data || []); // ✅ Using the corrected API data structure
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productName, displayName) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${displayName}"?`);
    if (isConfirmed) {
      try {
        await deleteProduct(productName);
        setProducts(prev => prev.filter(item => item.name !== productName));
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("❌ Failed to delete product.");
      }
    }
  };

  return (
    <div className="pg-page-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Product Catalog</h1>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Manage your product listings and details.</p>
        </div>
        {/* ✅ Using our modular Button component */}
        <Button variant="primary" style={{ width: "auto" }}>
          + New Product
        </Button>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading catalog...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
          {products.map((item, index) => (
            <div key={index} className="pg-card" style={{ position: "relative", display: "flex", flexDirection: "column" }}>
              
              <button 
                className="pg-icon-btn danger"
                onClick={() => handleDelete(item.name, item.display_name)}
                title="Delete Product"
                style={{ position: "absolute", top: "16px", right: "16px" }}
              >
                🗑️
              </button>

              <div style={{ 
                width: "48px", height: "48px", background: "var(--bg-color)", 
                border: "1px solid var(--border-color)", borderRadius: "10px", 
                marginBottom: "16px", display: "flex", alignItems: "center", 
                justifyContent: "center", fontSize: "24px" 
              }}>
                📦
              </div>
              
              <h3 style={{ margin: "0 0 12px 0", fontSize: "1.1rem", paddingRight: "30px" }}>
                {item.display_name}
              </h3>
              
              <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span>In Stock:</span>
                  <strong style={{ color: "var(--text-color)" }}>{item.stock} units</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Avg Cost:</span>
                  <strong style={{ color: "var(--text-color)" }}>₹{item.avg_cost.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;