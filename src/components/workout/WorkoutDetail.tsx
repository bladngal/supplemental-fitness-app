'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EffortPill from '@/components/ui/EffortPill';
import FatigueIndicator from '@/components/ui/FatigueIndicator';
import GuidanceCallout from '@/components/ui/GuidanceCallout';
import { Workout } from '@/types/database';
import { getIntentLabel, INTENTS } from '@/lib/constants/intents';
import { getFrequencyLabel } from '@/lib/constants/frequencies';
import { STRESS_TYPES } from '@/lib/constants/stress-types';
import { getPlacementLabel, getPlacementRationale } from '@/lib/engines/placement-engine';
import { classifyFatigue } from '@/lib/engines/fatigue-classifier';
import { generateWorkoutGuidance } from '@/lib/engines/guidance-generator';

interface WorkoutDetailProps {
  workout: Workout;
}

export default function WorkoutDetail({ workout }: WorkoutDetailProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const classification = classifyFatigue({
    primary_intent: workout.primary_intent,
    perceived_effort: workout.perceived_effort,
    stress_impact: workout.stress_impact,
    stress_tendons: workout.stress_tendons,
    stress_localized_muscle: workout.stress_localized_muscle,
    stress_breathing_hr: workout.stress_breathing_hr,
    stress_coordination: workout.stress_coordination,
  });

  const guidanceNotes = generateWorkoutGuidance(workout, classification);
  const intentInfo = INTENTS.find(i => i.value === workout.primary_intent);
  const activeStress = STRESS_TYPES.filter(s => workout[s.key]);

  const handleDelete = async () => {
    if (!confirm('Delete this workout? This cannot be undone.')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/workouts/${workout.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/workouts');
        router.refresh();
      }
    } catch {
      setDeleting(false);
    }
  };

  const handleArchive = async () => {
    await fetch(`/api/workouts/${workout.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...workout, is_archived: !workout.is_archived }),
    });
    router.refresh();
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {workout.name}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="blue">{getIntentLabel(workout.primary_intent)}</Badge>
            <EffortPill effort={workout.perceived_effort} />
            {workout.fatigue_type && (
              <FatigueIndicator fatigueType={workout.fatigue_type} />
            )}
          </div>
        </div>
      </div>

      {/* Lived experience — always first (user authority) */}
      {workout.lived_experience && (
        <Card>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Your Experience
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
            &ldquo;{workout.lived_experience}&rdquo;
          </p>
        </Card>
      )}

      {/* Classification details */}
      <Card>
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Classification
        </h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Fatigue type</span>
            <div className="mt-0.5">
              {workout.fatigue_type ? (
                <FatigueIndicator fatigueType={workout.fatigue_type} size="md" />
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Placement</span>
            <p className="text-gray-900 dark:text-gray-100 font-medium mt-0.5">
              {workout.placement_preference ? getPlacementLabel(workout.placement_preference) : '—'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Frequency</span>
            <p className="text-gray-900 dark:text-gray-100 font-medium mt-0.5">
              {getFrequencyLabel(workout.intended_frequency)}
            </p>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Confidence</span>
            <p className="text-gray-900 dark:text-gray-100 font-medium mt-0.5 capitalize">
              {classification.confidence}
            </p>
          </div>
        </div>
      </Card>

      {/* Stress characteristics */}
      {activeStress.length > 0 && (
        <Card>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Stress Profile
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {activeStress.map(s => (
              <Badge key={s.key}>{s.label}</Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Placement rationale */}
      {workout.placement_preference && (
        <GuidanceCallout title="Placement suggestion" variant="info">
          {getPlacementRationale(
            {
              primary_intent: workout.primary_intent,
              perceived_effort: workout.perceived_effort,
              fatigue_type: workout.fatigue_type || 'mixed',
              stress_impact: workout.stress_impact,
              stress_breathing_hr: workout.stress_breathing_hr,
            },
            workout.placement_preference
          )}
        </GuidanceCallout>
      )}

      {/* Engine guidance notes */}
      {guidanceNotes
        .filter(n => n.title !== 'Your experience')
        .map((note, i) => (
          <GuidanceCallout key={i} title={note.title} variant={note.variant}>
            {note.message}
          </GuidanceCallout>
        ))}

      {/* Notes */}
      {workout.notes && (
        <Card>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
            Notes
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{workout.notes}</p>
        </Card>
      )}

      {/* Links */}
      {workout.links && workout.links.length > 0 && (
        <Card>
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Links
          </h3>
          <div className="space-y-1">
            {workout.links.map((link, i) => (
              <a
                key={i}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
              >
                {link}
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          onClick={() => router.push(`/workouts/${workout.id}?edit=true`)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button variant="ghost" onClick={handleArchive}>
          {workout.is_archived ? 'Unarchive' : 'Archive'}
        </Button>
        <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? '...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
}
