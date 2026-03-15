/**
 * Types for AI Fitness Form Checker
 */

// Pose detection types
export interface Keypoint {
  x: number;
  y: number;
  score: number; // Confidence score 0-1
  name: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score: number;
}

// Standard COCO keypoint names (used by most pose estimation models)
export const COCO_KEYPOINTS = [
  'nose',
  'left_eye',
  'right_eye',
  'left_ear',
  'right_ear',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
] as const;

export type KeypointName = typeof COCO_KEYPOINTS[number];

// Keypoint indices for quick lookup
export const KEYPOINT_INDICES: Record<KeypointName, number> = {
  nose: 0,
  left_eye: 1,
  right_eye: 2,
  left_ear: 3,
  right_ear: 4,
  left_shoulder: 5,
  right_shoulder: 6,
  left_elbow: 7,
  right_elbow: 8,
  left_wrist: 9,
  right_wrist: 10,
  left_hip: 11,
  right_hip: 12,
  left_knee: 13,
  right_knee: 14,
  left_ankle: 15,
  right_ankle: 16,
};

// Minimum confidence threshold for keypoints
export const MIN_CONFIDENCE = 0.3;
export const MIN_CONFIDENCE_THRESHOLD = 0.3;

// Exercise types
export type ExerciseType = 'squat' | 'pushup' | 'plank' | 'lunge' | 'deadlift';

export interface ExerciseConfig {
  name: ExerciseType;
  displayName: string;
  targetJoints: number[];
  formCriteria: FormCriteria[];
}

export interface FormCriteria {
  name: string;
  description: string;
  check: (landmarks: PoseLandmark[]) => FormCheckResult;
}

export interface FormCheckResult {
  isCorrect: boolean;
  score: number; // 0-100
  feedback: string;
}

export interface ExerciseSession {
  id: string;
  exerciseType: ExerciseType;
  startTime: Date;
  endTime?: Date;
  repCount: number;
  formScore: number;
  feedback: string[];
}

// Legacy types for compatibility
export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResults {
  poseLandmarks?: PoseLandmark[];
  segmentationMask?: any;
}

// Camera types
export interface CameraConfig {
  facing: 'front' | 'back';
  resolution: { width: number; height: number };
  frameRate: number;
}

// App state types
export interface AppState {
  currentExercise: ExerciseType | null;
  isDetecting: boolean;
  session: ExerciseSession | null;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Exercise: { exerciseType: ExerciseType };
  Results: { session: ExerciseSession };
  History: undefined;
  Settings: undefined;
};

// Workout types
export type WorkoutScreen = 'main' | 'camera' | 'results';

export interface WorkoutSession {
  exerciseId: ExerciseType;
  startTime: number;
  endTime: number;
  reps: RepData[];
  feedback: FormFeedback[];
}

export interface RepData {
  count: number;
  timestamp: number;
  formQuality: 'perfect' | 'good' | 'poor';
}

export interface FormFeedback {
  id: string;
  message: string;
  type: 'good' | 'warning' | 'error';
  timestamp: number;
}

// Exercise type for UI
export interface Exercise {
  id: ExerciseType;
  name: string;
  icon: string;
  description: string;
  targetMuscles: string[];
}
