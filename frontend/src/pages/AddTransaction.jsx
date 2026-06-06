import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import { theme } from "../styles/theme";

function AddTransaction({ setResult }) {
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

  // State for professional button interactions
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🚀 BACKEND CALL
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/transaction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          product: formData.product,
          type: formData.type,
          quantity: Number(formData.quantity),
          selling_price: Number(formData.selling_price) || 0,
          cost_price: Number(formData.cost_price) || 0,
          shipping: Number(formData.shipping) || 0,
          fees: Number(formData.fees) || 0,
          date: formData.date
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to add transaction");
      }

      // ✅ Send backend result to dashboard
      setResult({
        parsed_data: {
          product: data.product,
        },
        profit_data: {
          profit: data.profit,
        },
        suggestions: [
          `Added ${data.quantity}x ${data.product} (${data.type})`
        ]
      });

      alert("✅ Transaction Added Successfully!");

      // Reset form
      setFormData({
        product: "",
        type: "sale",
        quantity: 1,
        selling_price: "",
        cost_price: "",
        shipping: "",
        fees: "",
        date: new Date().toISOString().split('T')[0]
      });

    } catch (error) {
      console.error(error);
      alert("❌ Error: " + error.message);
    }
  };

  // UI Styles - Premium Dark Neutral Theme
  const pageStyle = {
    background: "#0f172a", // Deep slate background
    minHeight: "100vh",
    color: "#f8fafc",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start" 
  };

  const contentWrapper = {
    width: "100%",
    maxWidth: "800px", 
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  };

  const cardStyle = {
    background: "#1e293b", // Lighter slate for cards
    padding: "32px",
    borderRadius: "12px",
    border: "1px solid #334155", 
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)"
  };

  const sectionTitle = {
    marginTop: 0,
    marginBottom: "8px",
    color: "#f8fafc",
    fontSize: "20px",
    fontWeight: "600",
    letterSpacing: "0.5px"
  };

  const sectionDesc = {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "24px",
    lineHeight: "1.5"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    marginTop: "8px",
    borderRadius: "8px",
    border: "1px solid #475569",
    background: "#0f172a", 
    color: "#e2e8f0",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s ease"
  };

  const labelStyle = {
    fontSize: "13px",
    color: "#cbd5e1",
    fontWeight: "500",
    display: "block"
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap"
  };

  // Premium Button Styling with State-Driven Effects
  const buttonStyle = {
    background: isActive 
      ? "#1e293b" // Pressed state: dark flat
      : isHovered 
      ? "linear-gradient(180deg, #475569 0%, #334155 100%)" // Hover state: lighter gradient
      : "linear-gradient(180deg, #334155 0%, #1e293b 100%)", // Default state: subtle gradient
    color: "#f8fafc",
    padding: "14px",
    width: "100%",
    border: "1px solid #475569",
    borderTop: isActive ? "1px solid #475569" : "1px solid #64748b", // Top highlight unless pressed
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "16px",
    fontSize: "15px",
    letterSpacing: "0.5px",
    boxShadow: isActive
      ? "inset 0 2px 4px rgba(0,0,0,0.4)" // Pressed: sinks in
      : isHovered
      ? "0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" // Hover: raises up slightly
      : "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)", // Default: subtle depth
    textShadow: "0 1px 2px rgba(0,0,0,0.4)", // Makes text crisp
    transform: isActive ? "translateY(1px)" : isHovered ? "translateY(-1px)" : "translateY(0)", // Physical movement
    transition: "all 0.15s ease" // Smooth snapping
  };

  return (
    <div style={pageStyle}>
      <div style={contentWrapper}>
        
        {/* Page Header */}
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>Add Transactions</h1>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "16px" }}>
            Log your business transactions manually or import bulk data.
          </p>
        </div>

        {/* 🔹 1. MANUAL ENTRY (Top Focus) */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Manual Entry</h2>
          <p style={sectionDesc}>Enter the details of a single purchase or sale transaction.</p>

          <form onSubmit={handleManualSubmit}>
            
            {/* Row 1: Product, Type, Date */}
            <div style={rowStyle}>
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

            {/* Row 2: Quantity, Cost Price, Selling Price */}
            <div style={rowStyle}>
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

            {/* Row 3: Shipping, Fees */}
            <div style={rowStyle}>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <label style={labelStyle}>Shipping (₹)</label>
                <input type="number" step="0.01" name="shipping" placeholder="0.00" value={formData.shipping} onChange={handleInputChange} style={inputStyle} />
              </div>
              <div style={{ flex: 1, minWidth: "140px" }}>
                <label style={labelStyle}>Additional Fees (₹)</label>
                <input type="number" step="0.01" name="fees" placeholder="0.00" value={formData.fees} onChange={handleInputChange} style={inputStyle} />
              </div>
            </div>

            <button 
              type="submit" 
              style={buttonStyle}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
              onMouseDown={() => setIsActive(true)}
              onMouseUp={() => setIsActive(false)}
            >
              Log Transaction
            </button>
          </form>
        </div>

        {/* 🔹 2. BULK UPLOAD (Below Manual Entry) */}
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Bulk Upload</h2>
          <p style={sectionDesc}>
            Upload a CSV or Excel file to import multiple transactions at once. Ensure your file headers match the required data fields (Product, Type, Quantity, Cost, etc.).
          </p>
          <div style={{ padding: "10px 0" }}>
            <UploadForm setResult={setResult} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default AddTransaction;