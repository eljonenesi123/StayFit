import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./AuthChoicePage.css";

export default function AuthChoicePage() {
  const { user, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  const handleGuest = () => {
    continueAsGuest();
    navigate("/home", { replace: true });
  };

  return (
    <div className="auth-choice">
      <div className="auth-choice__mark">
        <img src="/stayfit-logo-256.png" alt="StayFit" width="72" height="72" />
      </div>

      <h1 className="auth-choice__title">Let's get started</h1>
      <p className="auth-choice__subtext">Create an account to save your progress, or jump straight in.</p>

      <div className="auth-choice__actions">
        <button type="button" className="btn btn-primary auth-choice__signup" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        <button type="button" className="btn btn-secondary auth-choice__login" onClick={() => navigate("/login")}>
          Log In
        </button>
        <button type="button" className="auth-choice__guest" onClick={handleGuest}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
