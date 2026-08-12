import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "./icons";
import "./BackButton.css";

/** Floating top-left back chevron for screens without their own top bar. Uses router history, not a hardcoded destination. */
export default function BackButton() {
  const navigate = useNavigate();
  return (
    <button type="button" className="back-button" onClick={() => navigate(-1)} aria-label="Back">
      <ChevronLeftIcon width={22} height={22} />
    </button>
  );
}
