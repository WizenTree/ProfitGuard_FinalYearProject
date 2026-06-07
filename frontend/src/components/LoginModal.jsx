// src/components/LoginModal.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink 
} from "../services/firebase";

function LoginModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // New success message state
  const [isLoading, setIsLoading] = useState(false);

  // Intercept the URL to check if the user clicked the OTP link from their email
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let savedEmail = window.localStorage.getItem("emailForSignIn");
      
      // If opened on a different device/browser, prompt for email verification
      if (!savedEmail) {
        savedEmail = window.prompt("Please provide your email for confirmation");
      }
      
      if (savedEmail) {
        setIsLoading(true);
        signInWithEmailLink(auth, savedEmail, window.location.href)
          .then((result) => {
            window.localStorage.removeItem("emailForSignIn");
            // Clean up the URL parameters
            window.history.replaceState(null, "", window.location.pathname);
            if (onClose) onClose();
          })
          .catch((err) => {
            setError("Verification link expired or is invalid. Please try again.");
            console.error(err);
          })
          .finally(() => setIsLoading(false));
      }
    }
  }, [onClose]);

  if (!isOpen) return null;

  // Send the verification link
  const handleEmailOTP = async (e) => {
    e.preventDefault();
    if (isLoading) return; 
    
    setError("");
    setMessage("");
    setIsLoading(true);

    const actionCodeSettings = {
      // The URL to redirect back to. Ensure your domain is whitelisted in Firebase.
      url: window.location.href, 
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("Verification link sent! Check your email inbox to log in.");
    } catch (err) {
      setError("Failed to send verification link. Check your email format.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault(); 
    if (isLoading) return; 
    
    setError("");
    setMessage("");
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign-in popup was closed.");
      } else {
        setError("Google sign-in failed. Please try again.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}>
      <div style={{
        background: theme.cardBg, padding: "32px", borderRadius: "16px",
        width: "360px", border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow, position: "relative"
      }}>
        <button 
          onClick={onClose} 
          disabled={isLoading}
          style={{
            position: "absolute", top: "12px", right: "16px",
            background: "none", border: "none", color: theme.textMuted,
            fontSize: "24px", cursor: isLoading ? "not-allowed" : "pointer", padding: "4px"
          }}
        >
          &times;
        </button>

        <h2 style={{ color: theme.text, marginTop: 0, textAlign: "center", marginBottom: "24px" }}>
          Admin Login
        </h2>

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", 
            padding: "10px", borderRadius: "8px", marginBottom: "16px",
            fontSize: "14px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.3)"
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ 
            background: "rgba(16, 185, 129, 0.1)", color: "#059669", 
            padding: "10px", borderRadius: "8px", marginBottom: "16px",
            fontSize: "14px", textAlign: "center", border: "1px solid rgba(16, 185, 129, 0.3)"
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleEmailOTP} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || message} // Disable if message is sent
            style={{
              padding: "12px", borderRadius: "8px", border: `1px solid ${theme.border}`,
              background: theme.bg, color: theme.text, outline: "none",
              opacity: isLoading ? 0.6 : 1
            }}
            required
          />
          <button type="submit" disabled={isLoading || message} style={{
            background: theme.accent, color: "#fff", padding: "12px",
            borderRadius: "8px", border: "none", cursor: (isLoading || message) ? "not-allowed" : "pointer", 
            fontWeight: "600", fontSize: "16px", marginTop: "8px",
            opacity: (isLoading || message) ? 0.7 : 1
          }}>
            {isLoading ? "Processing..." : message ? "Link Sent" : "Send Verification Link"}
          </button>
        </form>

        <div style={{ 
          display: "flex", alignItems: "center", margin: "20px 0", color: theme.textMuted, fontSize: "14px" 
        }}>
          <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
          <span style={{ padding: "0 10px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: theme.border }}></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          style={{
            width: "100%", padding: "12px", borderRadius: "8px",
            border: `1px solid ${theme.border}`, background: "transparent",
            color: theme.text, cursor: isLoading ? "wait" : "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: "10px", 
            fontWeight: "600", fontSize: "16px", opacity: isLoading ? 0.7 : 1
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {isLoading ? "Please wait..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}

export default LoginModal;