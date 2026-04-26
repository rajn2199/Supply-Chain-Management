"use client";

import { useState } from 'react';
import { ShieldCheck, Package, User, Clock, QrCode } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEnsName, useReadContract } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';
import { useProductHistory } from '@/hooks/useProductHistory';
import { useSupplyChain } from '@/hooks/useSupplyChain';
import { TxButton } from '@/components/web3/TxButton';
import toast from 'react-hot-toast';
import { formatDate, formatAddress } from '@/lib/utils';
import { Timeline } from '@/components/supply-chain/Timeline';

const STATUS_LABELS: Record<number, string> = {
  0: 'Created',
  1: 'In Transit',
  2: 'In Warehouse',
  3: 'Delivered',
  4: 'Rejected',
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { history, isVerified, isLoading } = useProductHistory(productId);
  const { transferOwnership, isPending: isTransferring } = useSupplyChain();

  const [newOwner, setNewOwner] = useState("");
  const [transferLocation, setTransferLocation] = useState("");
  const [transferNotes, setTransferNotes] = useState("");

  const { data: productData, error: productError } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'products',
    args: [BigInt(productId)],
    chainId: 31337,
  });

  const { data: currentOwner, error: ownerError } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'productOwners',
    args: [BigInt(productId)],
    chainId: 31337,
  });

  const { data: ensName } = useEnsName({
    address: currentOwner as `0x${string}`,
    chainId: 1, // ENS is on mainnet
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await transferOwnership(Number(productId), newOwner, transferLocation, transferNotes);
      toast.success("Transfer submitted!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to transfer";
      toast.error(message);
    }
  };

  if (productError) {
    return <div className="p-8 text-error">Error loading product: {productError.message}</div>;
  }
  if (ownerError) {
    return <div className="p-8 text-error">Error loading owner: {ownerError.message}</div>;
  }

  return (
    <div className="animate-page space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Product #{productId}</h1>
          <p className="text-text-muted">Detailed provenance and ownership history.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-border bg-surface-2 rounded-lg flex items-center gap-2 hover:bg-surface transition-colors">
            <QrCode className="w-4 h-4" />
            Show QR
          </button>
          <div className={`px-4 py-2 text-bg font-semibold rounded-lg flex items-center gap-2 ${isVerified ? 'bg-success' : 'bg-surface-2 text-text-muted border border-border'}`}>
            <ShieldCheck className="w-4 h-4" /> 
            {isVerified ? "Verified Authentic" : isLoading ? "Checking..." : "Unverified"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-text-muted mb-1">Name</p>
                <p className="font-medium">{productData ? productData[1] : "..."}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Status</p>
                <p className="font-medium text-warning">{productData ? (STATUS_LABELS[Number(productData[7])] ?? productData[7].toString()) : "..."}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Price</p>
                <p className="font-medium">{productData ? `$${Number(productData[4]).toLocaleString()}` : "..."}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted mb-1">Quantity</p>
                <p className="font-medium">{productData ? productData[5].toString() : "..."}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-text-muted mb-1">Description</p>
                <p className="font-medium">{productData ? productData[2] : "..."}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              History
            </h3>
            <div className="space-y-6">
              {history && history.length > 0 ? (
                <Timeline steps={history.map((h: { notes: string; location: string; from: string; to: string; timestamp: bigint }) => ({
                  title: h.notes,
                  description: `${h.location} • From: ${formatAddress(h.from)} To: ${formatAddress(h.to)}`,
                  date: formatDate(h.timestamp.toString()),
                  completed: true
                }))} />
              ) : (
                <p className="text-text-muted">No history found or loading...</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Current Owner
            </h3>
            <div className="p-4 bg-surface-2 rounded-lg border border-border break-all">
              <p className="text-sm font-medium">{ensName ? `${ensName} (${currentOwner})` : currentOwner || "Loading..."}</p>
            </div>
            
            <form onSubmit={handleTransfer} className="mt-6 space-y-4">
              <h4 className="text-sm font-medium">Transfer Ownership</h4>
              <input type="text" placeholder="New Owner Address" required className="w-full bg-surface-2 border border-border rounded-lg p-2 text-sm" value={newOwner} onChange={e => setNewOwner(e.target.value)} />
              <input type="text" placeholder="Location" required className="w-full bg-surface-2 border border-border rounded-lg p-2 text-sm" value={transferLocation} onChange={e => setTransferLocation(e.target.value)} />
              <input type="text" placeholder="Notes" className="w-full bg-surface-2 border border-border rounded-lg p-2 text-sm" value={transferNotes} onChange={e => setTransferNotes(e.target.value)} />
              <TxButton isPending={isTransferring} className="w-full text-sm py-2">Submit Transfer</TxButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
