import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import BackButton from "../../components/BackButton";
import { EnvelopeIcon, LockIcon, EyeIcon, EyeOffIcon, LoginIcon, GoogleIcon, FacebookIcon } from "../../components/icons";
import "./LoginPage.css";

export default function LoginPage() {
  const { logIn, resetPassword, logInWithProvider } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim() || !password) return setError("Enter your email and password.");

    setSubmitting(true);
    try {
      await logIn(email, password);
      navigate("/welcome-back", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setNotice("");
    if (!email.trim()) return setError("Enter your email first, then tap “Forgot your password?” again.");
    try {
      await resetPassword(email);
      setNotice("Check your email for a password reset link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleProvider = async (provider: "google" | "facebook") => {
    setError("");
    setNotice("");
    try {
      await logInWithProvider(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <div className="login-page">
      <BackButton />

      <div className="login-page__header">
        <span className="login-page__greeting-sub">Hey there,</span>
        <h1 className="login-page__greeting-main">Welcome Back</h1>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        {error && <div className="auth-form__error">{error}</div>}
        {notice && <div className="login-page__notice">{notice}</div>}

        <div className="login-field">
          <span className="login-field__icon">
            <EnvelopeIcon width={20} height={20} />
          </span>
          <input
            type="email"
            className="login-field__control"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="login-field">
          <span className="login-field__icon">
            <LockIcon width={20} height={20} />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            className="login-field__control"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login-field__eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOffIcon width={20} height={20} /> : <EyeIcon width={20} height={20} />}
          </button>
        </div>

        <button type="button" className="login-page__forgot" onClick={handleForgotPassword}>
          Forgot your password?
        </button>

        <button type="submit" className="login-page__submit" disabled={submitting}>
          <LoginIcon width={20} height={20} />
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <div className="login-page__divider">
        <span>Or</span>
      </div>

      <div className="login-page__social">
        <button type="button" className="login-page__social-btn" onClick={() => handleProvider("google")} aria-label="Continue with Google">
          <GoogleIcon />
        </button>
        <button
          type="button"
          className="login-page__social-btn"
          onClick={() => handleProvider("facebook")}
          aria-label="Continue with Facebook"
        >
          <FacebookIcon />
        </button>
      </div>

      <div className="login-page__register">
        Don&rsquo;t have an account yet? <button type="button" onClick={() => navigate("/signup")}>Register</button>
      </div>
    </div>
  );
}
