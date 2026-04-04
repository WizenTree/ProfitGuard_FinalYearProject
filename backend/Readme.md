# 🚀 Profit Guard – Backend

## 📌 Overview

The **Profit Guard Backend** is a FastAPI-based system that powers the core functionality of the application. It processes uploaded receipts, extracts meaningful financial data using OCR, performs profit calculations, generates business insights, and stores structured data in MongoDB.

This backend is designed with a **modular and scalable architecture**, making it easy to extend with additional features such as analytics, AI insights, and inventory tracking.

---

## 🎯 What This Backend Does

* 📷 Accepts receipt/image uploads
* 🔍 Extracts text using OCR
* 🧠 Parses unstructured text into structured data
* 💰 Calculates profit and margin
* 💡 Generates smart business suggestions
* 🗄️ Stores all processed data in MongoDB Atlas

---

## 🏗️ Architecture Overview

The backend follows a **layered architecture**:

```
Routes → Services → Utils → Database
```

### 🔹 Routes

Handle API endpoints and request/response flow

### 🔹 Services

Contain business logic like:

* OCR processing
* Parsing
* Profit calculation
* Suggestions

### 🔹 Utils

Helper functions like:

* File handling
* Image preprocessing
* Logging

### 🔹 Models

* Database connection
* Pydantic schemas for validation

---

## 📂 Folder Structure

```
backend/
│
├── app/
│   ├── main.py                # Entry point of FastAPI app
│   ├── config.py             # General configuration
│
│   ├── routes/               # API endpoints
│   │   ├── upload.py         # File upload & processing
│   │   ├── analyze.py        # Analysis endpoints
│   │   └── health.py         # Health check endpoint
│
│   ├── services/             # Business logic
│   │   ├── ocr_service.py
│   │   ├── parser_service.py
│   │   ├── calculation_service.py
│   │   └── suggestion_service.py
│
│   ├── models/
│   │   ├── database.py       # MongoDB connection
│   │   └── schema.py         # Pydantic schemas
│
│   ├── utils/
│   │   ├── file_handler.py   # File saving logic
│   │   ├── image_preprocessing.py
│   │   └── logger.py
│
│   └── core/
│       ├── config.py
│       └── constants.py
│
├── data/                     # File storage
│   ├── uploads/
│   ├── processed/
│   └── samples/
│
├── tests/                    # Unit tests
│
├── requirements.txt
├── Dockerfile
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd profit-guard/backend
```

---

### 2️⃣ Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

---

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Setup Environment Variables

Create a `.env` file:

```
MONGO_URL=your_mongodb_atlas_connection_string
```

⚠️ A person need to create `.env` file and enter the above string.

---

### 5️⃣ Run the server

```bash
uvicorn app.main:app --reload
```

---

### 6️⃣ Open API Docs

```
http://127.0.0.1:8000/docs
```

---

## 🔌 API Endpoints

### 📤 Upload & Analyze

```
POST /upload/
```

**Input:**

* Image file (receipt)

**Output:**

```json
{
  "file_name": "receipt.jpg",
  "raw_text": "...",
  "parsed_data": {
    "product": "Shoes",
    "cost": 1000,
    "selling_price": 1500
  },
  "profit_data": {
    "profit": 500,
    "margin": 50.0
  },
  "suggestions": [
    "Increase price by 5%",
    "Optimize cost"
  ],
  "created_at": "2026-04-04T10:00:00Z"
}
```

---

### ❤️ Health Check

```
GET /health/
```

Used to verify if the backend is running.

---

## 🧠 Core Workflow

```
User Uploads Image
        ↓
File Saved (utils)
        ↓
OCR Extracts Text (ocr_service)
        ↓
Parser Structures Data (parser_service)
        ↓
Profit Calculation (calculation_service)
        ↓
Suggestions Generated (suggestion_service)
        ↓
Stored in MongoDB
        ↓
Response Sent to User
```

---

## 🗄️ Database (MongoDB Atlas)

### Collection: `analyses`

Each document:

```json
{
  "filename": "receipt.jpg",
  "filepath": "...",
  "raw_text": "...",
  "parsed_data": {...},
  "profit_data": {...},
  "suggestions": [...],
  "created_at": "ISODate"
}
```

---

## ⚠️ Important Notes

* OCR may not always extract perfect data
* Parser currently uses rule-based logic
* LLM integration can be added for better accuracy
* Supports images like `.png`, `.jpg`, `.jpeg`
* `.webp` requires additional handling (**Not implemented yet**)

---

## 🚀 Future Improvements

* 🤖 LLM-based intelligent parsing
* 📊 Advanced analytics dashboard
* 📦 Inventory tracking system
* 📱 Mobile support
* 🔐 Authentication system

---

## 👨‍💻 Contributors

* Backend Developer: *WizenTree* 
* Frontend Developer: *Knex3*

---

## 📜 License

This project is for educational purposes.

---

## 💡 Final Note

This backend is designed not just as a project, but as a **foundation for a real-world business intelligence tool** for small vendors and shop owners.

---
