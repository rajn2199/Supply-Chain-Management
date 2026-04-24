import { useReadContract, useAccount } from 'wagmi';
import { SUPPLY_CHAIN_ABI, SUPPLY_CHAIN_ADDRESS } from '@/lib/contracts';

export function useRole() {
  const { address } = useAccount();

  const { data: manufacturerRole } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'MANUFACTURER_ROLE',
    chainId: 31337,
  });

  const { data: isManufacturer, isLoading: isLoadingManufacturer } = useReadContract({
    address: SUPPLY_CHAIN_ADDRESS as `0x${string}`,
    abi: SUPPLY_CHAIN_ABI,
    functionName: 'hasRole',
    args: manufacturerRole && address ? [manufacturerRole as `0x${string}`, address as `0x${string}`] : undefined,
    chainId: 31337,
    query: {
      enabled: !!manufacturerRole && !!address,
    }
  });

  return {
    isManufacturer: Boolean(isManufacturer),
    isLoading: isLoadingManufacturer,
  };
}
