'use client';

import { WorkoutFormData } from './WorkoutForm';

interface Props {
  data: WorkoutFormData;
  onChange: (updates: Partial<WorkoutFormData>) => void;
}

export default function StepBasic({ data, onChange }: Props) {
  const handleAddLink = () => {
    onChange({ links: [...data.links, ''] });
  };

  const handleLinkChange = (index: number, value: string) => {
    const updated = [...data.links];
    updated[index] = value;
    onChange({ links: updated });
  };

  const handleRemoveLink = (index: number) => {
    onChange({ links: data.links.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          What&apos;s this workout called?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Give it a name you&apos;ll recognize in your library.
        </p>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g., Shoulder rehab circuit"
          className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Links / References (optional)
        </label>
        {data.links.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="url"
              value={link}
              onChange={(e) => handleLinkChange(i, e.target.value)}
              placeholder="https://..."
              className="flex-1 h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => handleRemoveLink(i)}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddLink}
          className="text-sm text-blue-600 dark:text-blue-400 font-medium touch-manipulation"
        >
          + Add link
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={data.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Any setup notes, cues, or reminders..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
}
