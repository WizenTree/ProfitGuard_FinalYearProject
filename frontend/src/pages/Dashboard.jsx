import React, { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import ChartSection from "../components/ChartSection";
import { getReports } from "../services/api";

function Dashboard() {
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

  if (loading) {
    return <h2 style={{ color: "white", padding: "20px" }}>Loading...</h2>;
  }

  if (!reports) {
    return <h2 style={{ color: "white", padding: "20px" }}>No Data</h2>;
  }

  // 📊 Chart Data
  const chartData = [
    { name: "Revenue", value: reports.total_revenue },
    { name: "Cost", value: reports.total_cost },
    { name: "Profit", value: reports.total_profit }
  ];

  return (
    <div style={{
      background: "#111827",
      minHeight: "100vh",
      color: "white",
      padding: "20px"
    }}>
      <h1>Profit Guard Dashboard</h1>

      {/* 🔹 Summary Cards */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px",
        flexWrap: "wrap"
      }}>
        <SummaryCard title="Total Profit" value={reports.total_profit} color="#10b981" />
        <SummaryCard title="Total Revenue" value={reports.total_revenue} color="#3b82f6" />
        <SummaryCard title="Total Cost" value={reports.total_cost} color="#ef4444" />
      </div>

      {/* 📈 Chart */}
      <ChartSection data={chartData} />

      {/* 🏆 Top Products */}
      <div style={{
        background: "#1f2937",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px"
      }}>
        <h3 style={{ marginBottom: "15px" }}>Top Selling Products</h3>

        {reports.top_products.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No sales yet</p>
        ) : (
          reports.top_products.map((item, index) => (
            <div key={index} style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid #374151"
            }}>
              <span>{item.product}</span>
              <span>{item.total_quantity}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;