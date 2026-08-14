import type { ReactElement, SVGProps } from "react";
import type { WorkoutCategory } from "../workouts/categories";

/** Small line icons for the Category filter chips — same inline-SVG stroke style as components/icons.tsx. */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<WorkoutCategory, (props: IconProps) => ReactElement> = {
  upper: (props) => (
    <svg {...base} {...props}>
      <path d="M3 10v4" strokeWidth={3.2} />
      <path d="M7 7.5v9" strokeWidth={2.6} />
      <path d="M7 12h10" />
      <path d="M17 7.5v9" strokeWidth={2.6} />
      <path d="M21 10v4" strokeWidth={3.2} />
    </svg>
  ),
  lower: (props) => (
    <svg {...base} {...props}>
      <path d="M10 4h4l.6 8-1.4 8h-2l-.7-7" />
      <path d="M10 4l-1 8-2.5 8h2" />
    </svg>
  ),
  cardio: (props) => (
    <svg {...base} {...props}>
      <path d="M12 19.5s-7-4.4-7-9.8A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7 2.7c0 5.4-7 9.8-7 9.8z" />
      <path d="M4.5 11h2.5l1.3-2.5L10 13l1.5-3 1 1.5h3.2" />
    </svg>
  ),
  core: (props) => (
    <svg {...base} {...props}>
      <rect x="7" y="4.5" width="10" height="15" rx="3" />
      <path d="M7 9.5h10M7 14.5h10M12 4.5v15" />
    </svg>
  ),
  "full-body": (props) => (
    <svg {...base} {...props}>
      <circle cx="12" cy="4.5" r="2" />
      <path d="M12 7v7" />
      <path d="M8 10h8" />
      <path d="M12 14l-3.5 6M12 14l3.5 6" />
    </svg>
  ),
};

export default function CategoryIcon({
  category,
  ...props
}: { category: WorkoutCategory } & IconProps): ReactElement {
  const Icon = ICONS[category];
  return <Icon {...props} />;
}
