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
    constant: true,
  },
  {
    inputs: [],
    name: 'ROUND_COUNT',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'ROUND_FEE',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'betCost',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'currentRound',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'devTreater',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
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
    constant: true,
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
    constant: true,
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
    constant: true,
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'roundPrize',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'roundSettling',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
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
    constant: true,
  },
  { stateMutability: 'payable', type: 'receive', payable: true },
  {
    inputs: [{ internalType: 'address', name: '_inviter', type: 'address' }],
    name: 'enjoy',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
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
        ],
        internalType: 'struct DestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
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
        ],
        internalType: 'struct DestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
]

export interface NetModel {
  chainId: number
  chainName: string
  chainSymbol: string
  textColor: string
  color: string
  contractAddr: string
  contractAbi: any[]
}
export const supportNetworks: NetModel[] = [
  {
    chainId: 513100,
    chainName: 'EthereumFair',
    chainSymbol: 'ETHF',
    textColor: '#FFFFFF',
    color: 'primary',
    contractAddr: '0x6821Bd2c593d075f636e5efba54a9182Ebcc9347',
    contractAbi: crossTokenABI,
  },
  // {
  //   chainId: 56,
  //   chainName: 'Binance Smart Chain',
  //   chainSymbol: 'BSC',
  //   textColor: '#FFFFFF',
  //   color: 'warning',
  //   contractAddr: '',
  //   contractAbi: crossTokenABI,
  // },
]
