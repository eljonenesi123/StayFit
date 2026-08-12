import { Outlet } from "react-router-dom";
import AppTopBar from "./AppTopBar";
import BottomNav from "./BottomNav";
import "./AppShell.css";

/** Layout for the 5 feature sections: top bar (back to dashboard) + routed page + bottom tab nav. */
export default function AppShell() {
  return (
    <>
      <AppTopBar />
      <div className="app-shell__content">
        <Outlet />
      </div>
      <BottomNav />
    </>
  );
}
