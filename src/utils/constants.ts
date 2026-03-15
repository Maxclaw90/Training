import type { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Squat',
    icon: '🦵',
    description: 'Lower body powerhouse',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
  },
  {
    id: 'pushup',
    name: 'Push-up',
    icon: '💪',
    description: 'Upper body strength',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
  },
  {
    id: 'plank',
    name: 'Plank',
    icon: '⏱️',
    description: 'Core stability hold',
    targetMuscles: ['Core', 'Shoulders', 'Back'],
  },
];

export const FORM_TIPS: Record<string, string[]> = {
  squat: [
    'Keep chest up',
    'Knees over toes',
    'Hips below parallel',
    'Weight on heels',
  ],
  pushup: [
    'Body in straight line',
    'Elbows at 45°',
    'Chest to floor',
    'Core engaged',
  ],
  plank: [
    'Shoulders over wrists',
    'Body straight as board',
    'Squeeze glutes',
    'Breathe steady',
  ],
};