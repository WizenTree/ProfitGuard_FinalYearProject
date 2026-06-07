// src/components/SummaryCard.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";

function SummaryCard({ title, value, icon, subtext, color }) {
  const { theme } = useTheme();

  // Map to the theme variables from context (with fallbacks to prevent crashes)
  const cardBg = theme?.cardBg || "#161b26";
  const borderColor = theme?.border || "#262c3a";
  const textColor = theme?.text || "#ffffff";
  const mutedColor = theme?.textMuted || "#9ca3af";
  
  // Use the color prop passed from the Dashboard, fallback to accent
  const highlightColor = color || theme?.accent || "#3b82f6";

  // Formatter to accurately display Indian Rupees
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return val;
  };

  return (
    <div style={{
      background: cardBg,
      padding: "24px",
      borderRadius: "16px",
      border: `1px solid ${borderColor}`,
      // Adds a modern left-side accent stripe based on the specific metric's color
      borderLeft: `4px solid ${highlightColor}`, 
      flex: 1,
      minWidth: "250px", // Prevents cards from crushing too small on mobile
      display: "flex",
      alignItems: "center",
      gap: "20px",
      boxShadow: theme?.shadow || "0 4px 6px rgba(0, 0, 0, 0.05)",
      transition: "transform 0.2s ease"
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      
      {/* Only render the icon block if an icon is actually passed */}
      {icon && (
        <div style={{ 
          // Appends '20' to the hex color to give it a 12% opacity background tint
          background: `${highlightColor}20`, 
          color: highlightColor,
          padding: "16px", 
          borderRadius: "12px",
          fontSize: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "60px",
          minHeight: "60px"
        }}>
          {icon}
        </div>
      )}
      
      <div>
        <p style={{ color: mutedColor, margin: 0, fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          {title}
        </p>
        <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: textColor, fontWeight: "700" }}>
          {formatValue(value)}
        </h3>
        {subtext && (
          <p style={{ 
            color: highlightColor, // Changed subtext to match the highlight color for emphasis
            margin: "6px 0 0 0", 
            fontSize: "13px",
            fontWeight: "600"
          }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;