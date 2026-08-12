import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import progressIllustration from "../../assets/illustrations/goal-progress.svg";
import "./WelcomeBackPage.css";

export default function WelcomeBackPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.email ? user.email.split("@")[0] : "";
  const heading = firstName ? `Welcome, ${firstName}` : "Welcome Back";

  return (
    <div className="welcome-back">
      <div className="welcome-back__illustration-wrap">
        <div className="welcome-back__blob" aria-hidden="true" />
        <img className="welcome-back__illustration" src={progressIllustration} alt="" />
      </div>

      <h1 className="welcome-back__title">{heading}</h1>
      <p className="welcome-back__subtext">You&rsquo;re all set. Let&rsquo;s reach your goals together.</p>

      <button type="button" className="welcome-back__cta" onClick={() => navigate("/home", { replace: true })}>
        Go To Home
      </button>
    </div>
  );
}
