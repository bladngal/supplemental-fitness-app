'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EffortPill from '@/components/ui/EffortPill';
import FatigueIndicator from '@/components/ui/FatigueIndicator';
import GuidanceCallout from '@/components/ui/GuidanceCallout';
import InsightCard from '@/components/history/InsightCard';
import { Workout, ScheduleAssignment, CompletionLog } from '@/types/database';
import { getIntentLabel } from '@/lib/constants/intents';
import Link from 'next/link';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getTodayDow(): number {
  const jsDay = new Date().getDay(); // 0=Sunday
  return jsDay === 0 ? 6 : jsDay - 1; // 0=Monday
}

export default function DashboardPage() {
  const [assignments, setAssignments] = useState<(ScheduleAssignment & { workout: Workout })[]>([]);
  const [completions, setCompletions] = useState<CompletionLog[]>([]);
  const [insights, setInsights] = useState<{ type: string; title: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const todayDow = getTodayDow();

  const fetchData = useCallback(async () => {
    try {
      const [schedRes, histRes] = await Promise.all([
        fetch(`/api/schedule?day=${todayDow}`),
        fetch(`/api/history?days=7`),
      ]);

      if (schedRes.ok) {
        const data = await schedRes.json();
        setAssignments(data.assignments || []);
      }

      if (histRes.ok) {
        const data = await histRes.json();
        setCompletions(data.completions || []);
        setInsights(data.insights || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  }, [todayDow]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleComplete = async (workoutId: string) => {
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_id: workoutId,
          context: 'standalone',
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to log completion', err);
    }
  };

  const todayCompletedIds = completions
    .filter(c => c.completed_date === new Date().toISOString().split('T')[0])
    .map(c => c.workout_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {DAY_NAMES[todayDow]}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Today's scheduled workouts */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Today&apos;s Workouts
        </h2>
        {assignments.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No workouts scheduled for today.
            </p>
            <div className="flex justify-center">
              <Link href="/schedule">
                <Button variant="ghost" size="sm">Set up schedule</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {assignments.map((a) => {
              const isCompleted = todayCompletedIds.includes(a.workout_id);
              return (
                <Card key={a.id} className={isCompleted ? 'opacity-60' : ''}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <Link href={`/workouts/${a.workout.id}`} className="block">
                        <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${isCompleted ? 'line-through' : ''}`}>
                          {a.workout.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getIntentLabel(a.workout.primary_intent)}
                        </span>
                        <EffortPill effort={a.workout.perceived_effort} />
                        {a.workout.fatigue_type && (
                          <FatigueIndicator fatigueType={a.workout.fatigue_type} />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleComplete(a.workout_id)}
                      disabled={isCompleted}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors touch-manipulation ${
                        isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                      }`}
                    >
                      {isCompleted && (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Insights
          </h2>
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <InsightCard key={i} type={insight.type} title={insight.title} message={insight.message} />
            ))}
          </div>
        </section>
      )}

      {/* Quick guidance */}
      <GuidanceCallout title="Coach's note" variant="info">
        Supplemental work is meant to complement your main training. If you&apos;re feeling run down,
        it&apos;s okay to skip or lighten the load on supplemental blocks.
      </GuidanceCallout>
    </div>
  );
}
