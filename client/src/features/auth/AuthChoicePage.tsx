import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import BackButton from "../../components/BackButton";
import "./AuthChoicePage.css";

export default function AuthChoicePage() {
  const { user, continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  const handleGuest = async () => {
    setError("");
    setSubmitting(true);
    try {
      await continueAsGuest();
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-choice">
      <BackButton />
      <div className="auth-choice__mark">
        <img src={`${import.meta.env.BASE_URL}stayfit-logo-256.png`} alt="StayFit" width="72" height="72" />
      </div>

      <h1 className="auth-choice__title">Let's get started</h1>
      <p className="auth-choice__subtext">Create an account to save your progress, or jump straight in.</p>

      {error && <div className="auth-form__error auth-choice__error">{error}</div>}

      <div className="auth-choice__actions">
        <button type="button" className="btn btn-primary auth-choice__signup" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        <button type="button" className="btn btn-secondary auth-choice__login" onClick={() => navigate("/login")}>
          Log In
        </button>
        <button type="button" className="auth-choice__guest" onClick={handleGuest} disabled={submitting}>
          {submitting ? "Continuing…" : "Continue as Guest"}
        </button>
      </div>
    </div>
  );
}
