'use client';

import { EFFORTS } from '@/lib/constants/efforts';
import { WorkoutFormData } from './WorkoutForm';

interface Props {
  data: WorkoutFormData;
  onChange: (updates: Partial<WorkoutFormData>) => void;
}

export default function StepEffort({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        How hard does it feel?
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Your honest perceived effort — not what it &quot;should&quot; be.
      </p>
      <div className="space-y-2">
        {EFFORTS.map((effort) => {
          const isSelected = data.perceived_effort === effort.value;
          return (
            <button
              key={effort.value}
              type="button"
              onClick={() => onChange({ perceived_effort: effort.value })}
              className={`w-full p-4 rounded-xl border text-left transition-colors touch-manipulation ${
                isSelected
                  ? `border-current ${effort.bgColor}`
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className={`text-sm font-semibold ${isSelected ? effort.color : 'text-gray-900 dark:text-gray-100'}`}>
                    {effort.label}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {effort.description}
                  </p>
                </div>
                {isSelected && (
                  <div className={`w-5 h-5 rounded-full bg-current ${effort.color} flex items-center justify-center`}>
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
