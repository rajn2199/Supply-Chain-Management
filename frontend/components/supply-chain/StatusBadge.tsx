"use client";

import { cn } from '@/lib/utils';

export function StatusBadge({ status }: { status: string }) {
  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'Created': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'InTransit': return 'bg-warning/20 text-warning border-warning/30 animate-pulse-ring';
      case 'Delivered': return 'bg-success/20 text-success border-success/30';
      case 'Rejected': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-surface-2 text-text-muted border-border';
    }
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs border font-medium", getStatusStyle(status))}>
      {status}
    </span>
  );
}
