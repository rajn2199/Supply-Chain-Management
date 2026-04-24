"use client";

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TxButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isPending: boolean;
  children: React.ReactNode;
}

export function TxButton({ isPending, children, className, ...props }: TxButtonProps) {
  return (
    <button
      className={cn(
        "bg-primary text-bg font-semibold px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2",
        isPending ? "opacity-70 cursor-not-allowed animate-pulse-ring" : "hover:bg-primary-hover",
        className
      )}
      disabled={isPending || props.disabled}
      {...props}
    >
      {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
      {isPending ? "Waiting for confirmation..." : children}
    </button>
  );
}
