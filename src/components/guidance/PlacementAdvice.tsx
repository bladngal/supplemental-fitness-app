import GuidanceCallout from '@/components/ui/GuidanceCallout';
import { PlacementPreference, PrimaryIntent, PerceivedEffort, FatigueType } from '@/types/database';
import { getPlacementLabel, getPlacementRationale } from '@/lib/engines/placement-engine';

interface PlacementAdviceProps {
  placement: PlacementPreference;
  primaryIntent: PrimaryIntent;
  perceivedEffort: PerceivedEffort;
  fatigueType: FatigueType;
  stressImpact: boolean;
  stressBreathingHr: boolean;
}

export default function PlacementAdvice({
  placement,
  primaryIntent,
  perceivedEffort,
  fatigueType,
  stressImpact,
  stressBreathingHr,
}: PlacementAdviceProps) {
  const rationale = getPlacementRationale(
    {
      primary_intent: primaryIntent,
      perceived_effort: perceivedEffort,
      fatigue_type: fatigueType,
      stress_impact: stressImpact,
      stress_breathing_hr: stressBreathingHr,
    },
    placement
  );

  const variant = placement === 'standalone' ? 'caution' : 'info';

  return (
    <GuidanceCallout title={`Suggested: ${getPlacementLabel(placement)}`} variant={variant}>
      {rationale}
    </GuidanceCallout>
  );
}
