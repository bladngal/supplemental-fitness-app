'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EffortPill from '@/components/ui/EffortPill';
import GuidanceCallout from '@/components/ui/GuidanceCallout';
import { Workout, ScheduleAssignment } from '@/types/database';
import { getIntentLabel } from '@/lib/constants/intents';
import { generateDayGuidance } from '@/lib/engines/guidance-generator';

const DAYS = [
  { dow: 0, short: 'Mon', full: 'Monday' },
  { dow: 1, short: 'Tue', full: 'Tuesday' },
  { dow: 2, short: 'Wed', full: 'Wednesday' },
  { dow: 3, short: 'Thu', full: 'Thursday' },
  { dow: 4, short: 'Fri', full: 'Friday' },
  { dow: 5, short: 'Sat', full: 'Saturday' },
  { dow: 6, short: 'Sun', full: 'Sunday' },
];

function getTodayDow(): number {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export default function SchedulePage() {
  const [assignments, setAssignments] = useState<(ScheduleAssignment & { workout: Workout })[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDay, setAddingDay] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const todayDow = getTodayDow();

  const fetchData = useCallback(async () => {
    try {
      const [schedRes, workoutsRes] = await Promise.all([
        fetch('/api/schedule'),
        fetch('/api/workouts'),
      ]);

      if (schedRes.ok) {
        const data = await schedRes.json();
        setAssignments(data.assignments || []);
      }
      if (workoutsRes.ok) {
        const data = await workoutsRes.json();
        setWorkouts(data.workouts || []);
      }
    } catch (err) {
      console.error('Failed to load schedule', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddToDay = async (workoutId: string, day: number) => {
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workout_id: workoutId, day_of_week: day }),
      });
      if (res.ok) {
        setAddingDay(null);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to add assignment', err);
    }
  };

  const handleRemove = async (assignmentId: string) => {
    try {
      await fetch(`/api/schedule?id=${assignmentId}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Failed to remove assignment', err);
    }
  };

  const getAssignmentsForDay = (dow: number) => {
    return assignments.filter(a => a.day_of_week === dow);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Day detail view
  if (selectedDay !== null) {
    const dayAssignments = getAssignmentsForDay(selectedDay);
    const dayWorkouts = dayAssignments.map(a => a.workout).filter(Boolean);
    const dayGuidance = generateDayGuidance(dayWorkouts);
    const day = DAYS[selectedDay];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelectedDay(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 touch-manipulation">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{day.full}</h1>
          {selectedDay === todayDow && <Badge variant="blue">Today</Badge>}
        </div>

        {dayGuidance.map((note, i) => (
          <GuidanceCallout key={i} title={note.title} variant={note.variant}>
            {note.message}
          </GuidanceCallout>
        ))}

        {dayAssignments.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No workouts scheduled.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {dayAssignments.map(a => (
              <Card key={a.id}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{a.workout.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-xs text-gray-500">{getIntentLabel(a.workout.primary_intent)}</span>
                      <EffortPill effort={a.workout.perceived_effort} />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(a.id)}
                    className="text-gray-400 hover:text-red-500 touch-manipulation p-1"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Button
          variant="secondary"
          onClick={() => setAddingDay(selectedDay)}
          className="w-full"
        >
          + Add workout
        </Button>

        {/* Add workout modal */}
        {addingDay === selectedDay && (
          <Card>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Choose a workout</h3>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {workouts.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">No workouts in library yet.</p>
              ) : (
                workouts.map(w => (
                  <button
                    key={w.id}
                    onClick={() => handleAddToDay(w.id, selectedDay)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{w.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{getIntentLabel(w.primary_intent)}</span>
                  </button>
                ))
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setAddingDay(null)} className="mt-2">
              Cancel
            </Button>
          </Card>
        )}
      </div>
    );
  }

  // Week overview
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Schedule</h1>

      <div className="grid grid-cols-7 gap-1.5">
        {DAYS.map(day => {
          const dayAssignments = getAssignmentsForDay(day.dow);
          const isToday = day.dow === todayDow;

          return (
            <button
              key={day.dow}
              onClick={() => setSelectedDay(day.dow)}
              className={`rounded-xl border p-2 min-h-[100px] text-left transition-colors touch-manipulation ${
                isToday
                  ? 'border-blue-300 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-950/20'
                  : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              <div className={`text-xs font-medium text-center mb-1.5 ${
                isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {day.short}
              </div>
              <div className="space-y-0.5">
                {dayAssignments.slice(0, 3).map(a => (
                  <div key={a.id} className="text-[10px] text-gray-700 dark:text-gray-300 truncate leading-tight">
                    {a.workout.name}
                  </div>
                ))}
                {dayAssignments.length > 3 && (
                  <div className="text-[10px] text-gray-400">+{dayAssignments.length - 3}</div>
                )}
                {dayAssignments.length === 0 && (
                  <div className="text-[10px] text-gray-300 dark:text-gray-700 text-center">—</div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <GuidanceCallout title="Scheduling tip" variant="info">
        Tap a day to see details and add workouts. Try to spread demanding blocks across the week
        rather than stacking them on the same day.
      </GuidanceCallout>
    </div>
  );
}
