'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/ui/StepIndicator';
import Button from '@/components/ui/Button';
import StepBasic from './WorkoutFormStepBasic';
import StepIntent from './WorkoutFormStepIntent';
import StepEffort from './WorkoutFormStepEffort';
import StepStress from './WorkoutFormStepStress';
import StepFrequency from './WorkoutFormStepFrequency';
import StepExperience from './WorkoutFormStepExperience';
import { Workout, PrimaryIntent, PerceivedEffort, IntendedFrequency } from '@/types/database';

export interface WorkoutFormData {
  name: string;
  links: string[];
  notes: string;
  primary_intent: PrimaryIntent | '';
  perceived_effort: PerceivedEffort | '';
  stress_impact: boolean;
  stress_tendons: boolean;
  stress_localized_muscle: boolean;
  stress_breathing_hr: boolean;
  stress_coordination: boolean;
  intended_frequency: IntendedFrequency | '';
  lived_experience: string;
}

const INITIAL_DATA: WorkoutFormData = {
  name: '',
  links: [],
  notes: '',
  primary_intent: '',
  perceived_effort: '',
  stress_impact: false,
  stress_tendons: false,
  stress_localized_muscle: false,
  stress_breathing_hr: false,
  stress_coordination: false,
  intended_frequency: '',
  lived_experience: '',
};

interface WorkoutFormProps {
  initialData?: Partial<WorkoutFormData>;
  workoutId?: string;
  mode?: 'create' | 'edit';
}

const TOTAL_STEPS = 6;

export default function WorkoutForm({ initialData, workoutId, mode = 'create' }: WorkoutFormProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WorkoutFormData>({ ...INITIAL_DATA, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const updateData = (updates: Partial<WorkoutFormData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 0: return data.name.trim().length > 0;
      case 1: return data.primary_intent !== '';
      case 2: return data.perceived_effort !== '';
      case 3: return true; // Stress is optional
      case 4: return data.intended_frequency !== '';
      case 5: return true; // Experience is optional
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');

    try {
      const url = mode === 'edit' ? `/api/workouts/${workoutId}` : '/api/workouts';
      const method = mode === 'edit' ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }

      const result = await res.json();
      router.push(`/workouts/${result.workout.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout');
    } finally {
      setSaving(false);
    }
  };

  const stepComponents = [
    <StepBasic key="basic" data={data} onChange={updateData} />,
    <StepIntent key="intent" data={data} onChange={updateData} />,
    <StepEffort key="effort" data={data} onChange={updateData} />,
    <StepStress key="stress" data={data} onChange={updateData} />,
    <StepFrequency key="frequency" data={data} onChange={updateData} />,
    <StepExperience key="experience" data={data} onChange={updateData} />,
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {step + 1} of {TOTAL_STEPS}
        </span>
      </div>

      <div className="min-h-[300px]">
        {stepComponents[step]}
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <div className="flex gap-3">
        {step > 0 && (
          <Button variant="secondary" onClick={handleBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!canAdvance() || saving}
          className="flex-1"
        >
          {saving ? 'Saving...' : step === TOTAL_STEPS - 1 ? (mode === 'edit' ? 'Save Changes' : 'Add Workout') : 'Next'}
        </Button>
      </div>
    </div>
  );
}
