import React, { useState, useRef } from "react";
import { uploadFile } from "../services/api";

function UploadForm({ setResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // State for professional button interactions
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    console.log("Selected:", selected);
    setFile(selected);
  };

  const handleUpload = async () => {
    console.log("FILE BEFORE UPLOAD:", file);

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      setLoading(true);

      const data = await uploadFile(file);
      console.log("API RESPONSE:", data);

      if (setResult) {
        setResult(data);
      }

      alert("✅ Bulk upload completed");

      // Resetting file state and input value using your ref
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
      setIsActive(false); // Ensure button doesn't stay stuck in active state
    }
  };

  // Premium UI Styles
  const containerStyle = {
    background: "transparent", // Lets the parent card background show through
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  };

  const inputContainerStyle = {
    background: "#0f172a", // Deep slate inset
    border: "1px dashed #475569", // Indicates a drop/upload zone
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    transition: "border-color 0.2s ease"
  };

  const inputStyle = {
    color: "#cbd5e1",
    fontSize: "14px",
    width: "100%",
    cursor: "pointer",
    outline: "none"
  };

  // Premium Button Styling matching AddTransaction
  const buttonStyle = {
    background: isActive || loading 
      ? "#1e293b" // Pressed or loading state
      : isHovered 
      ? "linear-gradient(180deg, #475569 0%, #334155 100%)" 
      : "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
    color: loading ? "#94a3b8" : "#f8fafc", // Dim text if loading
    padding: "14px",
    width: "100%",
    border: "1px solid #475569",
    borderTop: isActive || loading ? "1px solid #475569" : "1px solid #64748b",
    borderRadius: "8px",
    cursor: loading ? "not-allowed" : "pointer",
    fontWeight: "600",
    fontSize: "15px",
    letterSpacing: "0.5px",
    boxShadow: isActive || loading
      ? "inset 0 2px 4px rgba(0,0,0,0.4)" // Pressed/Loading: sinks in
      : isHovered
      ? "0 4px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)" 
      : "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
    transform: (isActive || loading) ? "translateY(1px)" : isHovered ? "translateY(-1px)" : "translateY(0)",
    transition: "all 0.15s ease"
  };

  return (
    <div style={containerStyle}>
      <div 
        style={inputContainerStyle}
        onMouseOver={(e) => e.currentTarget.style.borderColor = "#64748b"}
        onMouseOut={(e) => e.currentTarget.style.borderColor = "#475569"}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv"
          onChange={handleFileChange} 
          style={inputStyle}
        />
      </div>

      <button 
        onClick={handleUpload} 
        style={buttonStyle} 
        disabled={loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}

export default UploadForm;