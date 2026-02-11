import { Workout } from '@/types/database';
import { FatigueClassification } from './types';

export interface GuidanceNote {
  title: string;
  message: string;
  variant: 'info' | 'caution' | 'positive';
}

// Generate coach-like probabilistic language about a workout
export function generateWorkoutGuidance(workout: Workout, classification?: FatigueClassification): GuidanceNote[] {
  const notes: GuidanceNote[] = [];

  // Sneaky hard warning
  if (workout.perceived_effort === 'sneaky_hard') {
    notes.push({
      title: 'Watch the accumulation',
      message: 'You\'ve flagged this as "sneaky hard" — it might feel manageable in the moment but could add up over a week. Keep an eye on how you feel by day 3-4.',
      variant: 'caution',
    });
  }

  // Very taxing + high frequency
  if (workout.perceived_effort === 'very_taxing' && workout.intended_frequency === 'daily') {
    notes.push({
      title: 'That\'s a lot of volume',
      message: 'Daily sessions of something genuinely taxing is ambitious. This might work short-term, but consider whether 3-4x/week would give you better quality sessions.',
      variant: 'caution',
    });
  }

  // System/CNS fatigue notes
  if (classification?.fatigue_type === 'system_cns') {
    notes.push({
      title: 'Central nervous system demand',
      message: 'This block likely draws on your CNS more than your muscles. You might not feel sore, but you could notice slower reactions or reduced motivation if you stack too many of these.',
      variant: 'info',
    });
  }

  // Low confidence classification
  if (classification?.confidence === 'low') {
    notes.push({
      title: 'Hard to classify',
      message: 'The engine doesn\'t have strong signal on this one — the fatigue classification is a rough estimate. Your lived experience is especially important here.',
      variant: 'info',
    });
  }

  // Multiple stress characteristics
  const stressCount = [
    workout.stress_impact,
    workout.stress_tendons,
    workout.stress_localized_muscle,
    workout.stress_breathing_hr,
    workout.stress_coordination,
  ].filter(Boolean).length;

  if (stressCount >= 4) {
    notes.push({
      title: 'Multi-system demand',
      message: 'This hits a lot of different stress channels. It\'s not necessarily bad, but it means recovery touches many systems. Give yourself credit for the total load.',
      variant: 'caution',
    });
  }

  // Positive notes
  if (workout.perceived_effort === 'very_light' && workout.intended_frequency === 'daily') {
    notes.push({
      title: 'Low-friction habit',
      message: 'Light, daily work like this can be really powerful over time. Consistency matters more than intensity for these types of blocks.',
      variant: 'positive',
    });
  }

  if (workout.primary_intent === 'feel_good_regulation') {
    notes.push({
      title: 'Not just fluff',
      message: 'Regulation work is real training. It supports your nervous system and can actually improve performance on your harder days.',
      variant: 'positive',
    });
  }

  // Lived experience emphasis
  if (workout.lived_experience) {
    notes.push({
      title: 'Your experience',
      message: workout.lived_experience,
      variant: 'info',
    });
  }

  return notes;
}

// Generate day-level guidance for a set of workouts scheduled together
export function generateDayGuidance(workouts: Workout[]): GuidanceNote[] {
  const notes: GuidanceNote[] = [];

  if (workouts.length === 0) return notes;

  // Count total load
  const effortWeights: Record<string, number> = {
    very_light: 1,
    light_focused: 2,
    moderate: 3,
    sneaky_hard: 4,
    very_taxing: 5,
  };

  const totalLoad = workouts.reduce((sum, w) => sum + (effortWeights[w.perceived_effort] || 0), 0);

  if (totalLoad >= 12) {
    notes.push({
      title: 'Heavy supplemental day',
      message: 'The combined effort of today\'s supplemental blocks is substantial. Consider whether you need all of them, or if some could move to a lighter day.',
      variant: 'caution',
    });
  }

  // Count system-heavy workouts
  const systemCount = workouts.filter(w => w.fatigue_type === 'system_cns').length;
  if (systemCount >= 2) {
    notes.push({
      title: 'Multiple CNS demands',
      message: 'You have more than one system-heavy block today. This can sneak up on you — watch for signs like slower reaction time or reduced motivation.',
      variant: 'caution',
    });
  }

  if (totalLoad <= 4 && workouts.length <= 2) {
    notes.push({
      title: 'Light day',
      message: 'Today\'s supplemental load is pretty light — a good day to focus on quality and consistency.',
      variant: 'positive',
    });
  }

  return notes;
}
