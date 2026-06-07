// src/components/Layout.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext"; // Import Auth context
import ThemeSwitcher from "./ThemeSwitcher";
import LoginModal from "./LoginModal";

const SidebarItem = ({ icon, label, active, onClick, theme }) => (
  <div 
    onClick={() => onClick(label)}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 20px",
      color: active ? theme.accent : theme.sidebarText,
      background: active ? theme.sidebarActive : "transparent",
      cursor: "pointer",
      borderRadius: "8px",
      margin: "4px 12px",
      transition: "0.2s all"
    }}
  >
    <span>{icon}</span>
    <span style={{ fontWeight: active ? "600" : "400" }}>{label}</span>
  </div>
);

function Layout({ children, activePage, setActivePage }) {
  const { theme } = useTheme(); 
  const { currentUser, logout } = useAuth(); // Get user state
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div style={{ display: "flex", background: theme.bg, minHeight: "100vh", color: theme.text, transition: "background 0.3s ease" }}>
      
      {/* Sidebar */}
      <aside style={{ width: "260px", background: theme.sidebar, borderRight: `1px solid ${theme.border}`, transition: "background 0.3s ease" }}>
        <div style={{ padding: "30px 20px" }}>
          <h2 style={{ color: theme.sidebarText, margin: 0 }}>Profit Guard</h2>
        </div>
        
        {["Dashboard", "Add Transaction", "Transactions History", "Inventory", "Products"].map((page) => (
          <SidebarItem 
            key={page}
            label={page} 
            active={activePage === page} 
            onClick={setActivePage} 
            theme={theme}
          />
        ))}
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ 
          height: "70px", 
          background: theme.cardBg,
          borderBottom: `1px solid ${theme.border}`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          padding: "0 30px",
          transition: "background 0.3s ease"
        }}>
          <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>{activePage}</div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <ThemeSwitcher />
            
            {currentUser ? (
              // SHOW THIS IF LOGGED IN
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: theme.text, fontWeight: "500" }}>
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </span>
                  <img 
                    src={currentUser.photoURL || "https://via.placeholder.com/35"} 
                    alt="profile" 
                    style={{ width: "35px", height: "35px", borderRadius: "50%", border: `2px solid ${theme.accent}` }}
                  />
                </div>
                <button 
                  onClick={logout}
                  style={{
                    background: "transparent", color: theme.red || "#ef4444", 
                    border: `1px solid ${theme.red || "#ef4444"}`, borderRadius: "8px",
                    padding: "6px 12px", cursor: "pointer", fontWeight: "600"
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              // SHOW THIS IF NOT LOGGED IN
              <div 
                onClick={() => setIsLoginOpen(true)}
                style={{ 
                  display: "flex", alignItems: "center", gap: "10px",
                  cursor: "pointer", padding: "6px 12px", borderRadius: "24px",
                  transition: "background 0.2s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = theme.border}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ color: theme.textMuted, fontWeight: "500" }}>Admin Login</span>
                <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: theme.accent }}></div>
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: "0px", overflowY: "auto" }}>
          {children}
        </main>
      </div>

      {/* Render the Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default Layout;