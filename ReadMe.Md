📈 Profit Guard: AI-Powered Inventory & Profit Management
Profit Guard is a final-year project designed to empower small-scale e-commerce sellers on platforms like Shopify and Amazon. It eliminates the manual effort of tracking expenses by combining OCR-based receipt extraction with automated profit analytics.

🚀 Project Overview
Small sellers often struggle to track hidden platform fees, shipping costs, and fluctuating supplier prices. Profit Guard solves this by providing a streamlined dashboard that visualizes profitability in real-time.

Key Features
Automated Data Entry: Upload receipt images and use OCR to extract cost data automatically.

Smart Dashboard: Visualize sales trends and profit margins.

Profitability Alerts: Immediate visual cues (Red/Yellow/Green) when products become unprofitable based on dynamic costs.

CSV Bulk Processing: Seamlessly upload and analyze large sales datasets.

🏗️ Technical Stack
Frontend
Framework: React.js

Styling: Tailwind CSS

Charts: Chart.js / Recharts for data visualization

Backend
Framework: FastAPI (Python)

OCR Engine: Tesseract

Data Processing: Pandas

Database: MongoDB

📂 Architecture
The system follows a modular, scalable architecture:
Frontend (React) ↔ FastAPI (Backend) ↔ MongoDB (Atlas)

⚙️ Quick Start
Prerequisites
Python 3.9+

Node.js & npm

MongoDB Atlas Account

Setup Instructions
Clone the repository

Bash
git clone <your-repo-url>
cd ProfitGuard_FinalYearProject
Backend Setup

Bash
cd backend
python -m venv venv
# Activate virtual environment (Windows: venv\Scripts\activate)
pip install -r requirements.txt
# Create .env and add MONGO_URL=your_connection_string
uvicorn app.main:app --reload
Frontend Setup

Bash
cd ../frontend
npm install
npm start
📊 Workflow
Upload: User uploads sales CSV or receipt image.

Process: Backend runs OCR and structured data parsing.

Analyze: Profit engine calculates real-time margins.

Display: Interactive dashboard displays insights and loss alerts.

👥 Project Team
WizenTree: Backend & AI/ML Development

Knex3: Frontend & Integration Engineering

📜 License
This project was developed for academic purposes as part of a final-year BCA degree.