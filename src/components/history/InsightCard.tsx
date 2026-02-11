import Card from '@/components/ui/Card';

interface InsightCardProps {
  type: string;
  title: string;
  message: string;
}

const typeConfig: Record<string, { icon: string; color: string }> = {
  consistency: { icon: '📊', color: 'text-blue-600 dark:text-blue-400' },
  fatigue: { icon: '⚠️', color: 'text-amber-600 dark:text-amber-400' },
  missed: { icon: '📋', color: 'text-gray-600 dark:text-gray-400' },
  streak: { icon: '🔥', color: 'text-orange-600 dark:text-orange-400' },
  positive: { icon: '✅', color: 'text-green-600 dark:text-green-400' },
};

export default function InsightCard({ type, title, message }: InsightCardProps) {
  const config = typeConfig[type] || typeConfig.consistency;

  return (
    <Card padding="sm">
      <div className="flex gap-3">
        <span className="text-lg flex-shrink-0">{config.icon}</span>
        <div>
          <h3 className={`text-sm font-semibold ${config.color}`}>{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{message}</p>
        </div>
      </div>
    </Card>
  );
}
