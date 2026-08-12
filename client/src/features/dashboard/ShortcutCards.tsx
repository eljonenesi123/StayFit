import { useNavigate } from "react-router-dom";
import { TimerIcon, CalorieIcon } from "../../components/icons";
import "./ShortcutCards.css";

export default function ShortcutCards() {
  const navigate = useNavigate();

  return (
    <div className="shortcut-cards">
      <button type="button" className="shortcut-card shortcut-card--workouts" onClick={() => navigate("/timer")}>
        <TimerIcon width={28} height={28} />
        <span className="shortcut-card__title">Workouts</span>
        <span className="shortcut-card__hint">Round timer &amp; exercise library</span>
      </button>
      <button type="button" className="shortcut-card shortcut-card--meals" onClick={() => navigate("/calories")}>
        <CalorieIcon width={28} height={28} />
        <span className="shortcut-card__title">Meals</span>
        <span className="shortcut-card__hint">Plans &amp; calorie log</span>
      </button>
    </div>
  );
}
