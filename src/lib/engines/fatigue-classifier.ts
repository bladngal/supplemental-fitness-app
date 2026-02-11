import { PrimaryIntent, PerceivedEffort, FatigueType } from '@/types/database';
import { WorkoutInput, FatigueClassification, FatigueClassifier } from './types';

// Base muscular/system scores per intent
const INTENT_BASE_SCORES: Record<PrimaryIntent, { muscular: number; system: number }> = {
  rehab: { muscular: 6, system: 1 },
  injury_prevention: { muscular: 5, system: 2 },
  strength_support: { muscular: 7, system: 3 },
  power_bone_density: { muscular: 4, system: 7 },
  skill_coordination: { muscular: 2, system: 6 },
  mobility: { muscular: 4, system: 1 },
  conditioning: { muscular: 3, system: 6 },
  feel_good_regulation: { muscular: 2, system: 2 },
};

// Effort multipliers — system scales faster at higher efforts
const EFFORT_MULTIPLIERS: Record<PerceivedEffort, { muscular: number; system: number }> = {
  very_light: { muscular: 0.5, system: 0.3 },
  light_focused: { muscular: 0.7, system: 0.5 },
  moderate: { muscular: 1.0, system: 1.0 },
  sneaky_hard: { muscular: 1.2, system: 1.6 }, // Disproportionate system impact
  very_taxing: { muscular: 1.5, system: 1.8 },
};

// Stress characteristic adjustments
const STRESS_ADJUSTMENTS = {
  stress_impact: { muscular: 1, system: 2 },
  stress_tendons: { muscular: 2, system: 1 },
  stress_localized_muscle: { muscular: 3, system: 0 },
  stress_breathing_hr: { muscular: 0, system: 3 },
  stress_coordination: { muscular: 0, system: 2 },
};

function classifyType(muscularRatio: number): FatigueType {
  if (muscularRatio > 0.65) return 'muscular_tissue';
  if (muscularRatio < 0.35) return 'system_cns';
  return 'mixed';
}

function assessConfidence(totalScore: number, muscularRatio: number): 'high' | 'moderate' | 'low' {
  // Higher total scores and more extreme ratios = higher confidence
  if (totalScore > 10 && (muscularRatio > 0.75 || muscularRatio < 0.25)) return 'high';
  if (totalScore > 5) return 'moderate';
  return 'low';
}

class RuleBasedFatigueClassifier implements FatigueClassifier {
  classify(input: WorkoutInput): FatigueClassification {
    const base = INTENT_BASE_SCORES[input.primary_intent];
    const mult = EFFORT_MULTIPLIERS[input.perceived_effort];

    // Apply base scores with effort multipliers
    let muscular = base.muscular * mult.muscular;
    let system = base.system * mult.system;

    // Apply stress characteristic adjustments
    for (const [key, adj] of Object.entries(STRESS_ADJUSTMENTS)) {
      if (input[key as keyof WorkoutInput]) {
        muscular += adj.muscular;
        system += adj.system;
      }
    }

    const total = muscular + system;
    const muscularRatio = total > 0 ? muscular / total : 0.5;

    return {
      fatigue_type: classifyType(muscularRatio),
      muscular_score: Math.round(muscular * 10) / 10,
      system_score: Math.round(system * 10) / 10,
      total_score: Math.round(total * 10) / 10,
      muscular_ratio: Math.round(muscularRatio * 100) / 100,
      confidence: assessConfidence(total, muscularRatio),
    };
  }
}

// Singleton instance
const classifier = new RuleBasedFatigueClassifier();

// Convenience function
export function classifyFatigue(input: WorkoutInput): FatigueClassification {
  return classifier.classify(input);
}

export { RuleBasedFatigueClassifier };
