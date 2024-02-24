import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { mainnet, bsc, zora } from 'viem/chains'
import { reconnect } from '@wagmi/core'

// 1. Define constants
const projectId = 'e11ce12de4dc6960bdfba128a9a31ff4'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
}
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
const chains = [BLAST, mainnet, bsc, zora, DIS]
export const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
})

reconnect(config)
// 3. Create modal
let a = createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light',
})
