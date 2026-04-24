"use client";

import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass: string;
}

export function KPICard({ label, value, icon: Icon, colorClass }: KPICardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl flex items-center justify-between hover:card-shadow transition-shadow">
      <div>
        <p className="text-sm text-text-muted mb-1">{label}</p>
        <h3 className="text-3xl font-bold font-display">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg bg-surface-2 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
