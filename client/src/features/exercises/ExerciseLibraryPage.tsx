import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { EXERCISES } from "./data";
import type { Exercise, MuscleGroup, Equipment } from "./types";
import ExerciseCard from "./ExerciseCard";
import ExerciseDetailSheet from "./ExerciseDetailSheet";
import CategoryIcon from "./CategoryIcon";
import { CATEGORIES, CATEGORY_LABELS, MUSCLE_GROUP_TO_CATEGORY, type WorkoutCategory } from "../workouts/categories";
import { ChevronDownIcon } from "../../components/icons";
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
  const [categoryFilter, setCategoryFilter] = useState<WorkoutCategory | null>(null);
  const [muscleFilter, setMuscleFilter] = useState<MuscleGroup | null>(null);
  const [equipmentFilter, setEquipmentFilter] = useState<Equipment | null>(null);
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
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
      if (categoryFilter && MUSCLE_GROUP_TO_CATEGORY[ex.muscleGroup] !== categoryFilter) return false;
      if (muscleFilter && ex.muscleGroup !== muscleFilter) return false;
      if (equipmentFilter && !ex.equipment.includes(equipmentFilter)) return false;
      if (q && !ex.name.toLowerCase().includes(q) && !ex.muscleGroup.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, categoryFilter, muscleFilter, equipmentFilter]);

  const secondaryActiveCount = (muscleFilter ? 1 : 0) + (equipmentFilter ? 1 : 0);
  const hasActiveFilters = categoryFilter || muscleFilter || equipmentFilter || query;

  // With no Category selected, group the flat results under sticky per-muscle-group
  // headers so browsing the full library feels organized instead of a 26-card dump.
  // Once a Category is picked, everything in `filtered` already belongs to it, so a
  // single flat grid is clearer than headers for only part of the muscle groups.
  const groups = useMemo(() => {
    if (categoryFilter) return null;
    return MUSCLE_GROUPS.map((mg) => ({
      muscleGroup: mg,
      exercises: filtered.filter((ex) => ex.muscleGroup === mg),
    })).filter((g) => g.exercises.length > 0);
  }, [filtered, categoryFilter]);

  return (
    <div className="exercise-library">
      <div className="page-header">
        <p>Search or filter by category, muscle group, and equipment. Tap a card for a demo video and form cues.</p>
      </div>

      <input
        type="text"
        placeholder="Search exercises…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search exercises"
        className="exercise-library__search"
      />

      <div className="exercise-library__filter-group exercise-library__filter-group--primary">
        <span className="exercise-library__filter-label">Category</span>
        <div className="exercise-library__chips">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className="chip chip-category"
              data-active={categoryFilter === cat}
              onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
            >
              <CategoryIcon category={cat} aria-hidden="true" />
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="exercise-library__more-toggle"
        aria-expanded={moreFiltersOpen}
        onClick={() => setMoreFiltersOpen((v) => !v)}
      >
        <span>
          More filters
          {secondaryActiveCount > 0 && (
            <span className="exercise-library__more-toggle-count">{secondaryActiveCount}</span>
          )}
        </span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`exercise-library__more-toggle-icon${moreFiltersOpen ? " exercise-library__more-toggle-icon--open" : ""}`}
        />
      </button>

      {moreFiltersOpen && (
        <div className="exercise-library__more-filters">
          <div className="exercise-library__filter-group">
            <span className="exercise-library__filter-label">Muscle group</span>
            <div className="exercise-library__chips">
              {MUSCLE_GROUPS.map((mg) => (
                <button
                  key={mg}
                  type="button"
                  className="chip chip-secondary"
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
                  className="chip chip-secondary"
                  data-active={equipmentFilter === eq}
                  onClick={() => setEquipmentFilter(equipmentFilter === eq ? null : eq)}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

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
              setCategoryFilter(null);
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
      ) : groups ? (
        <div className="exercise-library__groups">
          {groups.map((group) => (
            <section key={group.muscleGroup} className="exercise-library__group">
              <h2 className="exercise-library__group-header">
                {group.muscleGroup}
                <span className="exercise-library__group-count">{group.exercises.length}</span>
              </h2>
              <div className="exercise-library__grid">
                {group.exercises.map((ex) => (
                  <ExerciseCard key={ex.id} exercise={ex} onSelect={() => setSelected(ex)} />
                ))}
              </div>
            </section>
          ))}
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
