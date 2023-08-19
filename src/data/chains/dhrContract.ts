const crossTokenABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_betCost', type: 'uint256' },
      { internalType: 'address', name: '_devTreater', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'round', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'inviter', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'seq', type: 'uint256' },
    ],
    name: 'RoundJoin',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'round', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'count', type: 'uint256' },
      { indexed: false, internalType: 'address[]', name: 'users', type: 'address[]' },
    ],
    name: 'RoundWinner',
    type: 'event',
  },
  {
    inputs: [],
    name: 'INVITE_SHARE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ROUND_COUNT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ROUND_FEE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'betCost',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentRound',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'devTreater',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'roundPartInviter',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'roundPartVerifyer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'roundParticipants',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'roundPrize',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'roundSettling',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'roundWinCode',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    name: 'roundWinner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
  {
    inputs: [{ internalType: 'address', name: '_inviter', type: 'address' }],
    name: 'enjoy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentRoundInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'index', type: 'uint256' },
          { internalType: 'address[]', name: 'users', type: 'address[]' },
          { internalType: 'uint256', name: 'prize', type: 'uint256' },
          { internalType: 'address[]', name: 'winners', type: 'address[]' },
          { internalType: 'uint256', name: 'wincode', type: 'uint256' },
        ],
        internalType: 'struct DestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_hisRound', type: 'uint256' }],
    name: 'historyRoundInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'index', type: 'uint256' },
          { internalType: 'address[]', name: 'users', type: 'address[]' },
          { internalType: 'uint256', name: 'prize', type: 'uint256' },
          { internalType: 'address[]', name: 'winners', type: 'address[]' },
          { internalType: 'uint256', name: 'wincode', type: 'uint256' },
        ],
        internalType: 'struct DestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  { inputs: [], name: 'withdraw', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      { internalType: 'address', name: 'wallet', type: 'address' },
      { internalType: 'uint256', name: 'comw', type: 'uint256' },
    ],
    name: 'testCode',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
]

export interface NetModel {
  chainId: number
  chainName: string
  chainSymbol: string
  coin: string
  textColor: string
  color: string
  contractAddr: string
  contractAbi: any[]
}
export const supportNetworks: NetModel[] = [
  {
    chainId: 7777777,
    chainName: 'ZORA Network',
    chainSymbol: 'Zora',
    coin: 'ETH',
    textColor: '#FFFFFF',
    color: '#000000',
    contractAddr: '0x111cdBF288C9613019c9c324D9E9AC7e9a71e2d5',
    contractAbi: crossTokenABI,
  },
  {
    chainId: 56,
    chainName: 'Binance Smart Chain',
    chainSymbol: 'BSC',
    coin: 'BNB',
    textColor: '#FFFFFF',
    color: 'warning',
    contractAddr: '0x50d6e5bea4CD1D9a166689f806CB744F0395041e',
    contractAbi: crossTokenABI,
  },
  {
    chainId: 513100,
    chainName: 'EthereumFair',
    chainSymbol: 'ETHF',
    coin: 'ETHF',
    textColor: '#FFFFFF',
    color: 'primary',
    contractAddr: '0xbF4564DeC02eF0A5EBCda3B398b7E1d8d0529236',
    contractAbi: crossTokenABI,
  },
]
