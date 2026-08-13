import type { ReactElement, SVGProps } from "react";
import type { MuscleGroup } from "./types";

/**
 * Small line-icon set used as the exercise-card thumbnail. Kept in the same
 * inline-SVG, no-icon-library style as components/icons.tsx (stroke-only,
 * 24x24, currentColor) so it drops into the existing visual language.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<MuscleGroup, (props: IconProps) => ReactElement> = {
  Chest: (props) => (
    <svg {...base} {...props}>
      <path d="M12 6c-1.4-1.8-4.6-2.2-6 .5-1.3 2.6.4 5 3 6l3 1.5 3-1.5c2.6-1 4.3-3.4 3-6-1.4-2.7-4.6-2.3-6-.5z" />
      <path d="M12 6v8" />
    </svg>
  ),
  Back: (props) => (
    <svg {...base} {...props}>
      <path d="M12 4v16" />
      <path d="M12 6c-2.5 1-5 2.8-6.5 6.5C4 15.5 4.5 18 5.5 20" />
      <path d="M12 6c2.5 1 5 2.8 6.5 6.5 1.5 3 1 5.5 0 7.5" />
    </svg>
  ),
  Shoulders: (props) => (
    <svg {...base} {...props}>
      <circle cx="6.5" cy="8" r="2.5" />
      <circle cx="17.5" cy="8" r="2.5" />
      <path d="M4 17c0-3.5 2.2-6 8-6s8 2.5 8 6" />
    </svg>
  ),
  Arms: (props) => (
    <svg {...base} {...props}>
      <path d="M6 5.5v6c0 2.5 1.5 4 3.5 4.8" />
      <circle cx="14.5" cy="14" r="3.2" />
      <path d="M6 5.5h4" />
    </svg>
  ),
  Legs: (props) => (
    <svg {...base} {...props}>
      <path d="M10 4h4l.6 8-1.4 8h-2l-.7-7" />
      <path d="M10 4l-1 8-2.5 8h2" />
    </svg>
  ),
  Glutes: (props) => (
    <svg {...base} {...props}>
      <path d="M6 8a6 5 0 0 1 12 0v4a6 7 0 0 1-6 7 6 7 0 0 1-6-7z" />
      <path d="M12 8v11" />
    </svg>
  ),
  Core: (props) => (
    <svg {...base} {...props}>
      <rect x="7" y="4.5" width="10" height="15" rx="3" />
      <path d="M7 9.5h10M7 14.5h10M12 4.5v15" />
    </svg>
  ),
  "Full Body": (props) => (
    <svg {...base} {...props}>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 7v7" />
      <path d="M8 10h8" />
      <path d="M12 14l-3.5 6M12 14l3.5 6" />
    </svg>
  ),
  Cardio: (props) => (
    <svg {...base} {...props}>
      <path d="M12 19.5s-7-4.4-7-9.8A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 2.7c0 5.4-7 9.8-7 9.8z" />
      <path d="M4.5 11h2.5l1.3-2.5L10 13l1.5-3 1 1.5h3.2" />
    </svg>
  ),
};

export default function MuscleGroupIcon({
  group,
  ...props
}: { group: MuscleGroup } & IconProps): ReactElement {
  const Icon = ICONS[group];
  return <Icon {...props} />;
}
