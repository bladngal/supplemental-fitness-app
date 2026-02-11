'use client';

import { useMemo } from 'react';
import { Workout } from '@/types/database';
import { classifyFatigue } from '@/lib/engines/fatigue-classifier';
import { generateWorkoutGuidance, generateDayGuidance, GuidanceNote } from '@/lib/engines/guidance-generator';
import { evaluateCompatibility } from '@/lib/engines/compatibility-engine';
import { FatigueClassification } from '@/lib/engines/types';

export function useWorkoutGuidance(workout: Workout | null) {
  return useMemo(() => {
    if (!workout) return { classification: null, notes: [] };

    const classification = classifyFatigue({
      primary_intent: workout.primary_intent,
      perceived_effort: workout.perceived_effort,
      stress_impact: workout.stress_impact,
      stress_tendons: workout.stress_tendons,
      stress_localized_muscle: workout.stress_localized_muscle,
      stress_breathing_hr: workout.stress_breathing_hr,
      stress_coordination: workout.stress_coordination,
    });

    const notes = generateWorkoutGuidance(workout, classification);

    return { classification, notes };
  }, [workout]);
}

export function useDayGuidance(workouts: Workout[]) {
  return useMemo(() => generateDayGuidance(workouts), [workouts]);
}

export function useCompatibility(a: Workout | null, b: Workout | null) {
  return useMemo(() => {
    if (!a || !b) return null;
    return evaluateCompatibility(a, b);
  }, [a, b]);
}
