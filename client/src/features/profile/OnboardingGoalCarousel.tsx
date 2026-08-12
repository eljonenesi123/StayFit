import { GOAL_OPTIONS, type Goal, type ProfileFormState } from "./types";
import { CoverflowCarousel, type CoverflowSlide } from "../../components/ui/coverflow-carousel";
import buildMuscle from "../../assets/illustrations/goal-build-muscle.svg";
import loseWeight from "../../assets/illustrations/goal-lose-weight.svg";
import improveShape from "../../assets/illustrations/goal-improve-shape.svg";
import stayFit from "../../assets/illustrations/goal-stay-fit.svg";
import endurance from "../../assets/illustrations/goal-endurance.svg";
import flexibility from "../../assets/illustrations/goal-flexibility.svg";

const ILLUSTRATIONS: Record<Goal, string> = {
  build_muscle: buildMuscle,
  lose_weight: loseWeight,
  improve_shape: improveShape,
  stay_fit: stayFit,
  endurance: endurance,
  flexibility: flexibility,
};

const SLIDES: CoverflowSlide[] = GOAL_OPTIONS.map((opt) => ({
  id: opt.value,
  src: ILLUSTRATIONS[opt.value],
  alt: opt.label,
  title: opt.label,
  subtitle: opt.description,
}));

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

export default function OnboardingGoalCarousel({ form, onChange }: Props) {
  const toggleGoal = (id: string | number) => {
    const value = id as Goal;
    const nextGoals = form.goals.includes(value) ? form.goals.filter((g) => g !== value) : [...form.goals, value];
    // `goal` (singular) still drives the Supabase save — the "profiles" table has only one
    // `goal text` column, so the first pick stands in for the whole multi-select set there.
    onChange({ goals: nextGoals, goal: nextGoals[0] ?? null });
  };

  return (
    <div>
      <CoverflowCarousel
        slides={SLIDES}
        cardWidth="clamp(260px, 85vw, 380px)"
        showNavigation
        showPagination
        selectedIds={form.goals}
        onToggleSelect={toggleGoal}
        label="Fitness goal carousel"
      />
      <p className="goal-carousel-hint">Tap a card to select it — pick as many as you like.</p>
    </div>
  );
}
