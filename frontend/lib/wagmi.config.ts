import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, hardhat } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { injectedWallet, metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

const appName = 'Supply Chain DApp';
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'local-dev-project-id';
type WalletFactoryParams = {
  projectId: string;
  walletConnectParameters?: Parameters<typeof walletConnectWallet>[0]['options'];
};

const walletList = [
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet,
      (_params: WalletFactoryParams) => injectedWallet(),
      ...(process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
        ? [
            (params: WalletFactoryParams) =>
              walletConnectWallet({
                projectId: params.projectId,
                options: params.walletConnectParameters,
              }),
          ]
        : []),
    ],
  },
];

const connectors = connectorsForWallets(walletList, {
  appName,
  projectId: walletConnectProjectId,
});

export const config = createConfig({
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
  connectors,
  transports: {
    [mainnet.id]:  http(),
    [sepolia.id]:  http(),
    [polygon.id]:  http(),
    [hardhat.id]:  http('http://127.0.0.1:8545'), // ✅ Direct local RPC
  },
  ssr: false,
});