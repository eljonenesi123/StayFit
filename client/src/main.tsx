import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/global.css";
import App from "./App";
import { AuthProvider } from "./features/auth/AuthContext";
import PwaUpdateToast from "./components/PwaUpdateToast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
      <PwaUpdateToast />
    </BrowserRouter>
  </StrictMode>
);
