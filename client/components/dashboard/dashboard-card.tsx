import { cn } from '@/lib/utils';

type DashboardCardProps = {
  title: string;
  value?: string | number;
  description?: string;
  className?: string;
};

export default function DashboardCard({ title, value, description, className }: DashboardCardProps) {
  return (
    <div className={cn('rounded-xl border border-white/10 bg-white/2 p-2', className)}>
      <p className="text-sm text-white/60">{title}</p>

      {value && <h2 className="mt-2 text-3xl font-bold">{value}</h2>}

      {description && <p className="mt-2 text-sm text-white/50">{description}</p>}
    </div>
  );
}
