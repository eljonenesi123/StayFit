import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import WeightCard from "./WeightCard";
import CalorieRing from "./CalorieRing";
import ShortcutCards from "./ShortcutCards";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name.split(" ")[0] || "there";

  const handleLogOut = () => {
    logOut();
    navigate("/welcome", { replace: true });
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-page__header">
        <div>
          <span className="eyebrow">Welcome back</span>
          <h1 className="dashboard-page__greeting">Hi, {firstName}</h1>
        </div>
        <button type="button" className="btn btn-ghost dashboard-page__logout" onClick={handleLogOut}>
          Log out
        </button>
      </div>

      <div className="stack">
        <WeightCard />
        <CalorieRing />
        <ShortcutCards />
      </div>
    </div>
  );
}
