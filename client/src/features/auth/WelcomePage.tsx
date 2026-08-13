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
            <svg className="welcome__blob" viewBox="0 0 200 200" aria-hidden="true">
              <path
                fill="#FBE8DD"
                d="M49.6,-65.1C65,-57,78.8,-43.5,84.1,-27.3C89.4,-11.1,86.2,7.9,77.9,22.8C69.6,37.6,56.1,48.2,42.3,59.2C28.5,70.3,14.2,81.9,0.3,81.5C-13.7,81.2,-27.5,68.9,-39.3,57.2C-51.1,45.5,-61.1,34.3,-69.7,19.8C-78.3,5.3,-85.6,-12.4,-80.7,-25.8C-75.8,-39.2,-58.7,-48.3,-43.3,-56.4C-27.8,-64.5,-13.9,-71.6,1.6,-73.8C17.1,-76,34.1,-73.2,49.6,-65.1Z"
                transform="translate(100 100)"
              />
            </svg>
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
