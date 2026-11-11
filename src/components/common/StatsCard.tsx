import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: 'blue' | 'navy' | 'green' | 'amber';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'blue',
}) => {
  const iconVariantStyles = {
    blue: 'bg-[#EFF6FF] text-[#2563EB] border-blue-100',
    navy: 'bg-slate-100 text-[#16324F] border-slate-200',
    green: 'bg-green-50 text-[#16A34A] border-green-100',
    amber: 'bg-amber-50 text-[#EAB308] border-amber-100',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block truncate">
            {title}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-[#16324F] tabular-nums">
              {value}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold tabular-nums px-1.5 py-0.5 rounded ${
                  trend.isPositive
                    ? 'text-[#16A34A] bg-green-50'
                    : 'text-[#DC2626] bg-red-50'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-[#64748B] truncate">{subtitle}</p>
          )}
        </div>
        <div className={`p-2.5 rounded-xl border shrink-0 ${iconVariantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
