import { GENDER_OPTIONS, type ProfileFormState } from "./types";
import { PersonIcon, ChevronDownIcon, CalendarIcon, ScaleIcon, RulerIcon } from "../../components/icons";
import "./OnboardingProfileFields.css";

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

function ageFromDateOfBirth(dateOfBirth: string): string {
  const dob = new Date(dateOfBirth);
  if (Number.isNaN(dob.getTime())) return "";
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age >= 0 ? String(age) : "";
}

export default function OnboardingProfileFields({ form, onChange }: Props) {
  return (
    <div className="pill-fields">
      <div className="pill-field">
        <span className="pill-field__icon">
          <PersonIcon width={20} height={20} />
        </span>
        <select
          className="pill-field__control"
          data-empty={!form.gender}
          value={form.gender ?? ""}
          onChange={(e) => onChange({ gender: (e.target.value || null) as ProfileFormState["gender"] })}
        >
          <option value="" disabled>
            Choose Gender
          </option>
          {GENDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pill-field__chevron">
          <ChevronDownIcon width={18} height={18} />
        </span>
      </div>

      <div className="pill-field">
        <span className="pill-field__icon">
          <CalendarIcon width={20} height={20} />
        </span>
        <input
          type="date"
          className="pill-field__control"
          aria-label="Date of Birth"
          value={form.dateOfBirth}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => onChange({ dateOfBirth: e.target.value, age: ageFromDateOfBirth(e.target.value) })}
        />
      </div>

      <div className="pill-field">
        <span className="pill-field__icon">
          <ScaleIcon width={20} height={20} />
        </span>
        <input
          type="number"
          inputMode="numeric"
          className="pill-field__control"
          placeholder="Your Weight"
          value={form.weight}
          onChange={(e) => onChange({ weight: e.target.value })}
        />
        <button
          type="button"
          className="pill-field__unit"
          onClick={() => onChange({ weightUnit: form.weightUnit === "kg" ? "lb" : "kg" })}
        >
          {form.weightUnit.toUpperCase()}
        </button>
      </div>

      <div className="pill-field">
        <span className="pill-field__icon">
          <RulerIcon width={20} height={20} />
        </span>
        {form.heightUnit === "cm" ? (
          <input
            type="number"
            inputMode="numeric"
            className="pill-field__control"
            placeholder="Your Height"
            value={form.heightCm}
            onChange={(e) => onChange({ heightCm: e.target.value })}
          />
        ) : (
          <div className="pill-field__control pill-field__ftin">
            <input
              type="number"
              inputMode="numeric"
              placeholder="ft"
              aria-label="Feet"
              value={form.heightFt}
              onChange={(e) => onChange({ heightFt: e.target.value })}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder="in"
              aria-label="Inches"
              value={form.heightIn}
              onChange={(e) => onChange({ heightIn: e.target.value })}
            />
          </div>
        )}
        <button
          type="button"
          className="pill-field__unit"
          onClick={() => onChange({ heightUnit: form.heightUnit === "cm" ? "ftin" : "cm" })}
        >
          {form.heightUnit === "cm" ? "CM" : "FT/IN"}
        </button>
      </div>
    </div>
  );
}
