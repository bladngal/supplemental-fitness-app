'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EffortPill from '@/components/ui/EffortPill';
import GuidanceCallout from '@/components/ui/GuidanceCallout';
import { Workout, ScheduleAssignment, PerceivedEffort } from '@/types/database';
import { getIntentLabel } from '@/lib/constants/intents';
import { generateDayGuidance } from '@/lib/engines/guidance-generator';
import { computeDayFatigueLoad } from '@/lib/engines/fatigue-classifier';

const EFFORT_DOT_COLORS: Record<PerceivedEffort, string> = {
  very_light: 'bg-green-400',
  light_focused: 'bg-lime-400',
  moderate: 'bg-yellow-400',
  sneaky_hard: 'bg-orange-400',
  very_taxing: 'bg-red-400',
};

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

    const dayFatigue = computeDayFatigueLoad(dayWorkouts);

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
          {dayWorkouts.length > 0 && (
            <span className={`w-2.5 h-2.5 rounded-full ${dayFatigue.dotColor}`} title={`Fatigue load: ${dayFatigue.totalScore}`} />
          )}
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

      <div
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-1 px-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {DAYS.map(day => {
          const dayAssignments = getAssignmentsForDay(day.dow);
          const dayWorkouts = dayAssignments.map(a => a.workout).filter(Boolean);
          const isToday = day.dow === todayDow;
          const fatigue = computeDayFatigueLoad(dayWorkouts);

          return (
            <button
              key={day.dow}
              onClick={() => setSelectedDay(day.dow)}
              className={`min-w-[160px] flex-shrink-0 snap-start rounded-xl border-l-4 p-3 text-left transition-colors touch-manipulation ${fatigue.borderClass} ${
                isToday
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-400/30'
                  : 'bg-white dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-sm font-semibold ${
                    isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                  }`}>
                    {day.short}
                  </span>
                  {isToday && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                      Today
                    </span>
                  )}
                </div>
                <span className="text-gray-400 dark:text-gray-600 text-lg leading-none">+</span>
              </div>

              <div className="space-y-1">
                {dayAssignments.map(a => (
                  <div key={a.id} className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${EFFORT_DOT_COLORS[a.workout.perceived_effort] || 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate leading-tight">
                      {a.workout.name}
                    </span>
                  </div>
                ))}
                {dayAssignments.length === 0 && (
                  <p className="text-[11px] text-gray-400 dark:text-gray-600 italic">No workouts</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <GuidanceCallout title="Fatigue heat map" variant="info">
        Look at the fatigue heat on each day. If you see red or orange accents stacking up, you may be
        concentrating too much demanding supplemental work on certain days. Spreading different fatigue
        types across the week tends to work better.
      </GuidanceCallout>
    </div>
  );
}
