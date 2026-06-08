// frontend/src/App.js
import React, { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import Inventory from "./pages/Inventory"; 
import Products from "./pages/Products";   

// ✅ 1. Import ToastContainer and its CSS
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        return <Inventory />; 
      case "Products":
        return <Products />;  
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      {/* ✅ 2. Add ToastContainer so alerts become visible */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {renderPage()}
      </Layout>
    </>
  );
}

export default App;