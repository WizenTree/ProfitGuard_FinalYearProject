// frontend/src/pages/TransactionHistory.jsx
import React, { useState, useMemo } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";
import { useTheme } from "../context/ThemeContext";

function TransactionHistory() {
  const { theme } = useTheme();
  
  // API Filter using the custom hook (Fixes the data fetching bug)
  const [typeFilter, setTypeFilter] = useState("");
  const { transactions, loading, error } = useTransactions(typeFilter);

  // Client-side Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Suggestion Dropdown State
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Extract unique products for suggestions
  const uniqueProducts = useMemo(() => {
    if (!transactions) return [];
    const products = new Set(transactions.map(tx => tx.display_name || tx.product_name || tx.product));
    return Array.from(products).filter(Boolean).sort();
  }, [transactions]);

  // Filter suggestions based on what the user types
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return uniqueProducts;
    const query = searchQuery.toLowerCase();
    return uniqueProducts.filter(p => p.toLowerCase().includes(query));
  }, [searchQuery, uniqueProducts]);

  // Process data instantly on the frontend whenever filters change
  const processedTransactions = useMemo(() => {
    if (!transactions) return [];
    
    let result = [...transactions];

    // 1. Filter by Product Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx => 
        (tx.display_name || tx.product_name || tx.product || "").toLowerCase().includes(query)
      );
    }

    // 2. Sort by selected column
    result.sort((a, b) => {
      let valA, valB;
      
      switch (sortBy) {
        case "qty":
          valA = a.quantity || 0;
          valB = b.quantity || 0;
          break;
        case "revenue":
          valA = a.total_revenue || 0;
          valB = b.total_revenue || 0;
          break;
        case "cost":
          valA = a.total_cost || 0;
          valB = b.total_cost || 0;
          break;
        case "profit":
          valA = a.profit || 0;
          valB = b.profit || 0;
          break;
        case "date":
        default:
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
          break;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, searchQuery, sortBy, sortOrder]);

  // --- MATCHING UI STYLES FROM ADD TRANSACTION PAGE ---
  const cardStyle = {
    background: theme.cardBg,
    padding: "28px", 
    borderRadius: "12px",
    border: `1px solid ${theme.border}`, 
    boxShadow: theme.shadow,
    marginBottom: "28px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    marginTop: "6px",
    borderRadius: "6px",
    border: `1px solid ${theme.border}`,
    background: theme.bg, 
    color: theme.text,
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s ease"
  };

  const labelStyle = {
    fontSize: "13px",
    color: theme.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "4px"
  };

  return (
    <div style={{ 
      background: theme.bg, 
      minHeight: "100vh", 
      boxSizing: "border-box",
      color: theme.text, 
      padding: "32px 40px",
      transition: "all 0.3s ease"
    }}>
      <div style={{ width: "100%", maxWidth: "1500px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 6px 0", fontSize: "30px", fontWeight: "600" }}>Transaction Ledger</h1>
          <p style={{ color: theme.textMuted, margin: 0, fontSize: "16px" }}>
            View, search, and sort your complete history of sales and purchases.
          </p>
        </div>

        {/* Filters Panel (Styled exactly like AddTransaction cards) */}
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>🎛️ Data Filters</h2>
          <p style={{ fontSize: "14px", color: theme.textMuted, margin: "0 0 24px 0" }}>
            Refine your view to find specific transaction records.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            
            {/* Search Input with Custom Suggestions Dropdown */}
            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Search Product</label>
              <input
                type="text"
                placeholder="e.g. Wireless Mouse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={inputStyle}
              />
              
              {/* Dropdown Menu */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px",
                  background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: "6px",
                  boxShadow: theme.shadow, maxHeight: "200px", overflowY: "auto", zIndex: 10, padding: "4px 0"
                }}>
                  {filteredSuggestions.map((productName, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setSearchQuery(productName);
                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: "8px 12px", fontSize: "14px", color: theme.text, cursor: "pointer",
                        borderBottom: index !== filteredSuggestions.length - 1 ? `1px solid ${theme.border}` : 'none'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = theme.cardBg}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {productName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Transaction Type Filter */}
            <div>
              <label style={labelStyle}>Transaction Type</label>
              <select 
                value={typeFilter} 
                onChange={(e) => {
                  const newType = e.target.value;
                  setTypeFilter(newType);
                  if (newType === "purchase" && (sortBy === "revenue" || sortBy === "profit")) {
                    setSortBy("date");
                  }
                }} 
                style={{...inputStyle, cursor: "pointer"}}
              >
                <option value="">All Types</option>
                <option value="sale">Sales Only</option>
                <option value="purchase">Purchases Only</option>
              </select>
            </div>

            {/* Sort By Filter */}
            <div>
              <label style={labelStyle}>Sort By Metric</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{...inputStyle, cursor: "pointer"}}>
                <option value="date">Date</option>
                <option value="qty">Quantity</option>
                {typeFilter !== "purchase" && <option value="revenue">Revenue</option>}
                <option value="cost">Cost</option>
                {typeFilter !== "purchase" && <option value="profit">Profit / Loss</option>}
              </select>
            </div>

            {/* Order Filter */}
            <div>
              <label style={labelStyle}>Sort Order</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{...inputStyle, cursor: "pointer"}}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div style={{ color: "#ef4444", padding: "16px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", marginBottom: "20px", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Modular Table Component */}
        {loading && transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted }}>
            Fetching database records...
          </div>
        ) : (
          <TransactionsTable transactions={processedTransactions} />
        )}

      </div>
    </div>
  );
}

export default TransactionHistory;