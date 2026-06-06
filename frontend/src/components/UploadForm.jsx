import React, { useState, useRef } from "react";
import { uploadFile } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function UploadForm({ setResult }) {
  const { theme } = useTheme();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      setLoading(true);
      const data = await uploadFile(file);
      if (setResult) setResult(data);
      alert("✅ Bulk upload completed");
      
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
      <div style={{
        background: theme.bg, 
        border: `1px dashed ${theme.border}`, 
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center"
      }}>
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv"
          onChange={handleFileChange} 
          style={{ color: theme.text, fontSize: "14px", width: "100%", cursor: "pointer", outline: "none" }}
        />
      </div>

      <button 
        onClick={handleUpload} 
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
          opacity: loading ? 0.7 : 1,
          transition: "opacity 0.2s ease"
        }}
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
    </div>
  );
}

export default UploadForm;