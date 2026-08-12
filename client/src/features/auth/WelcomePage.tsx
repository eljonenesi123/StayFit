import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { useAuth } from "./AuthContext";
import crunchAnimation from "../../assets/animations/elbow-knee-crunch.json";
import "./WelcomePage.css";

export default function WelcomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home", { replace: true });
  }, [user, navigate]);

  return (
    <div className="welcome">
      <div className="welcome__content">
        <div className="welcome__body">
          <div className="welcome__animation-wrap">
            <div className="welcome__blob" aria-hidden="true" />
            <div className="welcome__animation">
              <Lottie animationData={crunchAnimation} loop autoplay />
            </div>
          </div>

          <h1 className="welcome__title">StayFit</h1>
          <p className="welcome__subtext">Your workouts, meals, and progress, all in one app.</p>
        </div>

        <button type="button" className="btn btn-primary welcome__cta" onClick={() => navigate("/start")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
