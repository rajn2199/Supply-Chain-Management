"use client";

import Link from 'next/link';
import { Package } from 'lucide-react';

interface ProductCardProps {
  id: string | number;
  name: string;
  price: string;
  status: string;
}

export function ProductCard({ id, name, price, status }: ProductCardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl hover:card-shadow transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-surface-2 rounded-lg text-primary">
          <Package className="w-6 h-6" />
        </div>
        <span className="text-sm font-medium text-text-muted">#{id}</span>
      </div>
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-primary font-medium mb-4">${price}</p>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <span className="text-sm">{status}</span>
        <Link href={`/products/${id}`} className="text-sm text-primary hover:underline">
          View Details
        </Link>
      </div>
    </div>
  );
}
