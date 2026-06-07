import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import ChartSection from "../components/ChartSection";
import { getReports } from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const { theme } = useTheme();
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ padding: "20px", color: theme.text }}>Loading...</h2>;
  if (!reports) return <h2 style={{ padding: "20px", color: theme.text }}>No Data</h2>;

  const chartData = [
    { name: "Revenue", value: reports.total_revenue },
    { name: "Cost", value: reports.total_cost },
    { name: "Profit", value: reports.total_profit }
  ];

  return (
    <div style={{ padding: "30px", color: theme.text }}>
      <h1 style={{ marginTop: 0 }}>Dashboard Overview</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px", flexWrap: "wrap" }}>
        {/* Using theme.accent for consistency */}
        <SummaryCard title="Total Profit" value={reports.total_profit} color={theme.accent} />
        {/* Using theme values instead of hardcoded colors */}
        <SummaryCard title="Total Revenue" value={reports.total_revenue} color={theme.accent} /> 
        <SummaryCard title="Total Cost" value={reports.total_cost} color={theme.textMuted} />
      </div>

      <ChartSection data={chartData} theme={theme} />

      <div style={{
        background: theme.cardBg,
        padding: "24px",
        borderRadius: "12px",
        marginTop: "24px",
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow
      }}>
        <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Top Selling Products</h3>

        {reports.top_products.length === 0 ? (
          <p style={{ color: theme.textMuted }}>No sales yet</p>
        ) : (
          reports.top_products.map((item, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: `1px solid ${theme.border}`
            }}>
              <span style={{ fontWeight: "500" }}>{item.product}</span>
              <span style={{ color: theme.textMuted }}>{item.total_quantity} units</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;