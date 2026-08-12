import type { SVGProps } from "react";

/**
 * Small hand-drawn icon set for the bottom nav.
 * Kept as inline SVG (no icon library) to stay dependency-light.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TimerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2.5" />
      <path d="M9.5 2.5h5" />
      <path d="M18.5 5.5l1.2-1.2" />
    </svg>
  );
}

export function LibraryIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 4.5c1.6-.8 3.4-1 5-.5 1.6.5 2.4 1 3 1.5 0 0 .8-1 3-1.5 1.6-.5 3.4-.3 5 .5v14c-1.6-.8-3.4-1-5-.5-2.2.7-3 1.5-3 1.5s-.8-.8-3-1.5c-1.6-.5-3.4-.3-5 .5z" />
      <path d="M12 5.5v14" />
    </svg>
  );
}

export function ScanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2" />
      <path d="M20 8V6a2 2 0 0 0-2-2h-2" />
      <path d="M4 16v2a2 2 0 0 0 2 2h2" />
      <path d="M20 16v2a2 2 0 0 1-2 2h-2" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  );
}

export function PlanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14.5 3.5V8h4.3" />
      <path d="M8.5 12.5h7" />
      <path d="M8.5 16h7" />
    </svg>
  );
}

export function CalorieIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5c1 2 .5 3.4-.5 4.6C10.3 8.4 9 9.7 9 12a3 3 0 0 0 6 0c0-.9-.3-1.6-.7-2.2 1.4.9 2.7 2.6 2.7 4.9a5 5 0 0 1-10 0c0-3.6 2.3-5.4 3.6-7.1 1-1.3 1.4-2.6 1.4-5.1z" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <rect x="6" y="4.5" width="4.5" height="15" rx="1" />
      <rect x="13.5" y="4.5" width="4.5" height="15" rx="1" />
    </svg>
  );
}

export function SkipIcon(props: IconProps) {
  return (
    <svg {...base} {...props} fill="currentColor" stroke="none">
      <path d="M6 5v14l10-7z" />
      <rect x="17" y="5" width="2.5" height="14" rx="0.5" />
    </svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12a8 8 0 1 1 2.6 5.9" />
      <path d="M4 18v-5h5" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 7h15" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7l.7 12a1.5 1.5 0 0 0 1.5 1.4h6.6a1.5 1.5 0 0 0 1.5-1.4L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function DragIcon(props: IconProps) {
  return (
    <svg {...base} {...props} strokeWidth={2}>
      <circle cx="9" cy="6" r="1" fill="currentColor" />
      <circle cx="15" cy="6" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="18" r="1" fill="currentColor" />
      <circle cx="15" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8.5a1.5 1.5 0 0 1 1.5-1.5H8l1.2-1.8A1 1 0 0 1 10 4.7h4a1 1 0 0 1 .8.5L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props} strokeWidth={2.4}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function PersonIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 10h16" />
      <path d="M8 3.5v4M16 3.5v4" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="5.5" cy="12" r="2.5" />
      <circle cx="18.5" cy="12" r="2.5" />
      <path d="M8 12h8" />
      <path d="M5.5 9.5v5M18.5 9.5v5" />
    </svg>
  );
}

export function RulerIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v18" />
      <path d="M8 7l4-4 4 4" />
      <path d="M8 17l4 4 4-4" />
    </svg>
  );
}
