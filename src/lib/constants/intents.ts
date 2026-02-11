import { PrimaryIntent } from '@/types/database';

export interface IntentOption {
  value: PrimaryIntent;
  label: string;
  description: string;
  emoji: string;
}

export const INTENTS: IntentOption[] = [
  {
    value: 'rehab',
    label: 'Rehab',
    description: 'Recovery from injury or managing chronic issues',
    emoji: '🩹',
  },
  {
    value: 'injury_prevention',
    label: 'Injury Prevention',
    description: 'Proactive work to prevent future problems',
    emoji: '🛡️',
  },
  {
    value: 'strength_support',
    label: 'Strength Support',
    description: 'Accessory work that supports main lifts',
    emoji: '💪',
  },
  {
    value: 'power_bone_density',
    label: 'Power & Bone Density',
    description: 'Plyometrics, jumps, impact work',
    emoji: '⚡',
  },
  {
    value: 'skill_coordination',
    label: 'Skill & Coordination',
    description: 'Balance, agility, movement quality',
    emoji: '🎯',
  },
  {
    value: 'mobility',
    label: 'Mobility',
    description: 'Flexibility, range of motion, joint health',
    emoji: '🧘',
  },
  {
    value: 'conditioning',
    label: 'Conditioning',
    description: 'Cardio, endurance, work capacity',
    emoji: '🫀',
  },
  {
    value: 'feel_good_regulation',
    label: 'Feel-Good / Regulation',
    description: 'Stress relief, nervous system regulation, mood',
    emoji: '✨',
  },
];

export function getIntentLabel(value: PrimaryIntent): string {
  return INTENTS.find((i) => i.value === value)?.label ?? value;
}
