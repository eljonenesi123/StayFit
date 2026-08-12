/**
 * Scoped deliberately to just the CoverflowCarousel and its one call site —
 * this project's design system is otherwise plain CSS custom properties
 * (see src/styles/), not Tailwind. Don't widen this glob to the rest of
 * src/ without a decision to migrate more broadly.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: ["./src/components/ui/coverflow-carousel.tsx", "./src/features/profile/OnboardingGoalCarousel.tsx"],
  corePlugins: {
    // Preflight is a global reset (margins, headings, etc.) — would collide
    // with the app's existing hand-rolled base styles in styles/global.css.
    // The scoped stylesheet also only pulls in @tailwind utilities, so this
    // is belt-and-suspenders, not load-bearing on its own.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
