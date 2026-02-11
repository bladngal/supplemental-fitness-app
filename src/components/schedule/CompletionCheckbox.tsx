'use client';

interface CompletionCheckboxProps {
  isCompleted: boolean;
  onComplete: () => void;
  disabled?: boolean;
}

export default function CompletionCheckbox({ isCompleted, onComplete, disabled }: CompletionCheckboxProps) {
  return (
    <button
      onClick={onComplete}
      disabled={isCompleted || disabled}
      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors touch-manipulation ${
        isCompleted
          ? 'bg-green-500 border-green-500 text-white'
          : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500'
      }`}
    >
      {isCompleted && (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )}
    </button>
  );
}
