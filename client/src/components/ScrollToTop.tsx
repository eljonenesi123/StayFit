import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on client-side navigation the
 * way a full page load does — without this, navigating from partway down a
 * long page (e.g. the dashboard) into a new route lands mid-scroll instead
 * of at the top.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
