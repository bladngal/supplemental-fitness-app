import { PrimaryIntent, PerceivedEffort, FatigueType, PlacementPreference } from '@/types/database';

export interface WorkoutInput {
  primary_intent: PrimaryIntent;
  perceived_effort: PerceivedEffort;
  stress_impact: boolean;
  stress_tendons: boolean;
  stress_localized_muscle: boolean;
  stress_breathing_hr: boolean;
  stress_coordination: boolean;
}

export interface FatigueClassification {
  fatigue_type: FatigueType;
  muscular_score: number;
  system_score: number;
  total_score: number;
  muscular_ratio: number;
  confidence: 'high' | 'moderate' | 'low';
}

export interface PlacementInput {
  primary_intent: PrimaryIntent;
  perceived_effort: PerceivedEffort;
  fatigue_type: FatigueType;
  stress_impact: boolean;
  stress_breathing_hr: boolean;
}

export interface CompatibilityResult {
  compatibility: 'complementary' | 'neutral' | 'potential_interference' | 'likely_interference';
  reasons: string[];
  suggestion: string;
}

export interface DayFatigueLoad {
  totalScore: number;
  borderClass: string;
  dotColor: string;
}

export interface FatigueClassifier {
  classify(input: WorkoutInput): FatigueClassification;
}
