import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import { createTransaction, deleteAllData } from "../services/api"; 
import { useTheme } from "../context/ThemeContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  
  // Danger Zone States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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

      // Replaced alert with smooth toast popup
      toast.success("✅ Transaction Added Successfully!");
      setFormData({ ...formData, product: "", selling_price: "", cost_price: "", shipping: "", fees: "" });
    } catch (error) {
      console.error(error);
      // Replaced alert with smooth error toast
      toast.error("❌ Error: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (deleteInput !== "DELETE") return;
    
    try {
      setIsDeleting(true);
      await deleteAllData();
      // Replaced alert with smooth toast popup
      toast.success("✅ All transactions and inventory data have been permanently deleted.");
      setShowDeleteConfirm(false);
      setDeleteInput("");
    } catch (error) {
      console.error(error);
      // Replaced alert with smooth error toast
      toast.error("❌ Failed to delete data: " + (error.response?.data?.detail || error.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // Fixed card style
  const cardStyle = {
    background: theme.cardBg,
    padding: "28px", 
    borderRadius: "12px",
    border: `1px solid ${theme.border}`, 
    boxShadow: theme.shadow
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    marginTop: "6px",
    borderRadius: "6px",
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
    fontWeight: "600",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px"
  };

  const thStyle = { padding: "10px 14px", borderBottom: `1px solid ${theme.border}`, color: theme.textMuted, fontWeight: "600", fontSize: "13px" };
  const tdStyle = { padding: "10px 14px", borderBottom: `1px solid ${theme.border}`, fontSize: "13px" };

  return (
    <div style={{ 
      background: theme.bg, 
      minHeight: "100%", 
      boxSizing: "border-box",
      color: theme.text, 
      padding: "32px 40px",
      transition: "all 0.3s ease"
    }}>
      <div style={{ width: "100%", maxWidth: "1500px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "30px", fontWeight: "600" }}>Data Entry Center</h1>
          <p style={{ color: theme.textMuted, margin: 0, fontSize: "16px" }}>
            Add new transactions, upload bulk spreadsheets, or manage your database.
          </p>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
          gap: "32px",
          alignItems: "start" 
        }}>

          {/* QUADRANT 1: UPPER LEFT - Manual Entry Form */}
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>✍️ Manual Entry</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, margin: "0 0 24px 0" }}>Enter the details of a single purchase or sale transaction.</p>

            <form onSubmit={handleManualSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 2 }}>
                    <label style={labelStyle}>Product Name</label>
                    <input name="product" placeholder="e.g. Wireless Mouse" value={formData.product} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Type</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} style={inputStyle}>
                      <option value="sale">Sale</option>
                      <option value="purchase">Purchase</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Quantity</label>
                    <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleInputChange} style={inputStyle} required />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Cost Price (₹)</label>
                    <input type="number" step="0.01" name="cost_price" placeholder="0.00" value={formData.cost_price} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Selling Price (₹)</label>
                    <input type="number" step="0.01" name="selling_price" placeholder="0.00" value={formData.selling_price} onChange={handleInputChange} style={inputStyle} />
                  </div>
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
                  fontSize: "15px",
                  marginTop: "24px",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s ease"
                }}
              >
                {loading ? "Processing..." : "Log Transaction"}
              </button>
            </form>
          </div>

          {/* QUADRANT 2: UPPER RIGHT - Format Guide */}
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>📄 Format Guide</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, margin: "0 0 20px 0" }}>Your spreadsheet must contain these exact headers to process correctly.</p>
            
            <div style={{ overflowX: "auto", border: `1px solid ${theme.border}`, borderRadius: "8px", background: theme.bg, marginBottom: "20px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", whiteSpace: "nowrap" }}>
                <thead>
                  <tr style={{ background: theme.cardBg }}>
                    {['product', 'type', 'date', 'quantity', 'cost_price', 'selling_price', 'shipping'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{...tdStyle, fontWeight: "500"}}>Gaming Mouse</td>
                    <td style={tdStyle}>purchase</td>
                    <td style={tdStyle}>2026-04-10</td>
                    <td style={tdStyle}>50</td>
                    <td style={tdStyle}>1200.00</td>
                    <td style={tdStyle}>0</td>
                    <td style={tdStyle}>150.00</td>
                  </tr>
                  <tr>
                    <td style={{...tdStyle, fontWeight: "500"}}>Gaming Mouse</td>
                    <td style={tdStyle}>sale</td>
                    <td style={tdStyle}>2026-04-12</td>
                    <td style={tdStyle}>2</td>
                    <td style={tdStyle}>0</td>
                    <td style={tdStyle}>2499.00</td>
                    <td style={tdStyle}>50.00</td>
                  </tr>
                  <tr>
                    <td style={{...tdStyle, fontWeight: "500"}}>Mech Keyboard</td>
                    <td style={tdStyle}>purchase</td>
                    <td style={tdStyle}>2026-04-15</td>
                    <td style={tdStyle}>20</td>
                    <td style={tdStyle}>3500.00</td>
                    <td style={tdStyle}>0</td>
                    <td style={tdStyle}>200.00</td>
                  </tr>
                  <tr>
                    <td style={{...tdStyle, fontWeight: "500"}}>Gaming Mouse</td>
                    <td style={tdStyle}>sale</td>
                    <td style={tdStyle}>2026-04-16</td>
                    <td style={tdStyle}>1</td>
                    <td style={tdStyle}>0</td>
                    <td style={tdStyle}>2499.00</td>
                    <td style={tdStyle}>25.00</td>
                  </tr>
                  <tr>
                    <td style={{...tdStyle, fontWeight: "500"}}>Mech Keyboard</td>
                    <td style={tdStyle}>sale</td>
                    <td style={tdStyle}>2026-04-20</td>
                    <td style={tdStyle}>5</td>
                    <td style={tdStyle}>0</td>
                    <td style={tdStyle}>5500.00</td>
                    <td style={tdStyle}>100.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style={{ background: `${theme.accent}15`, padding: "16px", borderRadius: "8px", border: `1px solid ${theme.accent}30` }}>
              <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: theme.text, lineHeight: "1.6" }}>
                <li>Price fields can be blank; they default to <strong>0</strong>.</li>
                <li>Purchases add to stock, sales subtract from stock.</li>
              </ul>
            </div>
          </div>

          {/* QUADRANT 3: BOTTOM LEFT - Bulk Upload */}
          <div style={cardStyle}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>📁 Bulk Upload</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, margin: "0 0 24px 0" }}>
              Upload a .csv or .xlsx file to import multiple transactions at once.
            </p>
            <div>
              <UploadForm setResult={setResult} />
            </div>
          </div>

          {/* QUADRANT 4: BOTTOM RIGHT - Danger Zone */}
          <div style={{ ...cardStyle, border: "1px solid #ef4444" }}>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px", color: "#ef4444" }}>⚠️ Danger Zone</h2>
            <p style={{ fontSize: "14px", color: theme.textMuted, margin: "0 0 24px 0" }}>
              Permanently delete all your transactions and inventory data. This action cannot be undone.
            </p>

            <div>
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    background: "transparent",
                    color: "#ef4444",
                    border: "1px solid #ef4444",
                    padding: "14px",
                    width: "100%",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "15px",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  Clear All Data
                </button>
              ) : (
                <div style={{ background: "rgba(239, 68, 68, 0.05)", padding: "20px", borderRadius: "8px", border: "1px dashed #ef4444" }}>
                  <p style={{ color: theme.text, fontSize: "14px", margin: "0 0 16px 0", fontWeight: "500" }}>
                    Are you sure? Type <strong>DELETE</strong> below.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input 
                      type="text" 
                      placeholder="Type DELETE" 
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      style={{ ...inputStyle, marginTop: 0 }}
                    />
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button 
                        onClick={handleDeleteAll}
                        disabled={isDeleting || deleteInput !== "DELETE"}
                        style={{
                          background: deleteInput === "DELETE" ? "#ef4444" : theme.border,
                          color: deleteInput === "DELETE" ? "#ffffff" : theme.textMuted,
                          padding: "12px",
                          flex: 1,
                          border: "none",
                          borderRadius: "6px",
                          cursor: deleteInput === "DELETE" ? "pointer" : "not-allowed",
                          fontWeight: "600",
                          fontSize: "14px",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {isDeleting ? "Deleting..." : "Confirm"}
                      </button>
                      <button 
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteInput("");
                        }}
                        style={{
                          background: "transparent",
                          color: theme.text,
                          border: `1px solid ${theme.border}`,
                          padding: "12px",
                          flex: 1,
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "14px"
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddTransaction;