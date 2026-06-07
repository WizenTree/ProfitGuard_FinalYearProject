// frontend/src/components/GrowthChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

function GrowthChart({ data, theme }) {
  const cardBg = theme?.cardBg || "#161b26";
  const borderColor = theme?.border || "#262c3a";
  const textColor = theme?.text || "#ffffff";
  const textMuted = theme?.textMuted || "#9ca3af";
  const profitColor = "#10b981"; // Emerald
  const revenueColor = theme?.accent || "#3b82f6"; // Dynamic Accent

  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000) return `₹${(tickItem / 1000).toFixed(1)}k`;
    return `₹${tickItem}`;
  };

  return (
    <div style={{
      background: cardBg,
      padding: "24px",
      borderRadius: "12px",
      border: `1px solid ${borderColor}`,
      boxShadow: theme?.shadow || 'none',
      marginTop: "24px"
    }}>
      <h3 style={{ color: textColor, marginTop: 0, marginBottom: "20px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>📈</span> Business Growth Trend
      </h3>
      <div style={{ height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={borderColor} vertical={false} strokeDasharray="3 3" />
            
            <XAxis 
              dataKey="date" 
              stroke={textMuted} 
              tick={{ fill: textMuted, fontSize: 13, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            <YAxis 
              stroke={textMuted} 
              tick={{ fill: textMuted, fontSize: 13 }} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={formatYAxis} 
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: cardBg, 
                borderColor: borderColor, 
                borderRadius: "8px", 
                color: textColor, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)" 
              }}
              itemStyle={{ fontWeight: "bold", fontSize: "15px" }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
              cursor={{ stroke: borderColor, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "14px", color: textColor, fontWeight: "500" }} />
            
            {/* Crisp lines with readable dots */}
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Revenue" 
              stroke={revenueColor} 
              strokeWidth={3} 
              dot={{ r: 4, fill: cardBg, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: revenueColor }} 
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Profit" 
              stroke={profitColor} 
              strokeWidth={3} 
              dot={{ r: 4, fill: cardBg, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: profitColor }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GrowthChart;