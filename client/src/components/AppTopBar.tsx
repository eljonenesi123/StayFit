import { useNavigate } from "react-router-dom";
import "./AppTopBar.css";

/** Shown on the 5 feature sections — the way back to the dashboard, since bottom nav only covers those 5. */
export default function AppTopBar() {
  const navigate = useNavigate();

  return (
    <header className="app-top-bar">
      <button type="button" className="app-top-bar__home" onClick={() => navigate("/home")} aria-label="Back to dashboard">
        <img
          src={`${import.meta.env.BASE_URL}stayfit-logo-64.png`}
          alt=""
          width="26"
          height="26"
          className="app-top-bar__logo"
        />
        <span>StayFit</span>
      </button>
    </header>
  );
}
