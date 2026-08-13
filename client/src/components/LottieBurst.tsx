import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import "./LottieBurst.css";

interface LottieBurstProps {
  /** Bump this (e.g. a counter) to (re)trigger the animation. 0/unset never plays. */
  playKey: number;
  animationData: object;
  size?: number;
}

/** One-shot celebratory/confirmation overlay (success check, confetti, …) centered over its parent. */
export default function LottieBurst({ playKey, animationData, size = 96 }: LottieBurstProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (playKey > 0) setVisible(true);
  }, [playKey]);

  if (!visible) return null;

  return (
    <div className="lottie-burst" style={{ width: size, height: size }} aria-hidden="true">
      <Lottie animationData={animationData} loop={false} autoplay onComplete={() => setVisible(false)} />
    </div>
  );
}
