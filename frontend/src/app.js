// // src/App.js
// import React, { useState } from "react";
// import Layout from "./components/Layout";
// import Dashboard from "./pages/Dashboard";
// import AddTransaction from "./pages/AddTransaction";
// import TransactionHistory from "./pages/TransactionHistory";

// function App() {
//   // 1. Initialize state to "Dashboard"
//   const [activePage, setActivePage] = useState("Dashboard");
//   const [result, setResult] = useState(null)
//   // 2. Function to determine which component to show
//   const renderPage = () => {
//     switch (activePage) {
//       case "Dashboard":
//         return <Dashboard result={result} />;
//       case "Add Transaction":
//         return <AddTransaction setResult={setResult} />;
//       case "Transactions History":
//         return <TransactionHistory/>
//       case "Inventory":
//         return <div>Inventory Component (Coming Soon)</div>;
//       case "Products":
//         return <div>Products Component (Coming Soon)</div>;
//       default:
//         return <Dashboard />;
//     }
//   };

//   return (
//     <Layout activePage={activePage} setActivePage={setActivePage}>
//       {renderPage()}
//     </Layout>
//   );
// }

// export default App;

import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import Inventory from "./pages/Inventory"; // ✅ Import newly created page
import Products from "./pages/Products";   // ✅ Import newly created page

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [result, setResult] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard result={result} />;
      case "Add Transaction":
        return <AddTransaction setResult={setResult} />;
      case "Transactions History":
        return <TransactionHistory />;
      case "Inventory":
        return <Inventory />; // ✅ Render Inventory page
      case "Products":
        return <Products />;  // ✅ Render Products page
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {renderPage()}
    </Layout>
  );
}

export default App;