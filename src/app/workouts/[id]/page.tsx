'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import WorkoutDetail from '@/components/workout/WorkoutDetail';
import WorkoutForm from '@/components/workout/WorkoutForm';
import { Workout } from '@/types/database';

export default function WorkoutDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const isEditing = searchParams.get('edit') === 'true';
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/workouts/${params.id}`)
      .then(res => res.json())
      .then(data => setWorkout(data.workout))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Workout not found.</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Edit Workout
        </h1>
        <WorkoutForm
          mode="edit"
          workoutId={workout.id}
          initialData={{
            name: workout.name,
            links: workout.links || [],
            notes: workout.notes || '',
            primary_intent: workout.primary_intent,
            perceived_effort: workout.perceived_effort,
            stress_impact: workout.stress_impact,
            stress_tendons: workout.stress_tendons,
            stress_localized_muscle: workout.stress_localized_muscle,
            stress_breathing_hr: workout.stress_breathing_hr,
            stress_coordination: workout.stress_coordination,
            intended_frequency: workout.intended_frequency,
            lived_experience: workout.lived_experience || '',
          }}
        />
      </div>
    );
  }

  return <WorkoutDetail workout={workout} />;
}
