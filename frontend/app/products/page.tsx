"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useSupplyChain } from '@/hooks/useSupplyChain';
import { TxButton } from '@/components/web3/TxButton';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageHash, setImageHash] = useState("");

  const { createProduct, isPending } = useSupplyChain();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(name, description, Number(price), Number(quantity), imageHash);
      toast.success("Transaction submitted!");
      setShowForm(false);
      // Reset form
      setName(""); setDescription(""); setPrice(""); setQuantity(""); setImageHash("");
    } catch (err: any) {
      toast.error(err.shortMessage || err.message || "Failed to create product");
    }
  };

  const mockProducts = [
    { id: 1, name: "Premium Laptop", status: "InTransit", price: "1200", date: "2024-03-10" },
    { id: 2, name: "Wireless Earbuds", status: "Delivered", price: "150", date: "2024-03-08" },
    { id: 3, name: "Smartwatch", status: "Created", price: "300", date: "2024-03-12" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Created': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'InTransit': return 'bg-warning/20 text-warning border-warning/30 animate-pulse-ring';
      case 'Delivered': return 'bg-success/20 text-success border-success/30';
      case 'Rejected': return 'bg-error/20 text-error border-error/30';
      default: return 'bg-surface-2 text-text-muted border-border';
    }
  };

  return (
    <div className="animate-page space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-text-muted">Manage and track your products.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-bg font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-hover transition-colors"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Create Product"}
        </button>
      </div>

      {showForm && (
        <div className="glass-panel p-6 rounded-xl animate-page">
          <h2 className="text-xl font-semibold mb-4">Create New Product</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Product Name" required className="bg-surface-2 border border-border rounded-lg p-3" value={name} onChange={e => setName(e.target.value)} />
            <input type="number" placeholder="Price (USD)" required className="bg-surface-2 border border-border rounded-lg p-3" value={price} onChange={e => setPrice(e.target.value)} />
            <input type="number" placeholder="Quantity" required className="bg-surface-2 border border-border rounded-lg p-3" value={quantity} onChange={e => setQuantity(e.target.value)} />
            <input type="text" placeholder="IPFS Image Hash (CID)" className="bg-surface-2 border border-border rounded-lg p-3" value={imageHash} onChange={e => setImageHash(e.target.value)} />
            <textarea placeholder="Description" required className="bg-surface-2 border border-border rounded-lg p-3 md:col-span-2" value={description} onChange={e => setDescription(e.target.value)} />
            <div className="md:col-span-2 flex justify-end mt-2">
              <TxButton isPending={isPending} type="submit">Create on Blockchain</TxButton>
            </div>
          </form>
        </div>
      )}

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search products by ID or name..."
              className="w-full bg-surface-2 border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-surface-2 border border-border rounded-lg text-sm flex items-center gap-2 hover:bg-surface transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface-2/50 text-text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Price (USD)</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="hover:bg-surface-2/30 transition-colors cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <td className="px-6 py-4 font-medium">#{product.id}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{product.date}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/products/${product.id}`} className="text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
