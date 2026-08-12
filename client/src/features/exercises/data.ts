import type { Exercise } from "./types";

/**
 * STUB DATA SOURCE: every videoUrl below uses the "search:<query>" pseudo-URL
 * (see youtube.ts) which embeds a live YouTube *search results* player rather
 * than one specific, curated video. That's a deliberate placeholder — this
 * project doesn't have a real video library yet, and rather than hardcode
 * guessed YouTube video IDs (which could easily be wrong, deleted, or point
 * to the wrong exercise), each card searches YouTube live for a matching demo.
 *
 * To go live with curated content: replace a videoUrl with a specific
 * "https://www.youtube.com/watch?v=<id>" you've picked, or point it at a
 * stock exercise-video API / self-hosted file — the data model and player
 * don't need to change either way.
 */
export const EXERCISES: Exercise[] = [
  {
    id: "push-up",
    name: "Push-Up",
    muscleGroup: "Chest",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "A foundational pressing movement for chest, shoulders, and triceps. Keep a straight line from head to heels and lower until your chest is just above the floor.",
    videoUrl: "search:push up proper form tutorial",
  },
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "Chest",
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    description:
      "The classic barbell press for chest, shoulders, and triceps. Keep shoulder blades pinched, feet planted, and lower the bar to mid-chest with control.",
    videoUrl: "search:barbell bench press proper form tutorial",
  },
  {
    id: "dumbbell-fly",
    name: "Dumbbell Chest Fly",
    muscleGroup: "Chest",
    equipment: ["Dumbbells", "Bench"],
    difficulty: "Intermediate",
    description:
      "An isolation move that stretches and squeezes the chest. Keep a slight bend in the elbows throughout and avoid flaring too wide at the bottom.",
    videoUrl: "search:dumbbell chest fly proper form tutorial",
  },
  {
    id: "pull-up",
    name: "Pull-Up",
    muscleGroup: "Back",
    equipment: ["Pull-up Bar"],
    difficulty: "Advanced",
    description:
      "A demanding vertical pull for the lats and upper back. Start from a dead hang and pull until your chin clears the bar without kipping.",
    videoUrl: "search:pull up proper form tutorial",
  },
  {
    id: "bent-over-row",
    name: "Barbell Bent-Over Row",
    muscleGroup: "Back",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    description:
      "Hinge at the hips with a flat back and row the bar to your lower ribs. Builds thickness through the mid-back and lats.",
    videoUrl: "search:barbell bent over row proper form tutorial",
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "Back",
    equipment: ["Machine"],
    difficulty: "Beginner",
    description:
      "A machine-based alternative to the pull-up. Drive elbows down and back, avoiding momentum from leaning too far back.",
    videoUrl: "search:lat pulldown proper form tutorial",
  },
  {
    id: "resistance-band-row",
    name: "Resistance Band Row",
    muscleGroup: "Back",
    equipment: ["Resistance Band"],
    difficulty: "Beginner",
    description:
      "A joint-friendly rowing option for home or travel. Anchor the band, keep elbows close, and squeeze the shoulder blades together.",
    videoUrl: "search:resistance band row proper form tutorial",
  },
  {
    id: "overhead-press",
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    description:
      "A standing press that builds shoulder strength and core stability. Brace your core and press straight overhead, avoiding excessive back arch.",
    videoUrl: "search:barbell overhead press proper form tutorial",
  },
  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    muscleGroup: "Shoulders",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    description:
      "An isolation move for the side delts. Raise dumbbells to shoulder height with a slight elbow bend, leading with the elbows, not the hands.",
    videoUrl: "search:dumbbell lateral raise proper form tutorial",
  },
  {
    id: "kettlebell-press",
    name: "Kettlebell Single-Arm Press",
    muscleGroup: "Shoulders",
    equipment: ["Kettlebell"],
    difficulty: "Intermediate",
    description:
      "A unilateral overhead press that also challenges core anti-rotation. Press from the rack position straight up, staying stacked over the wrist.",
    videoUrl: "search:kettlebell single arm press proper form tutorial",
  },
  {
    id: "bicep-curl",
    name: "Dumbbell Bicep Curl",
    muscleGroup: "Arms",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    description:
      "A classic isolation move for the biceps. Keep elbows pinned to your sides and avoid swinging the weight up with momentum.",
    videoUrl: "search:dumbbell bicep curl proper form tutorial",
  },
  {
    id: "tricep-dip",
    name: "Bench Tricep Dip",
    muscleGroup: "Arms",
    equipment: ["Bench", "Bodyweight"],
    difficulty: "Beginner",
    description:
      "Targets the triceps using bodyweight. Keep hips close to the bench and lower until elbows reach about 90 degrees.",
    videoUrl: "search:bench tricep dip proper form tutorial",
  },
  {
    id: "back-squat",
    name: "Barbell Back Squat",
    muscleGroup: "Legs",
    equipment: ["Barbell"],
    difficulty: "Intermediate",
    description:
      "A foundational lower-body lift for quads, glutes, and core. Sit hips back and down, keeping the chest tall and knees tracking over the toes.",
    videoUrl: "search:barbell back squat proper form tutorial",
  },
  {
    id: "goblet-squat",
    name: "Goblet Squat",
    muscleGroup: "Legs",
    equipment: ["Dumbbells"],
    difficulty: "Beginner",
    description:
      "A beginner-friendly squat variation that reinforces upright posture. Hold a dumbbell at chest height and squat between your knees.",
    videoUrl: "search:goblet squat proper form tutorial",
  },
  {
    id: "bodyweight-lunge",
    name: "Walking Lunge",
    muscleGroup: "Legs",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "Builds single-leg strength and balance. Step forward, lower the back knee toward the floor, and drive through the front heel to stand.",
    videoUrl: "search:walking lunge proper form tutorial",
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscleGroup: "Legs",
    equipment: ["Machine"],
    difficulty: "Beginner",
    description:
      "A machine-based compound move for quads and glutes with less spinal loading than a squat. Avoid locking the knees out fully at the top.",
    videoUrl: "search:leg press machine proper form tutorial",
  },
  {
    id: "kettlebell-swing",
    name: "Kettlebell Swing",
    muscleGroup: "Glutes",
    equipment: ["Kettlebell"],
    difficulty: "Intermediate",
    description:
      "A hip-hinge power move that trains the entire posterior chain. Drive through the hips, not the arms — this is a snap, not a squat.",
    videoUrl: "search:kettlebell swing proper form tutorial",
  },
  {
    id: "hip-thrust",
    name: "Barbell Hip Thrust",
    muscleGroup: "Glutes",
    equipment: ["Barbell", "Bench"],
    difficulty: "Intermediate",
    description:
      "One of the most direct glute builders available. Drive through the heels and squeeze the glutes hard at the top without overextending the lower back.",
    videoUrl: "search:barbell hip thrust proper form tutorial",
  },
  {
    id: "glute-bridge",
    name: "Bodyweight Glute Bridge",
    muscleGroup: "Glutes",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "A gentle activation move for the glutes and lower back. Press through the heels and lift the hips until the body forms a straight line.",
    videoUrl: "search:glute bridge proper form tutorial",
  },
  {
    id: "plank",
    name: "Plank",
    muscleGroup: "Core",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "An isometric hold that builds core and shoulder stability. Keep hips level with shoulders and avoid letting the lower back sag.",
    videoUrl: "search:plank proper form tutorial",
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    muscleGroup: "Core",
    equipment: ["Pull-up Bar"],
    difficulty: "Advanced",
    description:
      "A demanding lower-ab move performed from a dead hang. Raise the legs with control, avoiding a swinging kip from the shoulders.",
    videoUrl: "search:hanging leg raise proper form tutorial",
  },
  {
    id: "russian-twist",
    name: "Russian Twist",
    muscleGroup: "Core",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "A rotational core move for the obliques. Lean back to about 45 degrees and rotate the torso side to side with control, not speed.",
    videoUrl: "search:russian twist proper form tutorial",
  },
  {
    id: "burpee",
    name: "Burpee",
    muscleGroup: "Full Body",
    equipment: ["Bodyweight"],
    difficulty: "Intermediate",
    description:
      "A full-body conditioning move combining a squat, plank, push-up, and jump. Move at a controlled pace before chasing speed.",
    videoUrl: "search:burpee proper form tutorial",
  },
  {
    id: "kb-clean-and-press",
    name: "Kettlebell Clean & Press",
    muscleGroup: "Full Body",
    equipment: ["Kettlebell"],
    difficulty: "Advanced",
    description:
      "A technical full-body move linking a hip-driven clean into an overhead press. Best learned slowly with a lighter kettlebell first.",
    videoUrl: "search:kettlebell clean and press proper form tutorial",
  },
  {
    id: "jump-rope",
    name: "Jump Rope",
    muscleGroup: "Cardio",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "A simple, effective cardio and coordination builder. Keep jumps low and land softly on the balls of your feet.",
    videoUrl: "search:jump rope basic technique tutorial",
  },
  {
    id: "mountain-climber",
    name: "Mountain Climber",
    muscleGroup: "Cardio",
    equipment: ["Bodyweight"],
    difficulty: "Beginner",
    description:
      "A fast-paced cardio move that also hits the core. Keep hips low and drive knees toward the chest without letting the hips pike up.",
    videoUrl: "search:mountain climber proper form tutorial",
  },
];
