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
import DashboardPage from "./features/dashboard/DashboardPage";
import OnboardingPage from "./features/profile/OnboardingPage";
import ProfilePage from "./features/profile/ProfilePage";
import RoundTimerPage from "./features/timer/RoundTimerPage";
import ExerciseLibraryPage from "./features/exercises/ExerciseLibraryPage";
import PlanGeneratorPage from "./features/plans/PlanGeneratorPage";
import CalorieCalculatorPage from "./features/calories/CalorieCalculatorPage";

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
          <Route path="/home" element={<DashboardPage />} />
          <Route path="/welcome-back" element={<WelcomeBackPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<AppShell />}>
            <Route path="/timer" element={<RoundTimerPage />} />
            <Route path="/library" element={<ExerciseLibraryPage />} />
            {/* "/scan" (photo recognition, features/recognition/) is temporarily disabled —
                see the comment in components/BottomNav.tsx for why and how to re-enable. */}
            <Route path="/plans" element={<PlanGeneratorPage />} />
            <Route path="/calories" element={<CalorieCalculatorPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
