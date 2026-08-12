import type { ProfileFormState } from "./types";

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

export default function HeightWeightFields({ form, onChange }: Props) {
  return (
    <div className="stack">
      <div className="field">
        <label>Height</label>
        <div className="segmented profile-fields__unit-toggle">
          <button type="button" data-active={form.heightUnit === "cm"} onClick={() => onChange({ heightUnit: "cm" })}>
            cm
          </button>
          <button type="button" data-active={form.heightUnit === "ftin"} onClick={() => onChange({ heightUnit: "ftin" })}>
            ft / in
          </button>
        </div>

        {form.heightUnit === "cm" ? (
          <input
            type="number"
            inputMode="numeric"
            placeholder="170"
            value={form.heightCm}
            onChange={(e) => onChange({ heightCm: e.target.value })}
          />
        ) : (
          <div className="profile-fields__row">
            <input
              type="number"
              inputMode="numeric"
              placeholder="5"
              aria-label="Feet"
              value={form.heightFt}
              onChange={(e) => onChange({ heightFt: e.target.value })}
            />
            <span className="profile-fields__row-unit">ft</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="7"
              aria-label="Inches"
              value={form.heightIn}
              onChange={(e) => onChange({ heightIn: e.target.value })}
            />
            <span className="profile-fields__row-unit">in</span>
          </div>
        )}
      </div>

      <div className="field">
        <label>Weight</label>
        <div className="segmented profile-fields__unit-toggle">
          <button type="button" data-active={form.weightUnit === "kg"} onClick={() => onChange({ weightUnit: "kg" })}>
            kg
          </button>
          <button type="button" data-active={form.weightUnit === "lb"} onClick={() => onChange({ weightUnit: "lb" })}>
            lb
          </button>
        </div>
        <input
          type="number"
          inputMode="numeric"
          placeholder={form.weightUnit === "kg" ? "70" : "154"}
          value={form.weight}
          onChange={(e) => onChange({ weight: e.target.value })}
        />
      </div>
    </div>
  );
}
