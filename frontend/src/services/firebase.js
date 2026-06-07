// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCf2FNOozBeoyRFZsLizRN1GvwnqmXkWt0",
  authDomain: "profit-guard-bdf2d.firebaseapp.com",
  projectId: "profit-guard-bdf2d",
  storageBucket: "profit-guard-bdf2d.appspot.com", // Usually formatted like this
  messagingSenderId: "367178229281",               // Extracted from your appId
  appId: "1:367178229281:web:e47f4c66cdf6a92a1fe560",
  measurementId: "G-QZYKC3T5GQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Export the sign-in functions so LoginModal can use them
export { signInWithPopup, signInWithEmailAndPassword };