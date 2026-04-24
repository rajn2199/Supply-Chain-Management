"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Package, ShieldCheck, MapPin, Activity } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-page">
      <div className="absolute top-4 right-4 z-50">
        <ConnectButton />
      </div>

      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
          Track. Verify. <span className="text-primary">Trust.</span><br />
          On-Chain.
        </h1>
        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
          The next-generation supply chain management platform built on Ethereum. 
          Tamper-proof tracking, real-time status updates, and absolute transparency.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/dashboard" className="bg-primary text-bg font-semibold px-8 py-4 rounded-lg hover:bg-primary-hover transition-colors shadow-[0_0_20px_rgba(0,196,204,0.3)]">
            Launch Dashboard
          </Link>
          <Link href="/track" className="bg-surface border border-border text-text font-semibold px-8 py-4 rounded-lg hover:bg-surface-2 transition-colors">
            Track a Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 w-full">
        {[
          { icon: Package, title: 'Tamper-Proof', desc: 'Immutable records on the blockchain.' },
          { icon: Activity, title: 'Real-Time', desc: 'Live status and location tracking.' },
          { icon: ShieldCheck, title: 'Verified', desc: 'Instant authenticity verification.' },
          { icon: MapPin, title: 'Role-Based', desc: 'Secure access control for all parties.' },
        ].map((feature, i) => (
          <div key={i} className="glass-panel p-6 rounded-xl text-left animate-slide-in-left" style={{ animationDelay: `${i * 100}ms` }}>
            <feature.icon className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-text-muted">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
