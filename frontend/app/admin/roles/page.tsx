"use client";

import { useState } from 'react';
import { Shield, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useWriteContract, useReadContract, useAccount, useWatchContractEvent } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';
import { TxButton } from '@/components/web3/TxButton';
import toast from 'react-hot-toast';
import { keccak256, encodePacked } from 'viem';

// Pre-compute role hashes to match the Solidity keccak256("ROLE_NAME") pattern
const ROLE_HASHES: Record<string, `0x${string}`> = {
  MANUFACTURER: keccak256(encodePacked(['string'], ['MANUFACTURER_ROLE'])),
  DISTRIBUTOR: keccak256(encodePacked(['string'], ['DISTRIBUTOR_ROLE'])),
  RETAILER: keccak256(encodePacked(['string'], ['RETAILER_ROLE'])),
};


interface GrantedRole {
  address: string;
  role: string;
  roleHash: `0x${string}`;
  date: string;
}

export default function RolesPage() {
  const [address, setAddress] = useState("");
  const [role, setRole] = useState<string>("MANUFACTURER");
  const [grantedRoles, setGrantedRoles] = useState<GrantedRole[]>([]);
  const { address: connectedAddress } = useAccount();

  const { writeContract, isPending } = useWriteContract();

  // Check if connected user is admin
  const { data: isAdmin } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'hasRole',
    args: [
      '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`, // DEFAULT_ADMIN_ROLE
      connectedAddress as `0x${string}`
    ],
    chainId: 31337,
    query: {
      enabled: !!connectedAddress,
    }
  });

  // Watch for RoleGranted events to update the list
  useWatchContractEvent({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    eventName: 'RoleGranted',
    onLogs() {
      toast.success("Role granted on-chain!");
    },
  });

  // Watch for RoleRevoked events
  useWatchContractEvent({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    eventName: 'RoleRevoked',
    onLogs() {
      toast.success("Role revoked on-chain!");
    },
  });

  const handleGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    const roleHash = ROLE_HASHES[role];
    if (!roleHash) {
      toast.error("Unknown role selected");
      return;
    }

    writeContract({
      address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'grantRole',
      args: [roleHash, address as `0x${string}`],
    }, {
      onSuccess: () => {
        toast.success(`Granted ${role} to ${address.slice(0, 6)}...`);
        // Add to local list optimistically
        setGrantedRoles(prev => [
          ...prev,
          {
            address,
            role,
            roleHash,
            date: new Date().toISOString().split('T')[0],
          }
        ]);
        setAddress("");
      },
      onError: (err) => {
        toast.error(err.message?.includes('AccessControl')
          ? "Access denied: You need DEFAULT_ADMIN_ROLE to grant roles."
          : (err.message || "Failed to grant role")
        );
      }
    });
  };

  const handleRevoke = (targetAddress: string, roleName: string) => {
    const roleHash = ROLE_HASHES[roleName];
    if (!roleHash) return;

    writeContract({
      address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'revokeRole',
      args: [roleHash, targetAddress as `0x${string}`],
    }, {
      onSuccess: () => {
        toast.success(`Revoked ${roleName} from ${targetAddress.slice(0, 6)}...`);
        setGrantedRoles(prev => prev.filter(r => !(r.address === targetAddress && r.role === roleName)));
      },
      onError: (err) => {
        toast.error(err.message?.includes('AccessControl')
          ? "Access denied: You need DEFAULT_ADMIN_ROLE to revoke roles."
          : (err.message || "Failed to revoke role")
        );
      }
    });
  };

  return (
    <div className="animate-page space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Role Management</h1>
        <p className="text-text-muted">Admin panel for managing access control.</p>
        {connectedAddress && (
          <div className={`mt-2 flex items-center gap-2 text-sm ${isAdmin ? 'text-success' : 'text-warning'}`}>
            {isAdmin ? (
              <><CheckCircle2 className="w-4 h-4" /> You have Admin privileges</>
            ) : (
              <><XCircle className="w-4 h-4" /> You do not have Admin privileges — role changes will fail</>
            )}
          </div>
        )}
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
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-xl font-semibold">Granted Roles</h3>
          <span className="text-sm text-text-muted">{grantedRoles.length} role(s)</span>
        </div>
        {grantedRoles.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <Shield className="w-10 h-10 mx-auto mb-4 opacity-20" />
            <p>No roles granted in this session.</p>
            <p className="text-sm mt-1">Grant a role above to see it listed here.</p>
          </div>
        ) : (
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
              {grantedRoles.map((r, i) => (
                <tr key={i} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-6 py-4 font-medium font-mono text-sm">
                    {r.address.slice(0, 6)}...{r.address.slice(-4)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-surface-2 border border-border rounded-full text-xs font-medium">
                      {r.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">{r.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleRevoke(r.address, r.role)}
                      disabled={isPending}
                      className="text-error hover:text-error/80 p-2 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
                      title="Revoke role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
