import { useEffect, useRef, useState } from "react";
import { GOAL_OPTIONS, type ProfileFormState } from "./types";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/icons";
import buildMuscle from "../../assets/illustrations/goal-build-muscle.svg";
import stayFit from "../../assets/illustrations/goal-stay-fit.svg";
import improveShape from "../../assets/illustrations/goal-improve-shape.svg";
import endurance from "../../assets/illustrations/goal-endurance.svg";
import "./OnboardingGoalCarousel.css";

const ILLUSTRATIONS = {
  build_muscle: buildMuscle,
  stay_fit: stayFit,
  improve_shape: improveShape,
  endurance: endurance,
} as const;

interface Props {
  form: ProfileFormState;
  onChange: (patch: Partial<ProfileFormState>) => void;
}

/** Small decorative freehand-style accent strokes near each card's illustration — purely visual. */
function SketchFlair() {
  return (
    <svg className="goal-card__flair" viewBox="0 0 60 40" fill="none" aria-hidden="true">
      <path d="M4 20c6-10 14-14 20-8" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M14 30c5-6 11-8 16-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.32" />
      <path d="M30 6c4-4 9-4 12 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.42" />
    </svg>
  );
}

export default function OnboardingGoalCarousel({ form, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const initialIndex = Math.max(
    0,
    GOAL_OPTIONS.findIndex((o) => o.value === form.goal)
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Land on the right card immediately (no smooth-scroll animation on mount), and make sure
  // `form.goal` reflects whichever card is centered even if the user never touches the carousel.
  useEffect(() => {
    const track = trackRef.current;
    const slide = track?.children[initialIndex] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "instant" as ScrollBehavior, inline: "center", block: "nearest" });
    onChange({ goal: GOAL_OPTIONS[initialIndex].value });
    // Only ever run once on mount — this is deliberately not re-synced to `form.goal` afterwards,
    // since the carousel itself is the source of truth for selection once mounted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const el = child as HTMLElement;
      const elCenter = el.offsetLeft + el.offsetWidth / 2;
      const distance = Math.abs(elCenter - trackCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    });
    if (closestIndex !== activeIndex) {
      setActiveIndex(closestIndex);
      onChange({ goal: GOAL_OPTIONS[closestIndex].value });
    }
  };

  const goTo = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <div className="goal-carousel">
      <div className="goal-carousel__track" ref={trackRef} onScroll={handleScroll}>
        {GOAL_OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            className="goal-card"
            data-active={i === activeIndex}
            onClick={() => goTo(i)}
          >
            <SketchFlair />
            <img className="goal-card__illustration" src={ILLUSTRATIONS[opt.value]} alt="" />
            <span className="goal-card__title">{opt.label}</span>
            <span className="goal-card__desc">{opt.description}</span>
          </button>
        ))}
      </div>

      <div className="goal-carousel__controls">
        <button
          type="button"
          className="goal-carousel__arrow"
          onClick={() => goTo(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous goal"
        >
          <ChevronLeftIcon width={18} height={18} />
        </button>

        <div className="goal-carousel__dots">
          {GOAL_OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              type="button"
              className="goal-carousel__dot"
              data-active={i === activeIndex}
              onClick={() => goTo(i)}
              aria-label={`Go to ${opt.label}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="goal-carousel__arrow"
          onClick={() => goTo(Math.min(GOAL_OPTIONS.length - 1, activeIndex + 1))}
          disabled={activeIndex === GOAL_OPTIONS.length - 1}
          aria-label="Next goal"
        >
          <ChevronRightIcon width={18} height={18} />
        </button>
      </div>
    </div>
  );
}
