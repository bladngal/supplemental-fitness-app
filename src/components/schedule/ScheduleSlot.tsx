import EffortPill from '@/components/ui/EffortPill';
import { Workout, ScheduleAssignment } from '@/types/database';

interface ScheduleSlotProps {
  assignment: ScheduleAssignment & { workout: Workout };
  onRemove?: (id: string) => void;
}

export default function ScheduleSlot({ assignment, onRemove }: ScheduleSlotProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate block">
          {assignment.workout.name}
        </span>
        <EffortPill effort={assignment.workout.perceived_effort} />
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(assignment.id)}
          className="text-gray-400 hover:text-red-500 touch-manipulation flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
