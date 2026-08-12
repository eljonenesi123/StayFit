import { useId, useState } from "react";
import type { Segment, SegmentType } from "./types";
import { formatDuration } from "../../lib/format";
import { PlusIcon, TrashIcon } from "../../components/icons";
import "./RoundBuilder.css";

interface RoundBuilderProps {
  segments: Segment[];
  onChange: (segments: Segment[]) => void;
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function RoundBuilder({ segments, onChange }: RoundBuilderProps) {
  const [workMin, setWorkMin] = useState(2);
  const [workSec, setWorkSec] = useState(0);
  const [restMin, setRestMin] = useState(0);
  const [restSec, setRestSec] = useState(30);
  const formId = useId();

  const addRound = () => {
    const work: Segment = { id: newId(), type: "work", durationSec: workMin * 60 + workSec };
    const rest: Segment = { id: newId(), type: "rest", durationSec: restMin * 60 + restSec };
    const additions = [work, ...(rest.durationSec > 0 ? [rest] : [])];
    onChange([...segments, ...additions]);
  };

  const removeSegment = (id: string) => {
    onChange(segments.filter((s) => s.id !== id));
  };

  const moveSegment = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= segments.length) return;
    const next = [...segments];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const updateDuration = (id: string, durationSec: number) => {
    onChange(segments.map((s) => (s.id === id ? { ...s, durationSec: Math.max(0, durationSec) } : s)));
  };

  const totalMs = segments.reduce((sum, s) => sum + s.durationSec * 1000, 0);
  const workCount = segments.filter((s) => s.type === "work").length;

  return (
    <div className="round-builder">
      <div className="card round-builder__form">
        <div className="round-builder__form-grid">
          <DurationField
            id={`${formId}-work`}
            label="Work"
            tone="work"
            minutes={workMin}
            seconds={workSec}
            onMinutes={setWorkMin}
            onSeconds={setWorkSec}
          />
          <DurationField
            id={`${formId}-rest`}
            label="Rest"
            tone="rest"
            minutes={restMin}
            seconds={restSec}
            onMinutes={setRestMin}
            onSeconds={setRestSec}
          />
        </div>
        <button type="button" className="btn btn-primary round-builder__add" onClick={addRound}>
          <PlusIcon width={20} height={20} />
          Add round
        </button>
      </div>

      {segments.length === 0 ? (
        <div className="empty-state">
          <p>No rounds yet. Add work and rest durations above to build your sequence.</p>
        </div>
      ) : (
        <>
          <ol className="round-builder__list">
            {segments.map((seg, i) => (
              <li key={seg.id} className={`round-builder__row round-builder__row--${seg.type}`}>
                <span className="round-builder__badge">{seg.type === "work" ? "Work" : "Rest"}</span>
                <SegmentDurationEditor segment={seg} onChange={(sec) => updateDuration(seg.id, sec)} />
                <div className="round-builder__row-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    aria-label="Move up"
                    disabled={i === 0}
                    onClick={() => moveSegment(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    aria-label="Move down"
                    disabled={i === segments.length - 1}
                    onClick={() => moveSegment(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon"
                    aria-label="Remove round"
                    onClick={() => removeSegment(seg.id)}
                  >
                    <TrashIcon width={19} height={19} />
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <div className="round-builder__summary">
            <span>
              {workCount} {workCount === 1 ? "round" : "rounds"}
            </span>
            <span>Total time {formatDuration(totalMs)}</span>
          </div>
        </>
      )}
    </div>
  );
}

function DurationField({
  id,
  label,
  tone,
  minutes,
  seconds,
  onMinutes,
  onSeconds,
}: {
  id: string;
  label: string;
  tone: SegmentType;
  minutes: number;
  seconds: number;
  onMinutes: (v: number) => void;
  onSeconds: (v: number) => void;
}) {
  return (
    <div className={`duration-field duration-field--${tone}`}>
      <label htmlFor={id}>{label}</label>
      <div className="duration-field__inputs">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={minutes}
          onChange={(e) => onMinutes(Number(e.target.value))}
          aria-label={`${label} minutes`}
        />
        <span>:</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={seconds}
          onChange={(e) => onSeconds(Number(e.target.value))}
          aria-label={`${label} seconds`}
        />
      </div>
    </div>
  );
}

function SegmentDurationEditor({ segment, onChange }: { segment: Segment; onChange: (sec: number) => void }) {
  const minutes = Math.floor(segment.durationSec / 60);
  const seconds = segment.durationSec % 60;
  return (
    <div className="duration-field duration-field--compact">
      <div className="duration-field__inputs">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={minutes}
          onChange={(e) => onChange(Number(e.target.value) * 60 + seconds)}
          aria-label="Minutes"
        />
        <span>:</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={59}
          value={seconds}
          onChange={(e) => onChange(minutes * 60 + Number(e.target.value))}
          aria-label="Seconds"
        />
      </div>
    </div>
  );
}
