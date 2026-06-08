import React from "react";

export default function Button({ 
  children, 
  variant = "primary", 
  type = "button", 
  isLoading, 
  ...props 
}) {
  // Selects the CSS class based on the variant prop
  const variantClass = {
    primary: "pg-btn-primary",
    outline: "pg-btn-outline",
    text: "pg-btn-text"
  }[variant];

  return (
    <button 
      type={type} 
      className={`pg-btn ${variantClass}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
}