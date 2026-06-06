import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import { createTransaction } from "../services/api"; // Clean API call
import { useTheme } from "../context/ThemeContext";

function AddTransaction({ setResult }) {
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    product: "",
    type: "sale",
    quantity: 1,
    selling_price: "",
    cost_price: "",
    shipping: "",
    fees: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        selling_price: Number(formData.selling_price) || 0,
        cost_price: Number(formData.cost_price) || 0,
        shipping: Number(formData.shipping) || 0,
        fees: Number(formData.fees) || 0,
      };

      const data = await createTransaction(payload);

      if (setResult) {
        setResult({
          parsed_data: { product: data.product },
          profit_data: { profit: data.profit },
          suggestions: [`Added ${data.quantity}x ${data.display_name} (${data.type})`]
        });
      }

      alert("✅ Transaction Added Successfully!");
      setFormData({ ...formData, product: "", selling_price: "", cost_price: "", shipping: "", fees: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Themed Styles
  const cardStyle = {
    background: theme.cardBg,
    padding: "32px",
    borderRadius: "12px",
    border: `1px solid ${theme.border}`, 
    boxShadow: theme.shadow
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginTop: "8px",
    borderRadius: "8px",
    border: `1px solid ${theme.border}`,
    background: theme.bg, 
    color: theme.text,
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s ease"
  };

  const labelStyle = {
    fontSize: "13px",
    color: theme.textMuted,
    fontWeight: "500",
    display: "block"
  };

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.text, padding: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start", transition: "all 0.3s ease" }}>
      <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "32px" }}>
        
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>Add Transactions</h1>
          <p style={{ color: theme.textMuted, margin: 0, fontSize: "16px" }}>
            Log your business transactions manually or import bulk data.
          </p>
        </div>

        {/* Manual Entry Form */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "20px" }}>Manual Entry</h2>
          <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "24px" }}>Enter the details of a single purchase or sale transaction.</p>

          <form onSubmit={handleManualSubmit}>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 2, minWidth: "200px" }}>
                <label style={labelStyle}>Product Name</label>
                <input name="product" placeholder="e.g. Wireless Mouse" value={formData.product} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div style={{ flex: 1, minWidth: "120px" }}>
                <label style={labelStyle}>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange} style={inputStyle}>
                  <option value="sale">Sale</option>
                  <option value="purchase">Purchase</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <label style={labelStyle}>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} style={inputStyle} required />
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "120px" }}>
                <label style={labelStyle}>Quantity</label>
                <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleInputChange} style={inputStyle} required />
              </div>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <label style={labelStyle}>Cost Price (₹)</label>
                <input type="number" step="0.01" name="cost_price" placeholder="0.00" value={formData.cost_price} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <label style={labelStyle}>Selling Price (₹)</label>
                <input type="number" step="0.01" name="selling_price" placeholder="0.00" value={formData.selling_price} onChange={handleInputChange} style={inputStyle} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                background: theme.accent,
                color: "#ffffff",
                padding: "14px",
                width: "100%",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "600",
                marginTop: "16px",
                fontSize: "15px",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "Processing..." : "Log Transaction"}
            </button>
          </form>
        </div>

        {/* Bulk Upload Component */}
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "20px" }}>Bulk Upload</h2>
          <p style={{ fontSize: "14px", color: theme.textMuted, marginBottom: "24px" }}>
            Upload a CSV file to import multiple transactions at once.
          </p>
          <UploadForm setResult={setResult} />
        </div>

      </div>
    </div>
  );
}

export default AddTransaction;