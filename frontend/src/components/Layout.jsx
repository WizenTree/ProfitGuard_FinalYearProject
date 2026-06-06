// src/components/Layout.jsx
import { theme } from "../styles/theme";

// Add onClick and active props to SidebarItem
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={() => onClick(label)} // Trigger the page change
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 20px",
      color: active ? theme.accent : theme.muted,
      background: active ? "rgba(234, 179, 8, 0.1)" : "transparent",
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
  return (
    <div style={{ display: "flex", background: theme.bg, minHeight: "100vh", color: "white" }}>
      {/* Sidebar */}
      <aside style={{ width: "260px", background: theme.sidebar, borderRight: `1px solid ${theme.border}` }}>
        <div style={{ padding: "30px 20px" }}>
          <h2 style={{ color: theme.accent, display: "flex", alignItems: "center", gap: "10px" }}>
             Profit Guard
          </h2>
        </div>
        
        {/* Pass active state and click handler to each item */}
        <SidebarItem 
          label="Dashboard" 
          active={activePage === "Dashboard"} 
          onClick={setActivePage} 
        />
        <SidebarItem 
          label="Add Transaction" 
          active={activePage === "Add Transaction"} 
          onClick={setActivePage} 
        />
        <SidebarItem 
          label="Transactions History" 
          active={activePage === "Transactions History"} 
          onClick={setActivePage} 
        />
        <SidebarItem 
          label="Inventory" 
          active={activePage === "Inventory"} 
          onClick={setActivePage} 
        />
        <SidebarItem 
          label="Products" 
          active={activePage === "Products"} 
          onClick={setActivePage} 
        />
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{ 
          height: "70px", 
          borderBottom: `1px solid ${theme.border}`, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          padding: "0 30px" 
        }}>
          <div style={{ fontWeight: "600", fontSize: "1.1rem" }}>{activePage}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ color: theme.muted }}>User</span>
            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: theme.accent }}></div>
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