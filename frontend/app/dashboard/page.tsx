"use client";

import { useAccount } from 'wagmi';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRole } from '@/hooks/useRole';

export default function DashboardPage() {
  const { address } = useAccount();
  const { isManufacturer } = useRole();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stats = [
    { label: "Total Products", value: "142", icon: Package, color: "text-primary" },
    { label: "In Transit", value: "24", icon: Truck, color: "text-warning" },
    { label: "Delivered", value: "112", icon: CheckCircle, color: "text-success" },
    { label: "Rejected", value: "6", icon: XCircle, color: "text-error" }
  ];

  return (
    <div className="animate-page space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-muted">
          Welcome back {address ? `${address.slice(0,6)}...` : ""}. 
          {isManufacturer && " You have Manufacturer privileges."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold font-display">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-surface-2 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl min-h-[400px]">
          <h3 className="text-xl font-semibold mb-6">Recent Shipments</h3>
          <div className="flex flex-col items-center justify-center h-64 text-text-muted">
            <Truck className="w-12 h-12 mb-4 opacity-20" />
            <p>Connect your wallet to view real-time shipments</p>
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl min-h-[400px]">
          <h3 className="text-xl font-semibold mb-6">Activity Feed</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 border-b border-border pb-4 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Product #10{i} status updated</p>
                  <p className="text-xs text-text-muted">2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
