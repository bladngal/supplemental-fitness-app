'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EffortPill from '@/components/ui/EffortPill';
import { CompletionLog, Workout } from '@/types/database';
import { getIntentLabel } from '@/lib/constants/intents';

interface CompletionWithWorkout extends CompletionLog {
  workout: Workout;
}

interface HistoryTimelineProps {
  completions: CompletionWithWorkout[];
}

export default function HistoryTimeline({ completions }: HistoryTimelineProps) {
  // Group by date
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

  if (sortedDates.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
          No completions to show.
        </p>
      </Card>
    );
  }

  return (
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
  );
}
