import { FatigueType } from '@/types/database';

interface FatigueIndicatorProps {
  fatigueType: FatigueType;
  size?: 'sm' | 'md';
}

const configs: Record<FatigueType, { label: string; color: string; bg: string }> = {
  muscular_tissue: {
    label: 'Muscular / Tissue',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  mixed: {
    label: 'Mixed',
    color: 'text-purple-700 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/40',
  },
  system_cns: {
    label: 'System / CNS',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-100 dark:bg-red-900/40',
  },
};

export default function FatigueIndicator({ fatigueType, size = 'sm' }: FatigueIndicatorProps) {
  const config = configs[fatigueType];
  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.bg} ${config.color} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
