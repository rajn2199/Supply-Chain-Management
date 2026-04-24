"use client";

import { useAccount } from 'wagmi';

export function NetworkBadge() {
  const { chain } = useAccount();

  if (!chain) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border text-sm font-medium">
      <div className={`w-2 h-2 rounded-full ${chain.id === 1 ? 'bg-blue-500' : 'bg-green-500'}`} />
      {chain.name}
    </div>
  );
}
