'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { Workout, PrimaryIntent } from '@/types/database';
import { INTENTS } from '@/lib/constants/intents';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PrimaryIntent | ''>('');
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set('intent', filter);
    if (showArchived) params.set('archived', 'true');

    fetch(`/api/workouts?${params}`)
      .then(res => res.json())
      .then(data => setWorkouts(data.workouts || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, showArchived]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Library</h1>
        <Link href="/workouts/new">
          <Button size="sm">+ Add</Button>
        </Link>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        <button
          onClick={() => setFilter('')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors touch-manipulation ${
            filter === ''
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          All
        </button>
        {INTENTS.map(intent => (
          <button
            key={intent.value}
            onClick={() => setFilter(filter === intent.value ? '' : intent.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors touch-manipulation ${
              filter === intent.value
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {intent.emoji} {intent.label}
          </button>
        ))}
      </div>

      {/* Archive toggle */}
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
      >
        {showArchived ? 'Show active' : 'Show archived'}
      </button>

      {/* Workout list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : workouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {showArchived ? 'No archived workouts.' : 'No workouts yet.'}
          </p>
          {!showArchived && (
            <Link href="/workouts/new">
              <Button>Add your first workout</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {workouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}
