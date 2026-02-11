'use client';

import { Workout } from '@/types/database';
import { evaluateCompatibility, getCompatibilityColor, getCompatibilityLabel } from '@/lib/engines/compatibility-engine';
import Card from '@/components/ui/Card';
import GuidanceCallout from '@/components/ui/GuidanceCallout';

interface CompatibilityMatrixProps {
  workouts: Workout[];
}

export default function CompatibilityMatrix({ workouts }: CompatibilityMatrixProps) {
  if (workouts.length < 2) return null;

  // Generate pairwise comparisons
  const pairs: { a: Workout; b: Workout; result: ReturnType<typeof evaluateCompatibility> }[] = [];

  for (let i = 0; i < workouts.length; i++) {
    for (let j = i + 1; j < workouts.length; j++) {
      pairs.push({
        a: workouts[i],
        b: workouts[j],
        result: evaluateCompatibility(workouts[i], workouts[j]),
      });
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Compatibility
      </h3>
      {pairs.map((pair, i) => (
        <Card key={i} padding="sm">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{pair.a.name}</span>
            <span className="text-xs text-gray-400">&</span>
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{pair.b.name}</span>
          </div>
          <span className={`text-xs font-semibold ${getCompatibilityColor(pair.result.compatibility)}`}>
            {getCompatibilityLabel(pair.result.compatibility)}
          </span>
          {pair.result.reasons.length > 0 && (
            <ul className="mt-1.5 space-y-0.5">
              {pair.result.reasons.slice(0, 2).map((reason, j) => (
                <li key={j} className="text-xs text-gray-500 dark:text-gray-400">
                  {reason}
                </li>
              ))}
            </ul>
          )}
          {pair.result.suggestion && (
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
              {pair.result.suggestion}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
