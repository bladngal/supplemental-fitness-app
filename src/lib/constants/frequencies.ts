import { IntendedFrequency } from '@/types/database';

export interface FrequencyOption {
  value: IntendedFrequency;
  label: string;
  description: string;
}

export const FREQUENCIES: FrequencyOption[] = [
  {
    value: 'daily',
    label: 'Daily',
    description: 'Every day or nearly every day',
  },
  {
    value: '2_3_per_week',
    label: '2-3x per Week',
    description: 'A few times per week',
  },
  {
    value: '1_per_week',
    label: '1x per Week',
    description: 'Once per week',
  },
  {
    value: 'occasional',
    label: 'Occasional',
    description: 'As needed or when it fits',
  },
];

export function getFrequencyLabel(value: IntendedFrequency): string {
  return FREQUENCIES.find((f) => f.value === value)?.label ?? value;
}
