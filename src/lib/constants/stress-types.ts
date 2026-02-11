export interface StressType {
  key: 'stress_impact' | 'stress_tendons' | 'stress_localized_muscle' | 'stress_breathing_hr' | 'stress_coordination';
  label: string;
  description: string;
}

export const STRESS_TYPES: StressType[] = [
  {
    key: 'stress_impact',
    label: 'Impact / Joints',
    description: 'Landing forces, jumping, weighted carries',
  },
  {
    key: 'stress_tendons',
    label: 'Tendons / Connective',
    description: 'Slow eccentrics, isometrics, heavy loading patterns',
  },
  {
    key: 'stress_localized_muscle',
    label: 'Localized Muscle',
    description: 'Isolation work, targeted muscle fatigue',
  },
  {
    key: 'stress_breathing_hr',
    label: 'Breathing / Heart Rate',
    description: 'Elevated HR, breathing challenge, cardio demand',
  },
  {
    key: 'stress_coordination',
    label: 'Coordination / CNS',
    description: 'Complex movements, balance challenge, skill demand',
  },
];
