import { configureChains, createConfig } from '@wagmi/core'
import { w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { mainnet, bsc, zora } from '@wagmi/core/chains'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

const DIS = {
  id: 513100,
  name: 'DISChain',
  network: 'DISChain',
  nativeCurrency: {
    decimals: 18,
    name: 'DIS',
    symbol: 'DIS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.dischain.xyz'],
    },
    public: {
      http: ['https://rpc.dischain.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'DISChain Explorer',
      url: 'https://scan.dischain.xyz',
    },
  },
}

const BLAST = {
  id: 168587773,
  name: 'BLAST Sepolia',
  network: 'BLAST Sepolia',
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
      name: 'BLAST Sepolia Explorer',
      url: 'https://testnet.blastscan.io/',
    },
  },
}

const projectId = 'e11ce12de4dc6960bdfba128a9a31ff4'
const { chains, publicClient } = configureChains([mainnet, bsc, DIS, zora, BLAST], [w3mProvider({ projectId })])
const w3mconnectors = w3mConnectors({ projectId, chains })
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mconnectors,
  publicClient,
})

export { wagmiConfig, w3mconnectors, projectId, chains }
