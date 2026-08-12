"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import "../../styles/tailwind-scoped.css";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  id?: string | number;
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  rotate?: number;
  depth?: number;
  perspective?: number;
  falloff?: number;
  fade?: number;
  cardWidth?: string;
  gap?: number;
  loop?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  label?: string;
  className?: string;
  cardClassName?: string;
  selectedIds?: (string | number)[];
  onToggleSelect?: (id: string | number) => void;
}

export function CoverflowCarousel({
  slides,
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(220px, 78vw, 320px)",
  gap = 0.05,
  loop = true,
  showPagination = true,
  showNavigation = true,
  label = "Goal carousel",
  className,
  cardClassName,
  selectedIds = [],
  onToggleSelect,
}: CoverflowCarouselProps) {
  const count = slides.length;
  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    y: number;
    pos: number;
    v: number;
    t: number;
    moved: boolean;
    startTarget: EventTarget | null;
  } | null>(null);
  const [selected, setSelected] = React.useState(0);

  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback((target: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    targetRef.current = target;
    setSelected(indexAt(target));
    const step = () => {
      const remaining = target - posRef.current;
      if (Math.abs(remaining) < 0.0004) {
        posRef.current = target;
        paint();
        rafRef.current = null;
        return;
      }
      posRef.current += remaining * 0.16;
      paint();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [indexAt, paint]);

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
      moved: false,
      startTarget: event.target,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    if (!drag.moved && (Math.abs(event.clientX - drag.x) > 4 || Math.abs(event.clientY - drag.y) > 4)) {
      drag.moved = true;
    }
    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;
    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;
    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) {
      // setPointerCapture() above retargets the browser's synthesized "click"
      // event to this capturing element instead of letting it bubble from
      // whatever card was actually tapped, so a plain tap (no drag) never
      // reaches each card's own onClick. Resolve the tapped card manually
      // via its data-slide-id and fire selection ourselves to compensate.
      const cardEl = (drag.startTarget as HTMLElement | null)?.closest<HTMLElement>("[data-slide-id]");
      if (cardEl) {
        const rawId = cardEl.dataset.slideId!;
        const slide = slides.find((s, i) => String(s.id ?? i) === rawId);
        if (slide) onToggleSelect?.(slide.id ?? rawId);
      }
    }
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className={cn("w-full", className)} style={{ ["--cf-card" as string]: cardWidth }} role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") { event.preventDefault(); nudge(-1); }
            else if (event.key === "ArrowRight") { event.preventDefault(); nudge(1); }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none active:cursor-grabbing"
          style={{ perspective: `calc(var(--cf-card) * ${perspective})`, touchAction: "pan-y" }}
        >
          <div className="relative select-none" style={{ height: "var(--cf-card)", transformStyle: "preserve-3d" }}>
            {slides.map((slide, index) => {
              const id = slide.id ?? index;
              const isSelected = selectedIds.includes(id);
              return (
                <div
                  key={index}
                  ref={(node) => { cardRefs.current[index] = node; }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  data-slide-id={String(id)}
                  // Tap-to-select is handled in endDrag, not here — see the
                  // comment there. A native onClick would never fire anyway
                  // (setPointerCapture retargets it to the frame element),
                  // and keeping it would risk a double-toggle in engines
                  // where that retargeting doesn't happen.
                  className={cn(
                    "absolute left-1/2 top-0 aspect-[3/4] overflow-hidden rounded-3xl shadow-xl will-change-transform cursor-pointer",
                    "bg-gradient-to-b from-orange-600 via-orange-800 to-black",
                    isSelected && "ring-4 ring-orange-400",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
                    {isSelected && (
                      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-orange-400 text-white text-sm font-bold">
                        ✓
                      </div>
                    )}
                    <img src={slide.src} alt={slide.alt} draggable={false} className="h-2/5 w-2/5 select-none object-contain" />
                    <p className="text-lg font-bold text-white">{slide.title}</p>
                    {slide.subtitle && <p className="text-sm text-white/80">{slide.subtitle}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button type="button" aria-label="Previous slide" onClick={() => nudge(-1)} className="absolute left-2 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-md transition hover:bg-white">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" aria-label="Next slide" onClick={() => nudge(1)} className="absolute right-2 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-white/90 p-2 text-black shadow-md transition hover:bg-white">
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => settle(index)}
              className={cn("size-2 rounded-full bg-orange-500 transition-opacity", index === selected ? "opacity-100" : "opacity-30")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
