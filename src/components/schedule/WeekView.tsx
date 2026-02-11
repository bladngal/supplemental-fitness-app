'use client';

import DayColumn from '@/components/ui/DayColumn';
import { ScheduleAssignment, Workout } from '@/types/database';

const DAYS = [
  { dow: 0, short: 'Mon', full: 'Monday' },
  { dow: 1, short: 'Tue', full: 'Tuesday' },
  { dow: 2, short: 'Wed', full: 'Wednesday' },
  { dow: 3, short: 'Thu', full: 'Thursday' },
  { dow: 4, short: 'Fri', full: 'Friday' },
  { dow: 5, short: 'Sat', full: 'Saturday' },
  { dow: 6, short: 'Sun', full: 'Sunday' },
];

interface WeekViewProps {
  assignments: (ScheduleAssignment & { workout: Workout })[];
  mainWorkoutDays?: string[];
  onDayClick?: (dow: number) => void;
}

function getTodayDow(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default function WeekView({ assignments, mainWorkoutDays = [], onDayClick }: WeekViewProps) {
  const todayDow = getTodayDow();

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {DAYS.map(day => {
        const dayAssignments = assignments.filter(a => a.day_of_week === day.dow);
        const isMainDay = mainWorkoutDays.includes(day.full.toLowerCase());

        return (
          <div key={day.dow} onClick={() => onDayClick?.(day.dow)} className="cursor-pointer">
            <DayColumn
              dayName={day.full}
              dayShort={day.short}
              isToday={day.dow === todayDow}
              isMainWorkoutDay={isMainDay}
            >
              {dayAssignments.map(a => (
                <div key={a.id} className="text-[10px] text-gray-700 dark:text-gray-300 truncate">
                  {a.workout.name}
                </div>
              ))}
            </DayColumn>
          </div>
        );
      })}
    </div>
  );
}
