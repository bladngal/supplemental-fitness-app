'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EffortPill from '@/components/ui/EffortPill';
import InsightCard from '@/components/history/InsightCard';
import { CompletionLog, Workout } from '@/types/database';
import { getIntentLabel } from '@/lib/constants/intents';

interface CompletionWithWorkout extends CompletionLog {
  workout: Workout;
}

export default function HistoryPage() {
  const [completions, setCompletions] = useState<CompletionWithWorkout[]>([]);
  const [insights, setInsights] = useState<{ type: string; title: string; message: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(14);

  useEffect(() => {
    fetch(`/api/history?days=${days}`)
      .then(res => res.json())
      .then(data => {
        setCompletions(data.completions || []);
        setInsights(data.insights || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  // Group completions by date
  const grouped = completions.reduce<Record<string, CompletionWithWorkout[]>>((acc, c) => {
    const date = c.completed_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(c);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">History</h1>
        <div className="flex gap-1">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors touch-manipulation ${
                days === d
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

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

      {/* Timeline */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Timeline
        </h2>
        {sortedDates.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              No completions in the last {days} days.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedDates.map(date => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  {formatDate(date)}
                </h3>
                <div className="space-y-1.5">
                  {grouped[date].map(c => (
                    <Card key={c.id} padding="sm">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {c.workout?.name || 'Unknown'}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {c.workout && (
                              <>
                                <span className="text-xs text-gray-500">{getIntentLabel(c.workout.primary_intent)}</span>
                                <EffortPill effort={c.workout.perceived_effort} />
                              </>
                            )}
                            {c.context && (
                              <Badge variant="default">{c.context.replace('_', ' ')}</Badge>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(c.completed_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>
                      {c.felt_note && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">
                          &ldquo;{c.felt_note}&rdquo;
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
