import { Outlet, useLocation } from "react-router-dom";
import AppTopBar from "./AppTopBar";
import BottomNav from "./BottomNav";
import "./AppShell.css";

/**
 * Layout for the 5 bottom-nav tabs: top bar + routed page + bottom tab nav.
 * Home is the landing tab and already has its own bespoke header — the
 * back-chevron in AppTopBar doesn't belong there, so it's suppressed only
 * on that one route.
 */
export default function AppShell() {
  const location = useLocation();
  const showTopBar = location.pathname !== "/home";

  return (
    <>
      {showTopBar && <AppTopBar />}
      <div className={`app-shell__content${showTopBar ? "" : " app-shell__content--no-topbar"}`}>
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}
