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
  const primaryColor = theme?.blue || "#3b82f6"; 

  return (
    <div style={{
      background: cardBg,
      padding: "24px",
      borderRadius: "12px",
      marginTop: "24px",
      border: `1px solid ${borderColor}`,
      boxShadow: theme?.shadow || 'none'
    }}>
      <h3 style={{ color: textColor, marginTop: 0, marginBottom: "20px" }}>
        Financial Overview
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          {/* Made the grid lines subtle and removed vertical lines for a cleaner look */}
          <CartesianGrid stroke={borderColor} vertical={false} strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="name" 
            stroke={textMuted} 
            tick={{ fill: textMuted, fontSize: 14 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={textMuted} 
            tick={{ fill: textMuted, fontSize: 14 }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`} // Optional: formats Y-axis with a currency symbol
          />
          
          {/* Customizing the tooltip so it doesn't default to a bright white box */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: cardBg, 
              borderColor: borderColor, 
              borderRadius: "8px",
              color: textColor 
            }}
            itemStyle={{ color: primaryColor, fontWeight: "bold" }}
            cursor={{ fill: borderColor, opacity: 0.4 }}
          />
          
          {/* Added a border radius to the top of the bars for modern styling */}
          <Bar dataKey="value" fill={primaryColor} radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartSection;