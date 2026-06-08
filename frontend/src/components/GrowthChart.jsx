// frontend/src/components/GrowthChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

function GrowthChart({ data, theme }) {
  const cardBg = theme?.cardBg || "#161b26";
  const borderColor = theme?.border || "#262c3a";
  const textColor = theme?.text || "#ffffff";
  const textMuted = theme?.textMuted || "#9ca3af";
  
  // ✅ FIX 2: Distinct High-Contrast Colors
  const profitColor = "#10b981"; // Emerald Green
  const revenueColor = "#8b5cf6"; // Vivid Violet (Highly distinct from Green)

  // Formats large numbers cleanly (e.g., ₹15.5k)
  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return "₹0";
    if (tickItem >= 1000) return `₹${(tickItem / 1000).toFixed(1)}k`;
    return `₹${tickItem}`;
  };

  // ✅ FIX 1: Smart Date Formatter for Daily & Weekly Views
  const formatXAxis = (tickItem) => {
    if (!tickItem) return "";

    // Handle Daily format (YYYY-MM-DD) -> "May 12"
    if (tickItem.length === 10 && tickItem.includes("-")) {
      const date = new Date(tickItem);
      // Adding a safe fallback in case of invalid date parsing
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
    
    // Handle Weekly format (YYYY-Wxx) -> "Week 12"
    if (tickItem.includes("-W")) {
      const parts = tickItem.split("-W");
      return `Week ${parts[1]}`;
    }
    
    // Handle Monthly format (YYYY-MM) -> "May '26"
    if (tickItem.length === 7 && tickItem.includes("-")) {
      const date = new Date(tickItem + "-01");
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      }
    }
    
    // Fallback for Yearly format (YYYY)
    return tickItem;
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
      <div style={{ height: "340px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={borderColor} vertical={false} strokeDasharray="3 3" />
            
            <XAxis 
              dataKey="date" 
              stroke={textMuted} 
              tick={{ fill: textMuted, fontSize: 13, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
              tickFormatter={formatXAxis} // ✅ Added Formatter
              minTickGap={30}             // ✅ Prevents Daily/Weekly labels from overlapping
            />
            
            <YAxis 
              stroke={textMuted} 
              tick={{ fill: textMuted, fontSize: 13 }} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={formatYAxis} 
              domain={[0, 'auto']}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: cardBg, 
                borderColor: borderColor, 
                borderRadius: "8px", 
                color: textColor, 
                boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                border: `1px solid ${borderColor}`
              }}
              itemStyle={{ fontWeight: "600", fontSize: "15px", padding: "4px 0" }}
              labelStyle={{ color: textMuted, marginBottom: "8px", fontSize: "14px", fontWeight: "bold" }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`]}
              labelFormatter={(label) => formatXAxis(label)} // ✅ Formats the hover tooltip date nicely
              cursor={{ stroke: borderColor, strokeWidth: 1, strokeDasharray: "4 4" }}
              animationDuration={200}
            />
            
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "14px", color: textColor, fontWeight: "500" }} />
            
            <Line 
              type="monotone" 
              dataKey="revenue" 
              name="Gross Revenue" 
              stroke={revenueColor} 
              strokeWidth={3} 
              dot={{ r: 4, fill: cardBg, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: revenueColor, style: { filter: `drop-shadow(0px 0px 4px ${revenueColor})` } }} 
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              name="Net Profit" 
              stroke={profitColor} 
              strokeWidth={3} 
              dot={{ r: 4, fill: cardBg, strokeWidth: 2 }} 
              activeDot={{ r: 6, strokeWidth: 0, fill: profitColor, style: { filter: `drop-shadow(0px 0px 4px ${profitColor})` } }} 
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default GrowthChart;