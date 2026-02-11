'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout, PrimaryIntent } from '@/types/database';

interface UseWorkoutsOptions {
  intent?: PrimaryIntent | '';
  archived?: boolean;
}

export function useWorkouts(options: UseWorkoutsOptions = {}) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (options.intent) params.set('intent', options.intent);
      if (options.archived) params.set('archived', 'true');

      const res = await fetch(`/api/workouts?${params}`);
      if (!res.ok) throw new Error('Failed to fetch workouts');
      const data = await res.json();
      setWorkouts(data.workouts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [options.intent, options.archived]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refetch: fetchWorkouts };
}
