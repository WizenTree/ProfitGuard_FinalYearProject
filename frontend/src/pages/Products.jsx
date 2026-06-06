import React, { useEffect, useState } from "react";
import { getInventory } from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getInventory();
        setProducts(data.items || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ background: "#111827", minHeight: "100vh", padding: "30px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h1 style={{ margin: 0 }}>Product Catalog</h1>
          <p style={{ color: "#9ca3af", margin: "5px 0 0 0" }}>Manage your product listings and details.</p>
        </div>
        <button style={{
          background: "#3b82f6", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
        }}>
          + New Product
        </button>
      </div>

      {loading ? (
        <p>Loading catalog...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {products.map((item, index) => (
            <div key={index} style={{
              background: "#1f2937", border: "1px solid #374151", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column"
            }}>
              <div style={{ width: "40px", height: "40px", background: "#374151", borderRadius: "8px", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                📦
              </div>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "1.1rem" }}>{item.display_name}</h3>
              <div style={{ color: "#9ca3af", fontSize: "0.9rem", flex: 1 }}>
                <p style={{ margin: "5px 0" }}>In Stock: <strong style={{ color: "white" }}>{item.stock} units</strong></p>
                <p style={{ margin: "5px 0" }}>Avg Cost: <strong style={{ color: "white" }}>₹{item.avg_cost.toFixed(2)}</strong></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;