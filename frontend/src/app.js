import UploadForm from "./components/UploadForm";

function App() {
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
        <UploadForm />
        <h1>Dashboard</h1>
      </div>

    </div>
  );
}


export default App;