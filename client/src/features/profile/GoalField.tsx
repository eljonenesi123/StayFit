import { GOAL_OPTIONS, type ProfileFormState } from "./types";

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

export default function GoalField({ form, onChange }: Props) {
  return (
    <div className="field">
      <label>Fitness goal</label>
      <div className="profile-fields__goal-grid">
        {GOAL_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            className="profile-fields__goal-card"
            data-active={form.goal === opt.value}
            onClick={() => onChange({ goal: opt.value })}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
