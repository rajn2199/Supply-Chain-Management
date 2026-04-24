import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, hardhat } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Supply Chain DApp',
  projectId: '3c8b41cd88bb3e660e521dfb689a9f24',
  chains: [
    mainnet,
    sepolia,
    polygon,
    {
      ...hardhat,
      // ✅ Disable ENS on localhost — stops CORS errors from eth.merkle.io
      contracts: {
        ...hardhat.contracts,
        ensRegistry: undefined,
        ensUniversalResolver: undefined,
      },
    },
  ],
  transports: {
    [mainnet.id]:  http(),
    [sepolia.id]:  http(),
    [polygon.id]:  http(),
    [hardhat.id]:  http('http://127.0.0.1:8545'), // ✅ Direct local RPC
  },
  ssr: false,
});