import { PerceivedEffort } from '@/types/database';
import { getEffortOption } from '@/lib/constants/efforts';

interface EffortPillProps {
  effort: PerceivedEffort;
  size?: 'sm' | 'md';
}

export default function EffortPill({ effort, size = 'sm' }: EffortPillProps) {
  const option = getEffortOption(effort);
  if (!option) return null;

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${option.bgColor} ${option.color} ${sizeClasses}`}>
      {option.label}
    </span>
  );
}
