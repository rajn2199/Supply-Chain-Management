import { useReadContract } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';

export function useProductHistory(productId: number | string | undefined) {
  const { data: history, isLoading, isError, refetch } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'getProductHistory',
    args: productId ? [BigInt(productId)] : undefined,
    chainId: 31337,
    query: {
      enabled: !!productId,
    }
  });

  const { data: isVerified, isLoading: isVerifying } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'verifyProduct',
    args: productId ? [BigInt(productId)] : undefined,
    chainId: 31337,
    query: {
      enabled: !!productId,
    }
  });

  return {
    history,
    isVerified,
    isLoading: isLoading || isVerifying,
    isError,
    refetch,
  };
}
