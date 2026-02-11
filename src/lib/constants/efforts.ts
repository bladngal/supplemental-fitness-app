import { PerceivedEffort } from '@/types/database';

export interface EffortOption {
  value: PerceivedEffort;
  label: string;
  description: string;
  color: string;
  bgColor: string;
}

export const EFFORTS: EffortOption[] = [
  {
    value: 'very_light',
    label: 'Very Light',
    description: 'Barely registers — could do this tired or sore',
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/40',
  },
  {
    value: 'light_focused',
    label: 'Light but Focused',
    description: 'Low fatigue, but requires attention and form',
    color: 'text-lime-700 dark:text-lime-400',
    bgColor: 'bg-lime-100 dark:bg-lime-900/40',
  },
  {
    value: 'moderate',
    label: 'Moderate',
    description: 'Noticeable effort — you know you did something',
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
  },
  {
    value: 'sneaky_hard',
    label: 'Sneaky Hard',
    description: 'Feels manageable but accumulates more than expected',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/40',
  },
  {
    value: 'very_taxing',
    label: 'Very Taxing',
    description: 'Genuinely fatiguing — needs recovery consideration',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
  },
];

export function getEffortLabel(value: PerceivedEffort): string {
  return EFFORTS.find((e) => e.value === value)?.label ?? value;
}

export function getEffortOption(value: PerceivedEffort): EffortOption | undefined {
  return EFFORTS.find((e) => e.value === value);
}
