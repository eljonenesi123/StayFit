import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { EXERCISES } from "./data";
import type { Exercise, MuscleGroup, Equipment } from "./types";
import ExerciseCard from "./ExerciseCard";
import ExerciseDetailSheet from "./ExerciseDetailSheet";
import "./ExerciseLibraryPage.css";

const MUSCLE_GROUPS: MuscleGroup[] = [
  "Chest",
  "Back",
  "Shoulders",
  "Arms",
  "Legs",
  "Glutes",
  "Core",
  "Full Body",
  "Cardio",
];

const EQUIPMENT: Equipment[] = [
  "Bodyweight",
  "Dumbbells",
  "Barbell",
  "Kettlebell",
  "Resistance Band",
  "Machine",
  "Pull-up Bar",
  "Bench",
];

export default function ExerciseLibraryPage() {
  const [query, setQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | null>(null);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const location = useLocation();

  useEffect(() => {
    const openId = (location.state as { openExerciseId?: string } | null)?.openExerciseId;
    if (openId) {
      const match = EXERCISES.find((e) => e.id === openId);
      if (match) setSelected(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXERCISES.filter((ex) => {
      if (muscleFilter && ex.muscleGroup !== muscleFilter) return false;
      if (equipmentFilter && !ex.equipment.includes(equipmentFilter)) return false;
      if (q && !ex.name.toLowerCase().includes(q) && !ex.muscleGroup.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, muscleFilter, equipmentFilter]);

  const hasActiveFilters = muscleFilter || equipmentFilter || query;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Exercise Library</h1>
        <p>Search or filter by muscle group and equipment. Tap a card for a demo video and form cues.</p>
      </div>

      <input
        type="text"
        placeholder="Search exercises…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search exercises"
        className="exercise-library__search"
      />

      <div className="exercise-library__filter-group">
        <span className="exercise-library__filter-label">Muscle group</span>
        <div className="exercise-library__chips">
          {MUSCLE_GROUPS.map((mg) => (
            <button
              key={mg}
              type="button"
              className="chip"
              data-active={muscleFilter === mg}
              onClick={() => setMuscleFilter(muscleFilter === mg ? null : mg)}
            >
              {mg}
            </button>
          ))}
        </div>
      </div>

      <div className="exercise-library__filter-group">
        <span className="exercise-library__filter-label">Equipment</span>
        <div className="exercise-library__chips">
          {EQUIPMENT.map((eq) => (
            <button
              key={eq}
              type="button"
              className="chip"
              data-active={equipmentFilter === eq}
              onClick={() => setEquipmentFilter(equipmentFilter === eq ? null : eq)}
            >
              {eq}
            </button>
          ))}
        </div>
      </div>

      <div className="exercise-library__results-meta">
        <span>
          {filtered.length} {filtered.length === 1 ? "exercise" : "exercises"}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setQuery("");
              setMuscleFilter(null);
              setEquipmentFilter(null);
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No exercises match those filters. Try clearing one.</p>
        </div>
      ) : (
        <div className="exercise-library__grid">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onSelect={() => setSelected(ex)} />
          ))}
        </div>
      )}

      <ExerciseDetailSheet exercise={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
