"use client";

import { useState } from 'react';
import { Search, MapPin, PackageCheck, Truck, Factory, ShieldCheck, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useProductHistory } from '@/hooks/useProductHistory';
import { formatAddress, formatDate } from '@/lib/utils';
import { useReadContract } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';

export default function TrackPage() {
  const [searchId, setSearchId] = useState("");
  const [submittedId, setSubmittedId] = useState("");

  const { history, isVerified, isLoading } = useProductHistory(submittedId);
  const { data: productData } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'products',
    args: submittedId ? [BigInt(submittedId)] : undefined,
    query: {
      enabled: !!submittedId,
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;
    setSubmittedId(searchId);
  };

  return (
    <div className="max-w-4xl mx-auto animate-page space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Track Shipment</h1>
        <p className="text-text-muted text-lg">Enter a product ID or scan a QR code to view its provenance.</p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all"></div>
        <div className="relative flex items-center bg-surface-2 border border-border p-2 rounded-2xl">
          <div className="pl-4 pr-2 text-text-muted">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="Enter Product ID (e.g., 10294)"
            className="flex-1 bg-transparent border-none text-lg py-3 focus:outline-none focus:ring-0 placeholder-text-muted"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button 
            type="submit"
            disabled={isLoading || !searchId}
            className="bg-primary text-bg font-semibold px-8 py-3 rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Searching..." : "Track"}
          </button>
        </div>
      </form>

      {productData && productData[0] !== 0n && (
        <div className="mt-12 animate-page">
          <div className="glass-panel p-6 md:p-8 rounded-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-sm text-text-muted mb-1">Product #{submittedId}</p>
              <h2 className="text-3xl font-bold mb-3">{productData[1]}</h2>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-warning/20 text-warning border border-warning/30 rounded-full text-sm font-medium animate-pulse-ring">
                  Status Code: {productData[7].toString()}
                </span>
                {isVerified ? (
                  <span className="flex items-center gap-1 text-success text-sm font-medium">
                    <ShieldCheck className="w-4 h-4" /> Authentic
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-error text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" /> Unverified
                  </span>
                )}
              </div>
            </div>
            <div className="text-right w-full md:w-auto">
              <button className="w-full md:w-auto px-4 py-2 border border-border rounded-lg text-sm hover:bg-surface-2 transition-colors">
                View on Etherscan
              </button>
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h3 className="text-xl font-semibold mb-8">Provenance Timeline</h3>
            <div className="relative">
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border"></div>
              
              <div className="space-y-8">
                {history && history.map((step: any, idx: number) => (
                  <div key={idx} className="relative flex gap-6 items-start animate-slide-in-left" style={{ animationDelay: `${idx * 150}ms` }}>
                    <div className={clsx(
                      "relative z-10 w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-4 border-surface",
                      "bg-primary text-bg"
                    )}>
                      <PackageCheck className="w-6 h-6" />
                    </div>
                    <div className="pt-2 flex-1">
                      <h4 className="text-lg font-semibold">
                        {step.notes}
                      </h4>
                      <p className="text-text-muted mt-1">{step.location} • From: {formatAddress(step.from)}</p>
                      <p className="text-sm text-text-muted/60 mt-1">{formatDate(step.timestamp.toString())}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
