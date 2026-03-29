import { use, useState } from "react";
function UploadForm() {
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
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}> Upload File </button>
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
