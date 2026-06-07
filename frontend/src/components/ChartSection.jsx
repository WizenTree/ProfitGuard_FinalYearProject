import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function ChartSection({ data, theme }) {
  // Use optional chaining with fallbacks just in case the theme hasn't loaded yet
  const cardBg = theme?.cardBg || "#161b26";
  const borderColor = theme?.border || "#262c3a";
  const textColor = theme?.text || "#ffffff";
  const textMuted = theme?.textMuted || "#9ca3af";
  const primaryColor = theme?.accent || "#3b82f6"; 

  // Clean formatting for chart numbers
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000) {
      return `₹${(tickItem / 1000).toFixed(1)}k`; // Shortens 10,000 to ₹10.0k
    }
    return `₹${tickItem}`;
  };

  return (
    <div style={{
      background: cardBg,
      padding: "24px",
      borderRadius: "12px",
      border: `1px solid ${borderColor}`,
      boxShadow: theme?.shadow || 'none',
      height: "100%",
      display: "flex",
      flexDirection: "column"
    }}>
      <h3 style={{ color: textColor, marginTop: 0, marginBottom: "20px", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>📊</span> Financial Overview
      </h3>

      <div style={{ flexGrow: 1, minHeight: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            {/* Made the grid lines subtle and removed vertical lines for a cleaner look */}
            <CartesianGrid stroke={borderColor} vertical={false} strokeDasharray="3 3" />
            
            <XAxis 
              dataKey="name" 
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
              itemStyle={{ color: primaryColor, fontWeight: "bold", fontSize: "15px" }}
              cursor={{ fill: borderColor, opacity: 0.3 }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
            />
            
            <Bar 
              dataKey="value" 
              fill={primaryColor} 
              radius={[6, 6, 0, 0]} 
              barSize={45} 
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartSection;