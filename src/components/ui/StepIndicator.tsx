interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === currentStep
              ? 'w-6 bg-blue-600 dark:bg-blue-400'
              : i < currentStep
              ? 'w-1.5 bg-blue-300 dark:bg-blue-700'
              : 'w-1.5 bg-gray-200 dark:bg-gray-700'
          }`}
        />
      ))}
    </div>
  );
}
