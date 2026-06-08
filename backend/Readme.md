# ⚙️ Profit Guard - FastAPI Backend

The backend of Profit Guard is powered by **FastAPI** and **MongoDB**. It is built using a strict **Service Layer Pattern (OOP)** to completely separate HTTP routing from database business logic.

## 🏗️ Architecture
* **`app/routes/`**: The Controller layer. Handles HTTP requests, dependency injection, and JWT token validation.
* **`app/services/`**: The Business Logic layer. Object-Oriented classes (e.g., `InventoryService`) that execute core logic without knowing about HTTP.
* **`app/models/`**: Pydantic schemas for data validation and the MongoDB database connection manager.
* **`app/core/`**: Security (`auth.py`) and environment configuration (`config.py`).

## 🛠️ Setup & Installation

### 1. Virtual Environment
It is highly recommended to use a virtual environment.
\`\`\`bash
python -m venv profitGuardvenv
source profitGuardvenv/Scripts/activate  # On Windows PowerShell
\`\`\`

### 2. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root of the `backend` folder and add your MongoDB connection string:
\`\`\`env
MONGO_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority"
MONGO_DB_NAME="profit_guard_db"
\`\`\`

### 4. Firebase Admin SDK
For route protection, download your `firebase-adminsdk.json` service account key from the Firebase Console and place it in the root of the `backend` folder.

### 5. Run the Server
\`\`\`bash
uvicorn app.main:app --reload
\`\`\`
* The API will be available at `http://127.0.0.1:8000`.
* Interactive API Documentation (Swagger UI) is automatically generated at `http://127.0.0.1:8000/docs`.