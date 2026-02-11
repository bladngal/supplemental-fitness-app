'use client';

import { useState, useEffect, useCallback } from 'react';
import { CompletionLog, Workout } from '@/types/database';

type CompletionWithWorkout = CompletionLog & { workout: Workout };

export function useHistory(days: number = 14) {
  const [completions, setCompletions] = useState<CompletionWithWorkout[]>([]);
  const [insights, setInsights] = useState<{ type: string; title: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/history?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setCompletions(data.completions || []);
      setInsights(data.insights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const logCompletion = useCallback(async (workoutId: string, context?: string, feltNote?: string) => {
    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout_id: workoutId,
          context: context || null,
          felt_note: feltNote || null,
        }),
      });
      if (res.ok) {
        fetchHistory();
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [fetchHistory]);

  return { completions, insights, loading, error, refetch: fetchHistory, logCompletion };
}
