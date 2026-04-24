"use client";

import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';

export default function ActivityPage() {
  const transactions = [
    { id: "0x12...34", type: "Create Product", status: "Confirmed", time: "10 mins ago", hash: "0xabcdef1234567890" },
    { id: "0x56...78", type: "Transfer Ownership", status: "Pending", time: "2 mins ago", hash: "0x1234567890abcdef" },
    { id: "0x90...12", type: "Update Status", status: "Failed", time: "1 hour ago", hash: "0x9876543210fedcba" },
  ];

  return (
    <div className="animate-page space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity History</h1>
        <p className="text-text-muted">Your recent on-chain transactions and notifications.</p>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex gap-2">
          <button className="px-4 py-1.5 bg-surface-2 rounded-full text-sm font-medium border border-border">All</button>
          <button className="px-4 py-1.5 hover:bg-surface-2 rounded-full text-sm font-medium border border-transparent transition-colors">Pending</button>
          <button className="px-4 py-1.5 hover:bg-surface-2 rounded-full text-sm font-medium border border-transparent transition-colors">Confirmed</button>
          <button className="px-4 py-1.5 hover:bg-surface-2 rounded-full text-sm font-medium border border-transparent transition-colors">Failed</button>
        </div>

        <div className="divide-y divide-border">
          {transactions.map((tx, i) => (
            <div key={i} className="p-4 hover:bg-surface-2/30 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                {tx.status === 'Confirmed' && <CheckCircle2 className="w-6 h-6 text-success" />}
                {tx.status === 'Pending' && <Clock className="w-6 h-6 text-warning animate-pulse" />}
                {tx.status === 'Failed' && <XCircle className="w-6 h-6 text-error" />}
                
                <div>
                  <h4 className="font-medium">{tx.type}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-text-muted">{tx.time}</span>
                    <span className="text-text-muted/50">•</span>
                    <span className="text-sm text-primary hover:underline cursor-pointer flex items-center gap-1">
                      {tx.hash} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                {tx.status === 'Failed' && (
                  <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-2 transition-colors">
                    Retry
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
