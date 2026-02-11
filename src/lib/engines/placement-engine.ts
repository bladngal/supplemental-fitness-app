import { PlacementPreference, PrimaryIntent, PerceivedEffort, FatigueType } from '@/types/database';
import { PlacementInput } from './types';

// Placement logic based on intent, effort, fatigue type, and stress characteristics
export function recommendPlacement(input: PlacementInput): PlacementPreference {
  const { primary_intent, perceived_effort, fatigue_type, stress_impact, stress_breathing_hr } = input;

  // Very light work is generally flexible
  if (perceived_effort === 'very_light') {
    return 'flexible';
  }

  // Intent-based defaults
  const intentPlacements: Partial<Record<PrimaryIntent, PlacementPreference>> = {
    mobility: 'before_main',
    feel_good_regulation: 'flexible',
    rehab: 'before_main',
    skill_coordination: 'before_main',
    conditioning: 'after_main',
    strength_support: 'after_main',
  };

  // If the workout is system/CNS heavy or very taxing, prefer standalone
  if (fatigue_type === 'system_cns' && (perceived_effort === 'sneaky_hard' || perceived_effort === 'very_taxing')) {
    return 'standalone';
  }

  // High impact or heavy breathing before main lifts can compromise performance
  if (stress_impact && stress_breathing_hr && perceived_effort !== 'light_focused') {
    return 'standalone';
  }

  // Power work should be done fresh
  if (primary_intent === 'power_bone_density') {
    if (perceived_effort === 'very_taxing') return 'standalone';
    return 'before_main';
  }

  // Injury prevention — before if light, after if moderate+
  if (primary_intent === 'injury_prevention') {
    if (perceived_effort === 'moderate' || perceived_effort === 'sneaky_hard') return 'after_main';
    return 'before_main';
  }

  // Use intent default if available
  if (intentPlacements[primary_intent]) {
    return intentPlacements[primary_intent]!;
  }

  // Muscular fatigue types generally go after main work
  if (fatigue_type === 'muscular_tissue') {
    return 'after_main';
  }

  return 'flexible';
}

export function getPlacementLabel(placement: PlacementPreference): string {
  const labels: Record<PlacementPreference, string> = {
    before_main: 'Before main workout',
    after_main: 'After main workout',
    standalone: 'On its own',
    flexible: 'Flexible timing',
  };
  return labels[placement];
}

export function getPlacementRationale(input: PlacementInput, placement: PlacementPreference): string {
  const { primary_intent, perceived_effort, fatigue_type } = input;

  if (placement === 'standalone') {
    if (fatigue_type === 'system_cns') {
      return 'This likely draws on your central nervous system enough that pairing it with main training could compromise both. Consider doing it on a lighter day or with plenty of buffer.';
    }
    return 'The combined demands of this block suggest giving it its own timeslot for best results.';
  }

  if (placement === 'before_main') {
    if (primary_intent === 'mobility') {
      return 'Mobility work before training can help you access better positions and move more comfortably under load.';
    }
    if (primary_intent === 'skill_coordination') {
      return 'Coordination and skill work benefits from a fresh nervous system. Doing it before heavy work tends to produce better quality.';
    }
    if (primary_intent === 'power_bone_density') {
      return 'Power work requires neural freshness. Placing it early lets you move fast and absorb impact while your system is primed.';
    }
    return 'This type of work tends to benefit from being done while you\'re still fresh.';
  }

  if (placement === 'after_main') {
    if (primary_intent === 'strength_support') {
      return 'Accessory strength work pairs well after main lifts — the muscles are warm and you\'ve already done your priority work.';
    }
    if (primary_intent === 'conditioning') {
      return 'Conditioning after strength training lets you push your main lifts without pre-fatiguing your cardiovascular system.';
    }
    return 'This fits naturally after your main session when the targeted areas are warm.';
  }

  if (placement === 'flexible') {
    if (perceived_effort === 'very_light') {
      return 'At this effort level, timing probably doesn\'t matter much. Fit it wherever works for your schedule.';
    }
    return 'This is fairly adaptable in terms of timing — before, after, or standalone should all work reasonably well.';
  }

  return '';
}
