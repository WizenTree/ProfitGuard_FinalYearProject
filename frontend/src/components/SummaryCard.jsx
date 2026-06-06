// src/components/SummaryCard.jsx
import { theme } from "../styles/theme";

function SummaryCard({ title, value, icon, subtext }) {
  return (
    <div style={{
      background: theme.card,
      padding: "24px",
      borderRadius: "16px",
      border: `1px solid ${theme.border}`,
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "20px"
    }}>
      <div style={{ 
        background: "rgba(255,255,255,0.05)", 
        padding: "15px", 
        borderRadius: "12px",
        fontSize: "24px" 
      }}>
        {icon}
      </div>
      <div>
        <p style={{ color: theme.muted, margin: 0, fontSize: "14px" }}>{title}</p>
        <h3 style={{ margin: "5px 0", fontSize: "24px" }}>{value}</h3>
        {subtext && <p style={{ color: theme.muted, margin: 0, fontSize: "12px" }}>{subtext}</p>}
      </div>
    </div>
  );
}

export default SummaryCard;