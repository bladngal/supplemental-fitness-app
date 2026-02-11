import Link from 'next/link';
import Card from '@/components/ui/Card';
import EffortPill from '@/components/ui/EffortPill';
import FatigueIndicator from '@/components/ui/FatigueIndicator';
import Badge from '@/components/ui/Badge';
import { Workout } from '@/types/database';
import { getIntentLabel } from '@/lib/constants/intents';

interface WorkoutCardProps {
  workout: Workout;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  return (
    <Link href={`/workouts/${workout.id}`}>
      <Card className="hover:border-gray-300 dark:hover:border-gray-700 transition-colors active:bg-gray-50 dark:active:bg-gray-800/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {workout.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant="blue">{getIntentLabel(workout.primary_intent)}</Badge>
              <EffortPill effort={workout.perceived_effort} />
              {workout.fatigue_type && (
                <FatigueIndicator fatigueType={workout.fatigue_type} />
              )}
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
