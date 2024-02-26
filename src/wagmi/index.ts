import { createWeb3Modal } from '@web3modal/wagmi/vue'
import { reconnect, http, createConfig } from '@wagmi/core'
// import { mainnet, sepolia } from '@wagmi/core/chains'
import { coinbaseWallet, walletConnect, injected } from '@wagmi/connectors'

// 1. Define constants
const projectId = 'e11ce12de4dc6960bdfba128a9a31ff4'

// 2. Create wagmiConfig
const metadata = {
  name: 'Lucky Hash Ring',
  description: 'Lucky Hash Ring',
  url: 'https://hash.bid', // origin must match your domain & subdomain
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
const Main = {
  id: 1,
  name: 'Ethereum Mainnet',
  network: 'Ethereum Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.infura.io/v3/'],
    },
    public: {
      http: ['https://mainnet.infura.io/v3/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Ethereum Mainnet Explorer',
      url: 'https://etherscan.io',
    },
  },
}
const BSC = {
  id: 56,
  name: 'BNB Chain',
  network: 'BNB Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
  },
  rpcUrls: {
    default: {
      http: ['https://binance.llamarpc.com'],
    },
    public: {
      http: ['https://binance.llamarpc.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BNB Chain Explorer',
      url: 'https://bscscan.com',
    },
  },
}
const ZORA = {
  id: 7777777,
  name: 'Zora Network',
  network: 'Zora Network',
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
      name: 'Zora Network Explorer',
      url: 'https://explorer.zora.energy',
    },
  },
}

export const config = createConfig({
  chains: [BLAST, Main, BSC, ZORA, DIS],
  transports: {
    [Main.id]: http(),
    [BLAST.id]: http(),
    [BSC.id]: http(),
    [ZORA.id]: http(),
    [DIS.id]: http(),
  },
  connectors: [walletConnect({ projectId, metadata, showQrModal: false }), injected({ shimDisconnect: true })],
})

reconnect(config)
// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
})
