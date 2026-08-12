import type { Profile, ProfileFormState } from "./types";

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.45359237;

export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * CM_PER_IN;
}

export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalIn = cm / CM_PER_IN;
  const ft = Math.floor(totalIn / 12);
  return { ft, in: Math.round(totalIn - ft * 12) };
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

/** Resolves the form's current height entry (whichever unit is active) to cm, or null if incomplete. */
export function resolveHeightCm(form: ProfileFormState): number | null {
  if (form.heightUnit === "cm") {
    const cm = Number(form.heightCm);
    return form.heightCm.trim() && Number.isFinite(cm) ? cm : null;
  }
  const ft = Number(form.heightFt) || 0;
  const inches = Number(form.heightIn) || 0;
  if (!form.heightFt.trim() && !form.heightIn.trim()) return null;
  return ftInToCm(ft, inches);
}

/** Resolves the form's current weight entry (whichever unit is active) to kg, or null if incomplete. */
export function resolveWeightKg(form: ProfileFormState): number | null {
  const value = Number(form.weight);
  if (!form.weight.trim() || !Number.isFinite(value)) return null;
  return form.weightUnit === "lb" ? lbToKg(value) : value;
}

/** Fills a form's display fields (both unit variants) from a saved cm/kg profile row. */
export function profileToForm(profile: Profile | null, base: ProfileFormState): ProfileFormState {
  if (!profile) return base;

  const heightCm = profile.height;
  const weightKg = profile.weight;
  const ftIn = heightCm != null ? cmToFtIn(heightCm) : null;

  return {
    ...base,
    heightCm: heightCm != null ? String(Math.round(heightCm)) : "",
    heightFt: ftIn ? String(ftIn.ft) : "",
    heightIn: ftIn ? String(ftIn.in) : "",
    weight: weightKg != null ? String(Math.round(base.weightUnit === "lb" ? kgToLb(weightKg) : weightKg)) : "",
    age: profile.age != null ? String(profile.age) : "",
    gender: profile.gender,
    goal: profile.goal,
  };
}
