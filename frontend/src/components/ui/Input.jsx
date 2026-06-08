import React from "react";

export default function Input({ type = "text", ...props }) {
  return (
    <input 
      type={type} 
      className="pg-input" 
      {...props} 
    />
  );
}