import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import WeightCard from "./WeightCard";
import CalorieRing from "./CalorieRing";
import ShortcutCards from "./ShortcutCards";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.is_anonymous ? "Guest" : user?.email ? user.email.split("@")[0] : "there";

  const handleLogOut = async () => {
    await logOut();
    navigate("/welcome", { replace: true });
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-page__header">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1 className="dashboard-page__greeting">Hi, {firstName}</h1>
        </div>
        <div className="dashboard-page__actions">
          <button type="button" className="btn btn-ghost dashboard-page__profile" onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button type="button" className="btn btn-ghost dashboard-page__logout" onClick={handleLogOut}>
            Log out
          </button>
        </div>
      </div>

      <div className="stack">
        <WeightCard />
        <CalorieRing />
        <ShortcutCards />
      </div>
    </div>
  );
}
