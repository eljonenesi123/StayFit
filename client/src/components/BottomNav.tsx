import { NavLink } from "react-router-dom";
import { TimerIcon, LibraryIcon, PlanIcon, CalorieIcon } from "./icons";
import "./BottomNav.css";

// "Scan" (photo exercise recognition) is temporarily pulled from the nav —
// it runs on the paid Anthropic API and the user doesn't want that cost
// live right now. The route and RecognitionPage are untouched; re-add a
// { to: "/scan", label: "Scan", icon: ScanIcon, end: false } entry (and the
// ScanIcon import) to bring it back.
const tabs = [
  { to: "/timer", label: "Timer", icon: TimerIcon, end: true },
  { to: "/library", label: "Library", icon: LibraryIcon, end: false },
  { to: "/plans", label: "Plans", icon: PlanIcon, end: false },
  { to: "/calories", label: "Calories", icon: CalorieIcon, end: false },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => "bottom-nav__item" + (isActive ? " is-active" : "")}
        >
          <Icon className="bottom-nav__icon" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
