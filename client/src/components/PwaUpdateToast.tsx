import { useRegisterSW } from "virtual:pwa-register/react";
import "./PwaUpdateToast.css";

/**
 * Registers the service worker and surfaces a small banner the moment a new
 * version is precached, instead of silently applying it on the next full
 * app launch. Renders nothing in dev (the plugin only injects a real SW in
 * production builds), and nothing once dismissed/updated.
 */
export default function PwaUpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError: (error) => console.error("Service worker registration failed:", error),
  });

  if (!needRefresh) return null;

  return (
    <div className="pwa-update-toast" role="status">
      <span>Update available</span>
      <button type="button" onClick={() => updateServiceWorker(true)}>
        Tap to refresh
      </button>
      <button
        type="button"
        className="pwa-update-toast__dismiss"
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  );
}
