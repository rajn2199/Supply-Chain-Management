"use client";

import { useState } from 'react';
import { Shield, Plus, Trash2 } from 'lucide-react';
import { useWriteContract } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';
import { TxButton } from '@/components/web3/TxButton';
import toast from 'react-hot-toast';
import { keccak256, toUtf8Bytes } from 'ethers';

export default function RolesPage() {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("MANUFACTURER");

  const mockRoles = [
    { address: "0x123...456", role: "MANUFACTURER", date: "2024-03-01" },
    { address: "0xabc...def", role: "DISTRIBUTOR", date: "2024-03-05" }
  ];

  const { writeContract, isPending } = useWriteContract();

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;
    
    try {
      const roleBytes = keccak256(toUtf8Bytes(role + "_ROLE"));
      writeContract({
        address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
        abi: SUPPLY_CHAIN_ABI,
        functionName: 'grantRole', // Note: Inherited from AccessControl
        args: [roleBytes, address as `0x${string}`],
      }, {
        onSuccess: () => {
          toast.success(`Granted ${role} to ${address.slice(0, 6)}...`);
          setAddress("");
        },
        onError: (err: any) => {
          toast.error(err.shortMessage || err.message || "Failed to grant role");
        }
      });
    } catch (err: any) {
      toast.error("Error formatting role bytes");
    }
  };

  return (
    <div className="animate-page space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Role Management</h1>
        <p className="text-text-muted">Admin panel for managing access control.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Grant New Role
        </h3>
        
        <form onSubmit={handleGrant} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Wallet Address (0x...)" 
            className="flex-1 bg-surface-2 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <select 
            className="bg-surface-2 border border-border rounded-lg py-2 px-4 focus:outline-none focus:border-primary"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="MANUFACTURER">Manufacturer</option>
            <option value="DISTRIBUTOR">Distributor</option>
            <option value="RETAILER">Retailer</option>
          </select>
          <TxButton 
            type="submit"
            isPending={isPending}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Grant
          </TxButton>
        </form>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-semibold">Active Roles</h3>
        </div>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface-2/50 text-text-muted">
            <tr>
              <th className="px-6 py-4 font-medium">Address</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Granted On</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockRoles.map((r, i) => (
              <tr key={i} className="hover:bg-surface-2/30 transition-colors">
                <td className="px-6 py-4 font-medium">{r.address}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-surface-2 border border-border rounded-full text-xs font-medium">
                    {r.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-muted">{r.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-error hover:text-error/80 p-2 rounded-lg hover:bg-error/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
