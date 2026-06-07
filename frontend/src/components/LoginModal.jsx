import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { toast } from 'react-toastify';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "../services/firebase";

function LoginModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Handles both Email/Password Sign In AND Sign Up
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully!");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handles Google Login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google!");
      onClose();
    } catch (err) {
      toast.error("Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`,
    background: theme.bg, color: theme.text, outline: "none", width: "100%", boxSizing: "border-box"
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: theme.cardBg, padding: "32px", borderRadius: "16px",
        width: "360px", border: `1px solid ${theme.border}`, boxShadow: theme.shadow
      }}>
        <h2 style={{ color: theme.text, textAlign: "center" }}>{isSignUp ? "Sign Up" : "Login"}</h2>
        
        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          
          <button type="submit" disabled={isLoading} style={{ background: theme.accent, color: "#fff", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
            {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>

        <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", width: "100%", marginTop: "10px" }}>
          {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: theme.textMuted }}>
          <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
          <span style={{ padding: "0 10px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
        </div>

        <button onClick={handleGoogleLogin} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, cursor: "pointer" }}>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginModal;