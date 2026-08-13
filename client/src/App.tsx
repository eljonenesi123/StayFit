import { Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import ScrollToTop from "./components/ScrollToTop";
import RootRedirect from "./features/auth/RootRedirect";
import RequireAuth from "./features/auth/RequireAuth";
import WelcomePage from "./features/auth/WelcomePage";
import AuthChoicePage from "./features/auth/AuthChoicePage";
import SignUpPage from "./features/auth/SignUpPage";
import LoginPage from "./features/auth/LoginPage";
import WelcomeBackPage from "./features/auth/WelcomeBackPage";
import HomePage from "./features/home/HomePage";
import OnboardingPage from "./features/profile/OnboardingPage";
import ProfilePage from "./features/profile/ProfilePage";
import WorkoutsPage from "./features/workouts/WorkoutsPage";
import MealsPage from "./features/meals/MealsPage";
import ProgressPage from "./features/progress/ProgressPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/start" element={<AuthChoicePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/welcome-back" element={<WelcomeBackPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<AppShell />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
