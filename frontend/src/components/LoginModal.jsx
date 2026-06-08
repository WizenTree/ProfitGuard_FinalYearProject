// frontend/src/components/LoginModal.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { toast } from 'react-toastify';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail // ✅ Imported the reset function
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
      let errorMessage = "Authentication failed.";
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Try logging in or resetting your password.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errorMessage = "Invalid credentials. If you used Google previously, click 'Forgot Password' to set an email login.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "Your password is too weak. It must be at least 6 characters long.";
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handles Password Reset for Google accounts wanting manual login
  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning("Please type your email address in the box first!");
      return;
    }
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your inbox to set a manual password.");
    } catch (err) {
      toast.error(err.message || "Failed to send reset email.");
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
      if (err.code === 'auth/popup-closed-by-user') {
        toast.info("Google login cancelled.");
      } else {
        toast.error("Google login failed.");
      }
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
        <h2 style={{ color: theme.text, textAlign: "center", marginBottom: "20px" }}>
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        
        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={inputStyle} 
            required 
          />
          
          <div style={{ position: "relative", width: "100%" }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ ...inputStyle, paddingRight: "60px" }} 
              required 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", color: theme.accent, cursor: "pointer",
                fontWeight: "bold", fontSize: "0.85rem"
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          
          {/* ✅ Forgot Password Button */}
          {!isSignUp && (
            <div style={{ textAlign: "right" }}>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: "0.85rem" }}
              >
                Forgot Password?
              </button>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading} 
            style={{ 
              background: theme.accent, color: "#fff", padding: "12px", 
              borderRadius: "8px", border: "none", cursor: "pointer", 
              marginTop: "4px", fontWeight: "bold" 
            }}
          >
            {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
          </button>
        </form>

        <button 
          type="button" 
          onClick={() => setIsSignUp(!isSignUp)} 
          style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", width: "100%", marginTop: "12px" }}
        >
          {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
        </button>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: theme.textMuted }}>
          <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
          <span style={{ padding: "0 10px", fontSize: "0.9rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          style={{ 
            width: "100%", padding: "12px", borderRadius: "8px", 
            border: `1px solid ${theme.border}`, background: theme.bg, 
            color: theme.text, cursor: "pointer", fontWeight: "bold",
            display: "flex", justifyContent: "center", alignItems: "center", gap: "8px"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginModal;