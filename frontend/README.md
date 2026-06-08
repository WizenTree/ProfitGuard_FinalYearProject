# 🎨 Profit Guard - React Frontend

The frontend is a sleek, highly responsive Single Page Application (SPA) built with React. It utilizes a custom, modular CSS design system to avoid the bloat of external component libraries while maintaining absolute design consistency.

## 🧩 Architectural Highlights
* **Singleton API Service:** All HTTP requests are routed through an Object-Oriented `ApiService` class that handles Axios interceptors and automatic JWT injection.
* **Modular UI Components:** Buttons, Inputs, and Tables are abstracted into reusable functional components (`<Button />`, `<Input />`).
* **CSS Custom Properties (Variables):** Global theming (Light/Dark mode) is managed natively via CSS variables (`var(--bg-color)`) in `index.css`.
* **Optimistic UI Updates:** Deleting or adding inventory updates the React state instantly without requiring a full page reload.

## 🛠️ Setup & Installation

### 1. Install Dependencies
Ensure you have Node.js installed, then run:
\`\`\`bash
npm install
\`\`\`

### 2. Environment Configuration
Create a `.env` file in the root of the `frontend` folder. You must provide your Firebase configuration and the Backend URL:
\`\`\`env
REACT_APP_API_URL="http://127.0.0.1:8000"

REACT_APP_FIREBASE_API_KEY="your_api_key"
REACT_APP_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
REACT_APP_FIREBASE_PROJECT_ID="your_project_id"
REACT_APP_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID="123456789"
REACT_APP_FIREBASE_APP_ID="1:123456789:web:abcdef"
\`\`\`

### 3. Start the Development Server
\`\`\`bash
npm start
\`\`\`
The application will launch at `http://localhost:3000`.

## 📁 Folder Structure
* `/src/components/`: Reusable UI elements (Modals, Tables, Charts).
* `/src/components/ui/`: Core atomic design components (Button, Input).
* `/src/pages/`: Main application views (Dashboard, Inventory, Ledger).
* `/src/services/`: API configuration and Firebase initialization.
* `/src/context/`: Global state managers (AuthContext, ThemeContext).