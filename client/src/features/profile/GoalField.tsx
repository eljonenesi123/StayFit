import { GOAL_OPTIONS, type Goal, type ProfileFormState } from "./types";
import { CheckIcon } from "../../components/icons";
import buildMuscle from "../../assets/illustrations/goal-build-muscle.svg";
import stayFit from "../../assets/illustrations/goal-stay-fit.svg";
import improveShape from "../../assets/illustrations/goal-improve-shape.svg";
import endurance from "../../assets/illustrations/goal-endurance.svg";

const ILLUSTRATIONS: Record<Goal, string> = {
  build_muscle: buildMuscle,
  stay_fit: stayFit,
  improve_shape: improveShape,
  endurance: endurance,
};

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

export default function GoalField({ form, onChange }: Props) {
  return (
    <div className="field">
      <label>Fitness goal</label>
      <div className="profile-fields__goal-list">
        {GOAL_OPTIONS.map((opt) => {
          const active = form.goal === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className="profile-fields__goal-card"
              data-active={active}
              onClick={() => onChange({ goal: opt.value })}
            >
              {active && (
                <span className="profile-fields__goal-check">
                  <CheckIcon width={14} height={14} />
                </span>
              )}
              <span className="profile-fields__goal-illustration">
                <img src={ILLUSTRATIONS[opt.value]} alt="" />
              </span>
              <span className="profile-fields__goal-title">{opt.label}</span>
              <span className="profile-fields__goal-desc">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
