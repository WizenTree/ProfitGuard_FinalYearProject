// frontend/src/pages/TransactionHistory.jsx
import React, { useState, useMemo, useEffect } from "react";
import { getTransactions } from "../services/api";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Client-side Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  // Suggestion Dropdown State
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ✅ FIX 1: Fetch data correctly to handle the { data: [...] } backend structure
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getTransactions();
        setTransactions(response.data || []); 
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Extract unique products for suggestions
  const uniqueProducts = useMemo(() => {
    if (!transactions) return [];
    const products = new Set(transactions.map(tx => tx.display_name || tx.product_name));
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

    // 1. Filter by Type
    if (typeFilter !== "all") {
      result = result.filter(tx => tx.type === typeFilter);
    }

    // 2. Filter by Product Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx => 
        (tx.display_name || tx.product_name || "").toLowerCase().includes(query)
      );
    }

    // 3. Sort by selected column
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
  }, [transactions, searchQuery, typeFilter, sortBy, sortOrder]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="pg-page-container">
      
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Transaction Ledger</h1>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          View, search, and sort your complete history of sales and purchases.
        </p>
      </div>

      {/* ✅ FIX 2: Modular Filter Panel using pg-card and flexbox */}
      <div className="pg-card" style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end" }}>
        
        {/* Search Input with Custom Suggestions Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 250px", position: "relative" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Search Product</label>
          <Input
            type="text"
            placeholder="e.g. Wireless Mouse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          
          {/* Dropdown Menu (Themed correctly) */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: "4px",
              background: "var(--bg-color)", border: "1px solid var(--border-color)",
              borderRadius: "8px", boxShadow: "var(--shadow)", maxHeight: "200px",
              overflowY: "auto", zIndex: 10, padding: "4px 0"
            }}>
              {filteredSuggestions.map((productName, index) => (
                <div 
                  key={index}
                  onClick={() => {
                    setSearchQuery(productName);
                    setShowSuggestions(false);
                  }}
                  style={{
                    padding: "10px 12px", fontSize: "14px", color: "var(--text-color)", cursor: "pointer",
                    borderBottom: index !== filteredSuggestions.length - 1 ? "1px solid var(--border-color)" : "none"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "var(--card-bg)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  {productName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Type Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Type</label>
          <select 
            className="pg-input"
            value={typeFilter} 
            onChange={(e) => {
              const newType = e.target.value;
              setTypeFilter(newType);
              if (newType === "purchase" && (sortBy === "revenue" || sortBy === "profit")) setSortBy("date");
            }} 
          >
            <option value="all">All Types</option>
            <option value="sale">Sales Only</option>
            <option value="purchase">Purchases Only</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 150px" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Sort By</label>
          <select className="pg-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date</option>
            <option value="qty">Quantity</option>
            {typeFilter !== "purchase" && <option value="revenue">Revenue</option>}
            <option value="cost">Cost</option>
            {typeFilter !== "purchase" && <option value="profit">Profit / Loss</option>}
          </select>
        </div>

        {/* Order Filter */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: "1 1 120px" }}>
          <label style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>Order</label>
          <select className="pg-input" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <Button variant="outline" onClick={handleClearFilters} style={{ height: "46px" }}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* ✅ FIX 3: Replaced the old external table component with our modular pg-table */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>Loading transactions...</p>
      ) : (
        <div className="pg-card" style={{ overflowX: "auto" }}>
          {processedTransactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              No transactions match your current filters.
            </div>
          ) : (
            <table className="pg-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Product</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Total Value</th>
                  <th>Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {processedTransactions.map((txn, index) => {
                  const isSale = txn.type === "sale";
                  
                  // Visual UI Badges for Transaction Type
                  const typeBadgeStyle = {
                    display: "inline-block", padding: "4px 10px", borderRadius: "12px",
                    fontSize: "0.85rem", fontWeight: "600", textTransform: "capitalize",
                    background: isSale ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                    color: isSale ? "#10b981" : "#3b82f6"
                  };

                  return (
                    <tr key={index}>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
                        {new Date(txn.created_at).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: "500" }}>{txn.display_name || txn.product_name}</td>
                      <td>
                        <span style={typeBadgeStyle}>{txn.type}</span>
                      </td>
                      <td>{txn.quantity} units</td>
                      <td style={{ fontWeight: "600" }}>
                        ₹{(txn.total_revenue || txn.total_cost || 0).toFixed(2)}
                      </td>
                      <td>
                        {isSale ? (
                          <span style={{ color: "#10b981", fontWeight: "600" }}>
                            + ₹{(txn.profit || 0).toFixed(2)}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
}

export default TransactionHistory;