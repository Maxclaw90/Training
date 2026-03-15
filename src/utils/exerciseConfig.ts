import { ExerciseType, ExerciseConfig, FormCheckResult, PoseLandmark } from '../types';
import { calculateAngle, POSE_LANDMARKS, createFormResult } from './poseUtils';

/**
 * Exercise configurations with form criteria
 */
export const EXERCISE_CONFIGS: Record<ExerciseType, ExerciseConfig> = {
  squat: {
    name: 'squat',
    displayName: 'Squat',
    targetJoints: [
      POSE_LANDMARKS.LEFT_HIP,
      POSE_LANDMARKS.RIGHT_HIP,
      POSE_LANDMARKS.LEFT_KNEE,
      POSE_LANDMARKS.RIGHT_KNEE,
      POSE_LANDMARKS.LEFT_ANKLE,
      POSE_LANDMARKS.RIGHT_ANKLE,
    ],
    formCriteria: [
      {
        name: 'kneeAngle',
        description: 'Knees should bend to approximately 90 degrees',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const leftKneeAngle = calculateAngle(
            landmarks[POSE_LANDMARKS.LEFT_HIP],
            landmarks[POSE_LANDMARKS.LEFT_KNEE],
            landmarks[POSE_LANDMARKS.LEFT_ANKLE]
          );
          const rightKneeAngle = calculateAngle(
            landmarks[POSE_LANDMARKS.RIGHT_HIP],
            landmarks[POSE_LANDMARKS.RIGHT_KNEE],
            landmarks[POSE_LANDMARKS.RIGHT_ANKLE]
          );
          const avgAngle = (leftKneeAngle + rightKneeAngle) / 2;
          const score = Math.max(0, 100 - Math.abs(avgAngle - 90));
          return createFormResult(
            avgAngle >= 80 && avgAngle <= 100,
            score,
            avgAngle < 80 ? 'Bend your knees more' : avgAngle > 100 ? 'Don\'t go too low' : 'Good depth!'
          );
        },
      },
      {
        name: 'backStraight',
        description: 'Keep your back straight',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const leftShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
          const leftHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
          const angle = Math.abs(Math.atan2(leftHip.y - leftShoulder.y, leftHip.x - leftShoulder.x) * 180 / Math.PI);
          const score = Math.max(0, 100 - Math.abs(angle - 90));
          return createFormResult(
            angle >= 75 && angle <= 105,
            score,
            angle < 75 ? 'Lean back slightly' : angle > 105 ? 'Lean forward slightly' : 'Good posture!'
          );
        },
      },
    ],
  },
  pushup: {
    name: 'pushup',
    displayName: 'Push-up',
    targetJoints: [
      POSE_LANDMARKS.LEFT_SHOULDER,
      POSE_LANDMARKS.RIGHT_SHOULDER,
      POSE_LANDMARKS.LEFT_ELBOW,
      POSE_LANDMARKS.RIGHT_ELBOW,
      POSE_LANDMARKS.LEFT_WRIST,
      POSE_LANDMARKS.RIGHT_WRIST,
    ],
    formCriteria: [
      {
        name: 'elbowAngle',
        description: 'Elbows should bend to approximately 90 degrees',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const leftElbowAngle = calculateAngle(
            landmarks[POSE_LANDMARKS.LEFT_SHOULDER],
            landmarks[POSE_LANDMARKS.LEFT_ELBOW],
            landmarks[POSE_LANDMARKS.LEFT_WRIST]
          );
          const rightElbowAngle = calculateAngle(
            landmarks[POSE_LANDMARKS.RIGHT_SHOULDER],
            landmarks[POSE_LANDMARKS.RIGHT_ELBOW],
            landmarks[POSE_LANDMARKS.RIGHT_WRIST]
          );
          const avgAngle = (leftElbowAngle + rightElbowAngle) / 2;
          const score = Math.max(0, 100 - Math.abs(avgAngle - 90));
          return createFormResult(
            avgAngle >= 80 && avgAngle <= 100,
            score,
            avgAngle < 80 ? 'Lower your body more' : avgAngle > 100 ? 'Good range of motion!' : 'Good depth!'
          );
        },
      },
      {
        name: 'bodyAlignment',
        description: 'Keep body in straight line',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const shoulderY = (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2;
          const hipY = (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2;
          const ankleY = (landmarks[POSE_LANDMARKS.LEFT_ANKLE].y + landmarks[POSE_LANDMARKS.RIGHT_ANKLE].y) / 2;
          const deviation = Math.abs(shoulderY - hipY) + Math.abs(hipY - ankleY);
          const score = Math.max(0, 100 - deviation * 200);
          return createFormResult(
            deviation < 0.1,
            score,
            deviation > 0.1 ? 'Keep your body straight' : 'Good alignment!'
          );
        },
      },
    ],
  },
  lunge: {
    name: 'lunge',
    displayName: 'Lunge',
    targetJoints: [
      POSE_LANDMARKS.LEFT_HIP,
      POSE_LANDMARKS.RIGHT_HIP,
      POSE_LANDMARKS.LEFT_KNEE,
      POSE_LANDMARKS.RIGHT_KNEE,
      POSE_LANDMARKS.LEFT_ANKLE,
      POSE_LANDMARKS.RIGHT_ANKLE,
    ],
    formCriteria: [
      {
        name: 'frontKneeAngle',
        description: 'Front knee should be at 90 degrees',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const leftKneeAngle = calculateAngle(
            landmarks[POSE_LANDMARKS.LEFT_HIP],
            landmarks[POSE_LANDMARKS.LEFT_KNEE],
            landmarks[POSE_LANDMARKS.LEFT_ANKLE]
          );
          const score = Math.max(0, 100 - Math.abs(leftKneeAngle - 90));
          return createFormResult(
            leftKneeAngle >= 80 && leftKneeAngle <= 100,
            score,
            leftKneeAngle < 80 ? 'Step forward more' : leftKneeAngle > 100 ? 'Good depth!' : 'Perfect form!'
          );
        },
      },
    ],
  },
  plank: {
    name: 'plank',
    displayName: 'Plank',
    targetJoints: [
      POSE_LANDMARKS.LEFT_SHOULDER,
      POSE_LANDMARKS.RIGHT_SHOULDER,
      POSE_LANDMARKS.LEFT_HIP,
      POSE_LANDMARKS.RIGHT_HIP,
      POSE_LANDMARKS.LEFT_ANKLE,
      POSE_LANDMARKS.RIGHT_ANKLE,
    ],
    formCriteria: [
      {
        name: 'bodyAlignment',
        description: 'Keep body in straight line from head to heels',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const shoulderY = (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2;
          const hipY = (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2;
          const ankleY = (landmarks[POSE_LANDMARKS.LEFT_ANKLE].y + landmarks[POSE_LANDMARKS.RIGHT_ANKLE].y) / 2;
          const deviation = Math.abs(shoulderY - hipY) + Math.abs(hipY - ankleY);
          const score = Math.max(0, 100 - deviation * 200);
          return createFormResult(
            deviation < 0.05,
            score,
            deviation > 0.05 ? 'Keep your body straight' : 'Perfect plank!'
          );
        },
      },
    ],
  },
  deadlift: {
    name: 'deadlift',
    displayName: 'Deadlift',
    targetJoints: [
      POSE_LANDMARKS.LEFT_SHOULDER,
      POSE_LANDMARKS.RIGHT_SHOULDER,
      POSE_LANDMARKS.LEFT_HIP,
      POSE_LANDMARKS.RIGHT_HIP,
      POSE_LANDMARKS.LEFT_KNEE,
      POSE_LANDMARKS.RIGHT_KNEE,
    ],
    formCriteria: [
      {
        name: 'backStraight',
        description: 'Keep back straight throughout movement',
        check: (landmarks: PoseLandmark[]): FormCheckResult => {
          const shoulderY = (landmarks[POSE_LANDMARKS.LEFT_SHOULDER].y + landmarks[POSE_LANDMARKS.RIGHT_SHOULDER].y) / 2;
          const hipY = (landmarks[POSE_LANDMARKS.LEFT_HIP].y + landmarks[POSE_LANDMARKS.RIGHT_HIP].y) / 2;
          const deviation = Math.abs(shoulderY - hipY);
          const score = Math.max(0, 100 - deviation * 300);
          return createFormResult(
            deviation < 0.1,
            score,
            deviation > 0.1 ? 'Keep your back straight' : 'Good form!'
          );
        },
      },
    ],
  },
};

/**
 * Get exercise configuration by type
 */
export function getExerciseConfig(type: ExerciseType): ExerciseConfig {
  return EXERCISE_CONFIGS[type];
}

/**
 * Get all available exercises
 */
export function getAllExercises(): ExerciseConfig[] {
  return Object.values(EXERCISE_CONFIGS);
}
