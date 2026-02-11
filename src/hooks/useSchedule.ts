'use client';

import { useState, useEffect, useCallback } from 'react';
import { ScheduleAssignment, Workout } from '@/types/database';

type AssignmentWithWorkout = ScheduleAssignment & { workout: Workout };

export function useSchedule(day?: number) {
  const [assignments, setAssignments] = useState<AssignmentWithWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = day !== undefined ? `?day=${day}` : '';
      const res = await fetch(`/api/schedule${params}`);
      if (!res.ok) throw new Error('Failed to fetch schedule');
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [day]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return { assignments, loading, error, refetch: fetchSchedule };
}
