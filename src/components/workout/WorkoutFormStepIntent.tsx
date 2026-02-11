'use client';

import { INTENTS } from '@/lib/constants/intents';
import { PrimaryIntent } from '@/types/database';
import { WorkoutFormData } from './WorkoutForm';

interface Props {
  data: WorkoutFormData;
  onChange: (updates: Partial<WorkoutFormData>) => void;
}

export default function StepIntent({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        What&apos;s the primary intent?
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Pick the main reason you do this workout.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {INTENTS.map((intent) => {
          const isSelected = data.primary_intent === intent.value;
          return (
            <button
              key={intent.value}
              type="button"
              onClick={() => onChange({ primary_intent: intent.value })}
              className={`p-3 rounded-xl border text-left transition-colors touch-manipulation ${
                isSelected
                  ? 'border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-lg mb-1 block">{intent.emoji}</span>
              <span className={`text-sm font-medium block ${
                isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {intent.label}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block mt-0.5">
                {intent.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
