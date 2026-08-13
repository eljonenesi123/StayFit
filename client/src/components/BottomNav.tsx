import { NavLink } from "react-router-dom";
import { HomeIcon, LibraryIcon, CalorieIcon, ScaleIcon, PersonIcon } from "./icons";
import "./BottomNav.css";

// "Scan" (photo exercise recognition) is pulled from the nav — it runs on
// the paid Anthropic API and the user doesn't want that cost live right
// now. The route and RecognitionPage are untouched; re-add a
// { to: "/workouts", state: { segment: "library" }... } style entry (see
// RecognitionPage.tsx's own "View in library" button for the pattern) to
// bring it back as, e.g., a Workouts sub-action.
const tabs = [
  { to: "/home", label: "Home", icon: HomeIcon, end: true },
  { to: "/workouts", label: "Workouts", icon: LibraryIcon, end: false },
  { to: "/meals", label: "Meals", icon: CalorieIcon, end: false },
  { to: "/progress", label: "Progress", icon: ScaleIcon, end: false },
  { to: "/profile", label: "Profile", icon: PersonIcon, end: false },
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
