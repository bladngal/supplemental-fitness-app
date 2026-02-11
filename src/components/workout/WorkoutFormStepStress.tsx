'use client';

import { STRESS_TYPES } from '@/lib/constants/stress-types';
import { WorkoutFormData } from './WorkoutForm';

interface Props {
  data: WorkoutFormData;
  onChange: (updates: Partial<WorkoutFormData>) => void;
}

export default function StepStress({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        What kind of stress does it create?
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Select all that apply. This helps classify the fatigue footprint.
      </p>
      <div className="space-y-2">
        {STRESS_TYPES.map((stress) => {
          const isSelected = data[stress.key] as boolean;
          return (
            <button
              key={stress.key}
              type="button"
              onClick={() => onChange({ [stress.key]: !isSelected })}
              className={`w-full p-3 rounded-xl border text-left transition-colors touch-manipulation flex items-center gap-3 ${
                isSelected
                  ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {isSelected && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </div>
              <div>
                <span className={`text-sm font-medium ${
                  isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {stress.label}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stress.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
