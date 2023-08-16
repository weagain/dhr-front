import { configureChains, createConfig } from '@wagmi/core'
import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { mainnet, bsc } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

const ETHF = {
  id: 513100,
  name: 'Ethereum Fair',
  network: 'ethf',
  nativeCurrency: {
    decimals: 18,
    name: 'ETHF',
    symbol: 'ETHF',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.etherfair.org'],
    },
    public: {
      http: ['https://rpc.etherfair.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ETHF Scan',
      url: 'https://oklink.com/ethf',
    },
  },
}

const projectId = 'e11ce12de4dc6960bdfba128a9a31ff4'
const { chains, publicClient } = configureChains(
  [mainnet, bsc, ETHF],
  [
    w3mProvider({ projectId }),
    jsonRpcProvider({
      rpc: (chain: any) => ({
        http: `https://etherfair.org`,
      }),
    }),
  ],
)
const w3mconnectors = w3mConnectors({ projectId, chains })
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mconnectors,
  publicClient,
})

export { wagmiConfig, w3mconnectors, projectId, chains }
