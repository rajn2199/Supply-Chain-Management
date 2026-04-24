"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Package, Map, Settings, BarChart2, ActivitySquare } from 'lucide-react';
import clsx from 'clsx';

export function Sidebar() {
  const pathname = usePathname();
  
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
    <aside className="w-64 border-r border-border bg-surface-2 hidden md:block min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
          <Package className="w-5 h-5 text-bg" />
        </div>
        <span className="text-xl font-bold font-display">SupplyChain</span>
      </div>

      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
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
    </aside>
  );
}
