interface GuidanceCalloutProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'info' | 'caution' | 'positive';
}

export default function GuidanceCallout({ title, children, variant = 'info' }: GuidanceCalloutProps) {
  const variants = {
    info: 'bg-sky-50 border-sky-200 dark:bg-sky-950/30 dark:border-sky-800',
    caution: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    positive: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800',
  };

  const titleColors = {
    info: 'text-sky-800 dark:text-sky-300',
    caution: 'text-amber-800 dark:text-amber-300',
    positive: 'text-emerald-800 dark:text-emerald-300',
  };

  return (
    <div className={`rounded-xl border p-4 ${variants[variant]}`}>
      {title && (
        <p className={`text-sm font-semibold mb-1 ${titleColors[variant]}`}>{title}</p>
      )}
      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
