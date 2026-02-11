import { Workout, FatigueType } from '@/types/database';
import { CompatibilityResult } from './types';

// Evaluate whether two workouts complement or interfere with each other
export function evaluateCompatibility(a: Workout, b: Workout): CompatibilityResult {
  const reasons: string[] = [];
  let score = 0; // positive = complementary, negative = interfering

  // Same fatigue type stacking
  if (a.fatigue_type && b.fatigue_type && a.fatigue_type === b.fatigue_type) {
    if (a.fatigue_type === 'system_cns') {
      score -= 3;
      reasons.push('Both workouts load the central nervous system — stacking them could accumulate more systemic fatigue than expected.');
    } else if (a.fatigue_type === 'muscular_tissue') {
      score -= 1;
      reasons.push('Both target muscular/tissue fatigue — watch for overlapping muscle groups.');
    }
  }

  // Different fatigue types can complement
  if (a.fatigue_type && b.fatigue_type && a.fatigue_type !== b.fatigue_type && a.fatigue_type !== 'mixed' && b.fatigue_type !== 'mixed') {
    score += 2;
    reasons.push('These load different systems, which tends to spread fatigue more evenly.');
  }

  // High effort stacking
  const highEfforts = ['sneaky_hard', 'very_taxing'];
  if (highEfforts.includes(a.perceived_effort) && highEfforts.includes(b.perceived_effort)) {
    score -= 3;
    reasons.push('Stacking two demanding blocks on the same day may be more taxing than either alone suggests.');
  }

  // Complementary intents
  const complementaryPairs: [string, string][] = [
    ['mobility', 'strength_support'],
    ['mobility', 'power_bone_density'],
    ['feel_good_regulation', 'conditioning'],
    ['rehab', 'mobility'],
  ];
  for (const [x, y] of complementaryPairs) {
    if ((a.primary_intent === x && b.primary_intent === y) || (a.primary_intent === y && b.primary_intent === x)) {
      score += 2;
      reasons.push(`${getIntentName(x)} and ${getIntentName(y)} tend to complement each other well.`);
    }
  }

  // Overlapping stress types
  const stressKeys = ['stress_impact', 'stress_tendons', 'stress_localized_muscle', 'stress_breathing_hr', 'stress_coordination'] as const;
  let overlapCount = 0;
  for (const key of stressKeys) {
    if (a[key] && b[key]) overlapCount++;
  }
  if (overlapCount >= 3) {
    score -= 2;
    reasons.push('These share multiple stress characteristics, which may concentrate fatigue in similar ways.');
  } else if (overlapCount === 0) {
    score += 1;
    reasons.push('No overlapping stress characteristics — good separation of demands.');
  }

  // Impact + breathing stacking
  if (a.stress_impact && a.stress_breathing_hr && b.stress_impact && b.stress_breathing_hr) {
    score -= 2;
    reasons.push('Both involve impact and elevated heart rate — this combination can be particularly taxing on joints and the cardiovascular system.');
  }

  // Determine overall compatibility
  let compatibility: CompatibilityResult['compatibility'];
  if (score >= 3) compatibility = 'complementary';
  else if (score >= 0) compatibility = 'neutral';
  else if (score >= -2) compatibility = 'potential_interference';
  else compatibility = 'likely_interference';

  const suggestion = generateSuggestion(compatibility, a, b);

  return { compatibility, reasons, suggestion };
}

function generateSuggestion(
  compatibility: CompatibilityResult['compatibility'],
  a: Workout,
  b: Workout
): string {
  switch (compatibility) {
    case 'complementary':
      return `These two blocks work well together. Stacking them on the same day is probably fine.`;
    case 'neutral':
      return `No strong signal either way. Stacking these should be okay, but pay attention to how you feel.`;
    case 'potential_interference':
      return `There's some overlap in what these demand. Consider spacing them out or doing one lighter if they're on the same day.`;
    case 'likely_interference':
      return `These might compete for similar recovery resources. If possible, separate them by at least a day, or be prepared to scale one back.`;
  }
}

function getIntentName(intent: string): string {
  const names: Record<string, string> = {
    rehab: 'Rehab',
    injury_prevention: 'Injury Prevention',
    strength_support: 'Strength Support',
    power_bone_density: 'Power & Bone Density',
    skill_coordination: 'Skill & Coordination',
    mobility: 'Mobility',
    conditioning: 'Conditioning',
    feel_good_regulation: 'Feel-Good / Regulation',
  };
  return names[intent] || intent;
}

export function getCompatibilityColor(compatibility: CompatibilityResult['compatibility']): string {
  switch (compatibility) {
    case 'complementary': return 'text-green-600 dark:text-green-400';
    case 'neutral': return 'text-gray-600 dark:text-gray-400';
    case 'potential_interference': return 'text-amber-600 dark:text-amber-400';
    case 'likely_interference': return 'text-red-600 dark:text-red-400';
  }
}

export function getCompatibilityLabel(compatibility: CompatibilityResult['compatibility']): string {
  switch (compatibility) {
    case 'complementary': return 'Complementary';
    case 'neutral': return 'Neutral';
    case 'potential_interference': return 'Possible interference';
    case 'likely_interference': return 'Likely interference';
  }
}
