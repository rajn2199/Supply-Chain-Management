"use client";

import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineStep {
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative">
      <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-border"></div>
      <div className="space-y-6">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex gap-6 items-start animate-slide-in-left" style={{ animationDelay: `${idx * 150}ms` }}>
            <div className="relative z-10 w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center shrink-0 mt-1">
              {step.completed ? (
                <CheckCircle2 className="w-6 h-6 text-primary bg-bg rounded-full" />
              ) : (
                <Circle className="w-4 h-4 text-text-muted" />
              )}
            </div>
            <div>
              <h4 className={cn("font-medium", !step.completed && "text-text-muted")}>{step.title}</h4>
              <p className="text-sm text-text-muted mt-1">{step.description}</p>
              <p className="text-xs text-text-muted/60 mt-1">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
