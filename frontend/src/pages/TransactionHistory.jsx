import React, { useState, useMemo } from "react";
import TransactionsTable from "../components/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";
import { useTheme } from "../context/ThemeContext";

function TransactionHistory() {
  const { theme } = useTheme();
  
  // API Filter
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
    const products = new Set(transactions.map(tx => tx.display_name || tx.product));
    return Array.from(products).sort();
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
        (tx.display_name || tx.product).toLowerCase().includes(query)
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

  // Common input styling
  const inputStyle = {
    padding: "8px 12px",
    background: theme.bg,
    color: theme.text,
    border: `1px solid ${theme.border}`,
    borderRadius: "6px",
    outline: "none",
    fontSize: "14px",
    minWidth: "140px"
  };

  return (
    <div style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
        
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "600" }}>Transaction Ledger</h1>
          <p style={{ color: theme.textMuted, margin: 0, fontSize: "16px" }}>
            View, search, and sort your complete history of sales and purchases.
          </p>
        </div>

        {/* Filters Panel */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "16px",
          marginBottom: "20px",
          background: theme.cardBg,
          padding: "20px 24px",
          borderRadius: "12px",
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow
        }}>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
            
            {/* Search Input with Custom Suggestions Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 200px", position: "relative" }}>
              <label style={{ color: theme.textMuted, fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Search Product</label>
              <input
                type="text"
                placeholder="e.g. Wireless Mouse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{ ...inputStyle, width: "100%" }}
              />
              
              {/* Dropdown Menu */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  marginTop: "4px",
                  background: theme.bg,
                  border: `1px solid ${theme.border}`,
                  borderRadius: "6px",
                  boxShadow: theme.shadow,
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 10,
                  padding: "4px 0"
                }}>
                  {filteredSuggestions.map((productName, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setSearchQuery(productName);
                        setShowSuggestions(false);
                      }}
                      style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        color: theme.text,
                        cursor: "pointer",
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
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: theme.textMuted, fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Type</label>
              <select 
                value={typeFilter} 
                onChange={(e) => {
                  const newType = e.target.value;
                  setTypeFilter(newType);
                  // Safeguard: If switching to "purchase" and currently sorted by revenue/profit, reset to "date"
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
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: theme.textMuted, fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{...inputStyle, cursor: "pointer"}}>
                <option value="date">Date</option>
                <option value="qty">Quantity</option>
                {/* Conditionally render Revenue and Profit options */}
                {typeFilter !== "purchase" && <option value="revenue">Revenue</option>}
                <option value="cost">Cost</option>
                {typeFilter !== "purchase" && <option value="profit">Profit / Loss</option>}
              </select>
            </div>

            {/* Order Filter */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ color: theme.textMuted, fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Order</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{...inputStyle, cursor: "pointer", minWidth: "100px"}}>
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div style={{ color: "#ef4444", padding: "10px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "8px", marginBottom: "20px" }}>Error: {error}</div>}

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