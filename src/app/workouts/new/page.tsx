'use client';

import WorkoutForm from '@/components/workout/WorkoutForm';

export default function NewWorkoutPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        New Workout
      </h1>
      <WorkoutForm />
    </div>
  );
}
