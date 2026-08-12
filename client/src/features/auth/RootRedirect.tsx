import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** "/" itself is just a router: logged-in users land on the dashboard, everyone else sees the hero. */
export default function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/home" : "/welcome"} replace />;
}
