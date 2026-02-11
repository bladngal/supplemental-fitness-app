export type PrimaryIntent =
  | 'rehab'
  | 'injury_prevention'
  | 'strength_support'
  | 'power_bone_density'
  | 'skill_coordination'
  | 'mobility'
  | 'conditioning'
  | 'feel_good_regulation';

export type PerceivedEffort =
  | 'very_light'
  | 'light_focused'
  | 'moderate'
  | 'sneaky_hard'
  | 'very_taxing';

export type IntendedFrequency =
  | 'daily'
  | '2_3_per_week'
  | '1_per_week'
  | 'occasional';

export type FatigueType = 'muscular_tissue' | 'mixed' | 'system_cns';

export type PlacementPreference =
  | 'before_main'
  | 'after_main'
  | 'standalone'
  | 'flexible';

export type CompletionContext = 'before_main' | 'after_main' | 'standalone';

export type MainWorkoutType = 'strength' | 'cardio' | 'mixed';

export type DayName =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Workout {
  id: string;
  name: string;
  links: string[];
  notes: string | null;
  primary_intent: PrimaryIntent;
  perceived_effort: PerceivedEffort;
  stress_impact: boolean;
  stress_tendons: boolean;
  stress_localized_muscle: boolean;
  stress_breathing_hr: boolean;
  stress_coordination: boolean;
  intended_frequency: IntendedFrequency;
  lived_experience: string | null;
  fatigue_type: FatigueType | null;
  placement_preference: PlacementPreference | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduleAssignment {
  id: string;
  workout_id: string;
  day_of_week: number; // 0=Monday, 6=Sunday
  slot_order: number;
  is_active: boolean;
  workout?: Workout;
}

export interface CompletionLog {
  id: string;
  workout_id: string;
  completed_at: string;
  completed_date: string;
  context: CompletionContext | null;
  felt_note: string | null;
  workout?: Workout;
}

export interface AppSettings {
  id: number;
  pin_hash: string;
  main_workout_days: DayName[];
  main_workout_type: MainWorkoutType;
}
