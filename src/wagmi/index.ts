import { configureChains, createConfig } from '@wagmi/core'
import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { mainnet, bsc } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

const Blast = {
  id: 168587773,
  name: 'Blast Sepolia',
  network: 'Blast Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.blast.io'],
    },
    public: {
      http: ['https://sepolia.blast.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blast Sepolia Explorer',
      url: 'https://testnet.blastscan.io',
    },
  },
}

const projectId = 'e11ce12de4dc6960bdfba128a9a31ff4'
const { chains, publicClient } = configureChains([mainnet, bsc, Blast], [w3mProvider({ projectId })])
const w3mconnectors = w3mConnectors({ projectId, chains })
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mconnectors,
  publicClient,
})

export { wagmiConfig, w3mconnectors, projectId, chains }
