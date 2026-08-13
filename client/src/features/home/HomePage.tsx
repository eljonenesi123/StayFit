import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { BellIcon } from "../../components/icons";
import { useProfile } from "../profile/useProfile";
import BmiCard from "./BmiCard";
import TodayWorkoutCard from "./TodayWorkoutCard";
import ActivityStreakStrip from "./ActivityStreakStrip";
import TodayCalorieGlance from "./TodayCalorieGlance";
import loadingMinimalAnim from "../../assets/lottie/loading-minimal.json";
import "./HomePage.css";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading } = useProfile();

  const firstName = user?.is_anonymous ? "Guest" : user?.email ? user.email.split("@")[0] : "there";
  const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <div className="page home-page">
      <div className="home-page__header">
        <button type="button" className="home-page__identity" onClick={() => navigate("/profile")}>
          <span className="eyebrow">Welcome Back,</span>
          <h1 className="home-page__greeting">{displayName}</h1>
        </button>
        <button type="button" className="home-page__bell" aria-label="Notifications">
          <BellIcon width={20} height={20} />
        </button>
      </div>

      {loading ? (
        <div className="home-page__loading">
          <Lottie animationData={loadingMinimalAnim} loop style={{ width: 96, height: 96 }} />
          <p>Loading your dashboard…</p>
        </div>
      ) : (
        <div className="stack">
          <div className="dashboard-card-in" style={{ animationDelay: "0ms" }}>
            <BmiCard />
          </div>
          <div className="dashboard-card-in" style={{ animationDelay: "120ms" }}>
            <TodayWorkoutCard />
          </div>
          <div className="dashboard-card-in" style={{ animationDelay: "240ms" }}>
            <ActivityStreakStrip />
          </div>
          <div className="dashboard-card-in" style={{ animationDelay: "360ms" }}>
            <TodayCalorieGlance />
          </div>
        </div>
      )}
    </div>
  );
}
