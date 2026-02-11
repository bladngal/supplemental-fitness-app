'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export default function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors touch-manipulation ${
        checked
          ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'
      }`}
    >
      <div
        className={`w-10 h-6 rounded-full relative transition-colors flex-shrink-0 ${
          checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
        )}
      </div>
    </button>
  );
}
