import React from "react";
import { useTheme } from "../context/ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";

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
  const { theme } = useTheme(); // Consuming our global theme

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
            <ThemeSwitcher /> {/* Modularity in action */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ color: theme.textMuted, fontWeight: "500" }}>Admin</span>
              <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: theme.accent }}></div>
            </div>
          </div>
        </header>

        <main style={{ padding: "0px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;