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

  // Quick formatter to make numbers look like currency (e.g., 10000 -> $10,000)
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return `$${val.toLocaleString()}`;
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
      display: "flex",
      alignItems: "center",
      gap: "20px",
      boxShadow: theme?.shadow || "0 4px 6px rgba(0, 0, 0, 0.05)"
    }}>
      
      {/* Only render the icon block if an icon is actually passed */}
      {icon && (
        <div style={{ 
          // Appends '20' to the hex color to give it a 12% opacity background tint
          background: `${highlightColor}20`, 
          color: highlightColor,
          padding: "16px", 
          borderRadius: "12px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </div>
      )}
      
      <div>
        <p style={{ color: mutedColor, margin: 0, fontSize: "14px", fontWeight: "500" }}>
          {title}
        </p>
        <h3 style={{ margin: "8px 0 0 0", fontSize: "28px", color: textColor, fontWeight: "600" }}>
          {formatValue(value)}
        </h3>
        {subtext && (
          <p style={{ color: mutedColor, margin: "4px 0 0 0", fontSize: "12px" }}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

export default SummaryCard;