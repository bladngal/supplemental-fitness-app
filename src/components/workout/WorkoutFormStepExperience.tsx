'use client';

import { WorkoutFormData } from './WorkoutForm';

interface Props {
  data: WorkoutFormData;
  onChange: (updates: Partial<WorkoutFormData>) => void;
}

export default function StepExperience({ data, onChange }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
        Your lived experience
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        What have you noticed about this workout? How does it actually feel to do it?
        This is <strong>your authority</strong> — it always takes priority over engine classification.
      </p>
      <textarea
        value={data.lived_experience}
        onChange={(e) => onChange({ lived_experience: e.target.value })}
        placeholder="e.g., 'Feels easy in the moment but my shoulders are always sore the next day' or 'This one actually helps me feel better after heavy squat days'"
        rows={5}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
      />
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        Optional, but valuable. You can always add this later.
      </p>
    </div>
  );
}
