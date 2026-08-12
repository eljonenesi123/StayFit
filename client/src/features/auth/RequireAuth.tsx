import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Gates the 5 feature sections + dashboard behind the (mock) session. */
export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/welcome" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
