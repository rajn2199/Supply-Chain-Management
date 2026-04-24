import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';

export function useSupplyChain() {
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();

  const createProduct = async (name: string, description: string, price: number, quantity: number, imageHash: string) => {
    return writeContract({
      address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'createProduct',
      args: [name, description, BigInt(price), BigInt(quantity), imageHash],
    });
  };

  const transferOwnership = async (productId: number, newOwner: string, location: string, notes: string) => {
    return writeContract({
      address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'transferOwnership',
      args: [BigInt(productId), newOwner as `0x${string}`, location, notes],
    });
  };

  const updateStatus = async (productId: number, status: number, notes: string) => {
    return writeContract({
      address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
      abi: SUPPLY_CHAIN_ABI,
      functionName: 'updateStatus',
      args: [BigInt(productId), status, notes],
    });
  };

  useWatchContractEvent({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    eventName: 'ProductCreated',
    onLogs(logs) {
      console.log('Product created:', logs);
    },
  });

  return {
    createProduct,
    transferOwnership,
    updateStatus,
    isPending,
    isSuccess,
    isError,
    error,
  };
}
