interface DayColumnProps {
  dayName: string;
  dayShort: string;
  isToday?: boolean;
  isMainWorkoutDay?: boolean;
  children: React.ReactNode;
}

export default function DayColumn({ dayName, dayShort, isToday, isMainWorkoutDay, children }: DayColumnProps) {
  return (
    <div className={`flex flex-col rounded-xl border p-2 min-h-[120px] ${
      isToday
        ? 'border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20'
        : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
    }`}>
      <div className="text-center mb-2">
        <div className={`text-xs font-medium ${
          isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {dayShort}
        </div>
        {isMainWorkoutDay && (
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mx-auto mt-1" title={`Main workout: ${dayName}`} />
        )}
      </div>
      <div className="flex-1 space-y-1">
        {children}
      </div>
    </div>
  );
}
