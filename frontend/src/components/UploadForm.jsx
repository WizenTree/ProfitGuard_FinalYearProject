<<<<<<< HEAD
import { useState } from "react";
function UploadForm({ setResult }) {
=======
import { use, useState } from "react";
function UploadForm() {
>>>>>>> 921c7385bcadf21d7bcddcd2ff7ed5f6ecc477b1
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const API = process.env.REACT_APP_API_URL;
    const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    };
    const handleUpload = () => {
        if (!file) {
            alert("Please select a file first");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        fetch(`${API}/upload/`,{
            method: "POST",
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            setResult(data);
        })
        .catch((err) => {
            console.error(err);
        });
    };
    return (
        <div style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            width: "300px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            marginTop: "20px"
                        }}>
            <input type="file" onChange={handleFileChange} />
            <button  onClick={handleUpload}
  style={{
            marginTop: "10px",
            padding: "10px 15px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
        }}> Upload File </button>
        {file && <p>Selected: {file.name}</p>}

        {result &&  (
            <div style = {{marginTop: "20px"}}>
                <h3>Result:</h3>
                <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
        )}
        </div>
    );
}
export default UploadForm;
