import { useState } from "react";
function UploadForm() {
    const [file, setFile] = useState(null);
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
        fetch("http://localhost:8000/upload",{
            method: "POST",
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            alert("File uploaded successfully");
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
        </div>
    );
}
export default UploadForm;
