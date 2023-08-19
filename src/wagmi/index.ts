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

const ZORA = {
  id: 7777777,
  name: 'Zora Network',
  network: 'Zora',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.zora.energy'],
    },
    public: {
      http: ['https://rpc.zora.energy'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Zora Explorer',
      url: 'https://explorer.zora.energy',
    },
  },
}

const projectId = 'e11ce12de4dc6960bdfba128a9a31ff4'
const { chains, publicClient } = configureChains([mainnet, bsc, ETHF, ZORA], [w3mProvider({ projectId })])
const w3mconnectors = w3mConnectors({ projectId, chains })
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mconnectors,
  publicClient,
})

export { wagmiConfig, w3mconnectors, projectId, chains }
