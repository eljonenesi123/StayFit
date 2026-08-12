import { GENDER_OPTIONS, type ProfileFormState } from "./types";

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

export default function AgeGenderFields({ form, onChange }: Props) {
  return (
    <div className="stack">
      <div className="field">
        <label htmlFor="age">Age</label>
        <input
          id="age"
          type="number"
          inputMode="numeric"
          placeholder="28"
          value={form.age}
          onChange={(e) => onChange({ age: e.target.value })}
        />
      </div>

      <div className="field">
        <label>Gender</label>
        <span className="hint">Optional — helps make calorie estimates more accurate.</span>
        <div className="profile-fields__chips">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="chip"
              data-active={form.gender === opt.value}
              onClick={() => onChange({ gender: form.gender === opt.value ? null : opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
