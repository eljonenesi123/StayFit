import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "./icons";
import "./AppTopBar.css";

/** Shown on the 5 feature sections: back chevron (router history) + brand mark. */
export default function AppTopBar() {
  const navigate = useNavigate();

  return (
    <header className="app-top-bar">
      <button type="button" className="app-top-bar__back" onClick={() => navigate(-1)} aria-label="Back">
        <ChevronLeftIcon width={22} height={22} />
      </button>
      <span className="app-top-bar__brand">
        <img
          src={`${import.meta.env.BASE_URL}stayfit-logo-64.png`}
          alt=""
          width="26"
          height="26"
          className="app-top-bar__logo"
        />
        <span>StayFit</span>
      </span>
    </header>
  );
}
