"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Package, Map, Settings, BarChart2, ActivitySquare } from 'lucide-react';
import clsx from 'clsx';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  if (pathname === '/') return null;

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Track', href: '/track', icon: Map },
    { name: 'Analytics', href: '/analytics', icon: BarChart2 },
    { name: 'Activity', href: '/activity', icon: ActivitySquare },
    { name: 'Admin', href: '/admin/roles', icon: Settings },
  ];

  return (
    <>
      <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 text-text-muted hover:text-text focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="md:hidden font-bold font-display text-lg">SupplyChain</span>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton showBalance={false} />
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-bg/95 backdrop-blur-sm border-t border-border overflow-y-auto">
          <nav className="p-4 space-y-2">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-text-muted hover:bg-surface hover:text-text"
                  )}
                >
                  <link.icon className={clsx("w-5 h-5", isActive ? "text-primary" : "text-text-muted")} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
