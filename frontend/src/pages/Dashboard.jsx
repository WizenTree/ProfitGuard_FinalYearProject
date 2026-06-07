// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import ChartSection from "../components/ChartSection";
import GrowthChart from "../components/GrowthChart"; 
import { getReports } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const { theme } = useTheme();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getReports(period); 
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, [period]);

  // UX Polish: Professional Skeleton Loader
  if (loading && !reports) return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto", animation: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      
      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
        <div style={{ width: "300px", height: "40px", background: theme.cardBg, borderRadius: "8px" }}></div>
        <div style={{ width: "200px", height: "40px", background: theme.cardBg, borderRadius: "20px" }}></div>
      </div>
      
      {/* Cards Skeleton */}
      <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, minWidth: "250px", height: "140px", background: theme.cardBg, borderRadius: "16px", border: `1px solid ${theme.border}` }}></div>
        ))}
      </div>
      
      {/* Chart Skeleton */}
      <div style={{ height: "380px", background: theme.cardBg, borderRadius: "12px", border: `1px solid ${theme.border}` }}></div>
    </div>
  );

  if (!reports) return <div style={{ padding: "40px", color: theme.text, textAlign: "center" }}>No Data Available. Please add some transactions.</div>;

  const chartData = [
    { name: "Revenue", value: reports.total_revenue },
    { name: "Cost", value: reports.total_cost },
    { name: "Profit", value: reports.total_profit }
  ];

  const isProfitable = reports.total_profit >= 0;
  const profitColor = isProfitable ? "#10b981" : "#ef4444"; 
  const profitIcon = isProfitable ? "📈" : "📉";
  const profitTitle = isProfitable ? "Net Profit" : "Net Loss";
  
  const profitMargin = reports.total_revenue > 0 
    ? ((Math.abs(reports.total_profit) / reports.total_revenue) * 100).toFixed(1) 
    : 0;
  const marginText = reports.total_revenue > 0 ? `${profitMargin}% ${isProfitable ? 'Margin' : 'Loss'}` : "0% Margin";

  return (
    <div style={{ padding: "40px", color: theme.text, maxWidth: "1400px", margin: "0 auto", transition: "opacity 0.4s ease-in" }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Dashboard Overview</h1>
          <p style={{ color: theme.textMuted, margin: 0 }}>A top-level view of your business performance.</p>
        </div>
        
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", background: theme.cardBg, padding: "6px 12px", borderRadius: "8px", border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}>
            <label style={{ color: theme.textMuted, fontSize: "14px", fontWeight: "600" }}>Timeline:</label>
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value)}
              style={{ padding: "4px 8px", background: "transparent", color: theme.text, border: "none", outline: "none", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          <div style={{ 
            padding: "8px 16px", borderRadius: "20px", 
            background: isProfitable ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", color: profitColor, fontWeight: "600",
            display: "flex", alignItems: "center", gap: "8px", border: `1px solid ${isProfitable ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`
          }}>
            <span style={{ fontSize: "18px" }}>{isProfitable ? "✅" : "⚠️"}</span>
            {isProfitable ? "Business is Profitable" : "Currently Operating at a Loss"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
        <SummaryCard title="Total Revenue" value={reports.total_revenue} icon="💰" color={theme.accent} />
        <SummaryCard title="Total Cost" value={reports.total_cost} icon="📦" color="#f59e0b" />
        <SummaryCard title={profitTitle} value={Math.abs(reports.total_profit)} icon={profitIcon} subtext={marginText} color={profitColor} />
      </div>

      {reports.growth_data && reports.growth_data.length > 0 && (
        <GrowthChart data={reports.growth_data} theme={theme} />
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px", marginTop: "24px" }}>
        <div style={{ flex: 2, minWidth: 0 }}>
          <ChartSection data={chartData} theme={theme} />
        </div>

        <div style={{ background: theme.cardBg, padding: "24px", borderRadius: "12px", border: `1px solid ${theme.border}`, boxShadow: theme.shadow, display: "flex", flexDirection: "column", flex: 1 }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>⭐</span> Top Selling Products
          </h3>
          <div style={{ flexGrow: 1, overflowY: "auto", paddingRight: "8px" }}>
            {reports.top_products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: theme.textMuted }}>No sales data yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {reports.top_products.map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", background: theme.bg, borderRadius: "8px", border: `1px solid ${theme.border}`, transition: "transform 0.2s ease", cursor: "default" }} onMouseOver={(e) => e.currentTarget.style.transform = "translateX(4px)"} onMouseOut={(e) => e.currentTarget.style.transform = "translateX(0)"}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: theme.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}>{index + 1}</div>
                      <span style={{ fontWeight: "600", fontSize: "15px" }}>{item.product}</span>
                    </div>
                    <span style={{ color: theme.accent, fontWeight: "600", background: `${theme.accent}15`, padding: "4px 10px", borderRadius: "12px", fontSize: "13px" }}>{item.total_quantity} units</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;