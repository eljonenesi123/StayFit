/**
 * Categorical palette for the macro breakdown (protein/carbs/fat), validated
 * with the dataviz skill's validate_palette.js against the app's paper
 * background: lightness band, chroma floor, and CVD separation all pass.
 * Because the CVD check lands in the 6-8 "legal only with secondary
 * encoding" band, each macro is always paired with a visible text label —
 * never color alone.
 */
export const MACRO_COLORS = {
  protein: "#2fa86f",
  carbs: "#cf9a2e",
  fat: "#4a72c9",
} as const;
