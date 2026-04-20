import { useState } from "react";
import UploadForm from "./components/UploadForm";

function App() {
  const [result, setResult] = useState(null);
  return (
    <div style={{ display: "flex" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "20px"
      }}>
        <h2>Profit Guard</h2>

        <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>Dashboard</li>
          <li style={{ marginBottom: "10px" }}>Upload</li>
          <li style={{ marginBottom: "10px" }}>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: "20px",
        backgroundColor: "#f3f4f6"
      }}>
        <UploadForm setResult={setResult}/>
        <h1>Dashboard</h1>
        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
  
  <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
    <h4>Profit</h4>
    <h2>{result ? `₹ ${result.profit}` : "₹ 0"}</h2>
  </div>

  <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
    <h4>Revenue</h4>
    <h2>{result ? `₹ ${result.revenue}` : "₹ 0"}</h2>
  </div>

  <div style={{ background: "white", padding: "15px", borderRadius: "8px" }}>
    <h4>Cost</h4>
    <h2>{result ? `₹ ${result.cost}` : "₹ 0"}</h2>
  </div>

</div>
      </div>

    </div>
  );
}


export default App;