// frontend/src/components/LoginModal.jsx
import React, { useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import Input from "./ui/Input";
import Button from "./ui/Button";

function LoginModal({ isOpen, onClose }) {
  // Notice we no longer need the 'theme' object from ThemeContext
  const { loginWithEmail, registerWithEmail, loginWithGoogle, resetPassword } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        await registerWithEmail(email, password);
        toast.success("Account created successfully!");
      } else {
        await loginWithEmail(email, password);
        toast.success("Logged in successfully!");
      }
      onClose();
    } catch (err) {
      toast.error(err.message || "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.warning("Please type your email address first!");
    setIsLoading(true);
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error("Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      onClose();
    } catch (err) {
      toast.error("Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pg-modal-overlay">
      <div className="pg-modal-content">
        <h2 style={{ color: "var(--text-color)", textAlign: "center", marginBottom: "20px" }}>
          {isSignUp ? "Sign Up" : "Login"}
        </h2>
        
        <form onSubmit={handleEmailAuth} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          
          <div style={{ position: "relative", width: "100%" }}>
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ paddingRight: "60px" }} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "transparent", border: "none", color: "var(--accent-color)", cursor: "pointer",
                fontWeight: "bold", fontSize: "0.85rem"
              }}
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>
          
          {!isSignUp && (
            <div style={{ textAlign: "right", marginTop: "-4px" }}>
              <button type="button" onClick={handleForgotPassword} className="pg-btn-text" style={{ width: "auto", fontSize: "0.85rem" }}>
                Forgot Password?
              </button>
            </div>
          )}
          
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <Button variant="text" onClick={() => setIsSignUp(!isSignUp)} style={{ marginTop: "12px" }}>
          {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
        </Button>

        <div style={{ display: "flex", alignItems: "center", margin: "20px 0", color: "var(--text-muted)" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
          <span style={{ padding: "0 10px", fontSize: "0.9rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-color)" }}></div>
        </div>

        <Button variant="outline" onClick={handleGoogleAuth} style={{ width: "100%" }}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}

export default LoginModal;