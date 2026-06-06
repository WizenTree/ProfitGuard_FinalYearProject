# 📈 Profit Guard: AI-Powered Inventory & Profit Management

**Profit Guard** is a final-year project designed to empower small-scale e-commerce sellers on platforms like Shopify and Amazon. It eliminates the manual effort of tracking expenses by combining OCR-based receipt extraction with automated profit analytics.

---

## 🚀 Project Overview

Small sellers often struggle to track hidden platform fees, shipping costs, and fluctuating supplier prices. Profit Guard solves this by providing a streamlined dashboard that visualizes profitability in real-time.

### Key Features

- **Automated Data Entry:** Upload receipt images and use OCR to extract cost data automatically.
- **Smart Dashboard:** Visualize sales trends and profit margins.
- **Profitability Alerts:** Immediate visual cues (Red/Yellow/Green) when products become unprofitable based on dynamic costs.
- **CSV Bulk Processing:** Seamlessly upload and analyze large sales datasets.

---

## 🏗️ Technical Stack

### Frontend
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Charts:** Chart.js / Recharts for data visualization

### Backend
- **Framework:** FastAPI (Python)
- **OCR Engine:** Tesseract OCR
- **Data Processing:** Pandas
- **Database:** MongoDB

---

## 📂 Architecture

The system follows a modular, scalable architecture:

```text
Frontend (React)
        ↕
FastAPI (Backend)
        ↕
MongoDB Atlas
```

---

## ⚙️ Quick Start

### Prerequisites

- Python 3.9+
- Node.js & npm
- MongoDB Atlas Account

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ProfitGuard_FinalYearProject
```

#### 2. Backend Setup

```bash
cd backend

python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate

# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt

# Create a .env file and add:
# MONGO_URL=your_connection_string

uvicorn app.main:app --reload
```

#### 3. Frontend Setup

```bash
cd ../frontend

npm install
npm start
```

---

## 📊 Workflow

1. **Upload** – User uploads a sales CSV or receipt image.
2. **Process** – Backend runs OCR and structured data parsing.
3. **Analyze** – Profit engine calculates real-time margins.
4. **Display** – Interactive dashboard displays insights and loss alerts.

---

## 👥 Project Team

### WizenTree
**Backend & AI/ML Development**

### Knex3
**Frontend & Integration Engineering**

---

## 📜 License

This project was developed for academic purposes as part of a final-year BCA degree.
