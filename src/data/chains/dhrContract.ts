const generalABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_betCost', type: 'uint256' },
      { internalType: 'address', name: '_devTreater', type: 'address' },
      { internalType: 'uint256', name: '_roundFee', type: 'uint256' },
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
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'RoundPrizeEx',
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
    name: 'canRebid',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
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
    inputs: [],
    name: 'manager',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'roundFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'roundWinCode',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
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
          { internalType: 'address[]', name: 'winners', type: 'address[]' },
          { internalType: 'uint256', name: 'wincode', type: 'uint256' },
        ],
        internalType: 'struct GeneralDestinyHashRing.RoundInfo',
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
          { internalType: 'address[]', name: 'winners', type: 'address[]' },
          { internalType: 'uint256', name: 'wincode', type: 'uint256' },
        ],
        internalType: 'struct GeneralDestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      { internalType: 'address', name: '_newManager', type: 'address' },
      { internalType: 'bytes32', name: 'hash', type: 'bytes32' },
      { internalType: 'bytes', name: 'signature', type: 'bytes' },
    ],
    name: 'transferManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_newBidCost', type: 'uint256' },
      { internalType: 'uint256', name: '_newFee', type: 'uint256' },
    ],
    name: 'recBF',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newTreater', type: 'address' }],
    name: 'transferDevTreater',
    outputs: [],
    stateMutability: 'nonpayable',
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
    constant: true,
  },
]
const blastABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_betCost',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_devTreater',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'round',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'inviter',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'seq',
        type: 'uint256',
      },
    ],
    name: 'RoundJoin',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'round',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RoundPrizeEx',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'round',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address[]',
        name: 'users',
        type: 'address[]',
      },
    ],
    name: 'RoundWinner',
    type: 'event',
  },
  {
    inputs: [],
    name: 'BLAST',
    outputs: [
      {
        internalType: 'contract IBlast',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'INVITE_SHARE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'ROUND_COUNT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'ROUND_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'betCost',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'currentRound',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'devTreater',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'roundPartInviter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'roundPartVerifyer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'roundParticipants',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'roundPrize',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'roundSettling',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'roundWinCode',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'roundWinner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    stateMutability: 'payable',
    type: 'receive',
    payable: true,
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_inviter',
        type: 'address',
      },
    ],
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
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'users',
            type: 'address[]',
          },
          {
            internalType: 'uint256',
            name: 'prize',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'winners',
            type: 'address[]',
          },
          {
            internalType: 'uint256',
            name: 'wincode',
            type: 'uint256',
          },
        ],
        internalType: 'struct BlastDestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_hisRound',
        type: 'uint256',
      },
    ],
    name: 'historyRoundInfo',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'index',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'users',
            type: 'address[]',
          },
          {
            internalType: 'uint256',
            name: 'prize',
            type: 'uint256',
          },
          {
            internalType: 'address[]',
            name: 'winners',
            type: 'address[]',
          },
          {
            internalType: 'uint256',
            name: 'wincode',
            type: 'uint256',
          },
        ],
        internalType: 'struct BlastDestinyHashRing.RoundInfo',
        name: 'data',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'claimMyContractsGas',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'claimAllYield',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newTreater',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: 'hash',
        type: 'bytes32',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'transferDevTreater',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'comw',
        type: 'uint256',
      },
    ],
    name: 'testCode',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
    constant: true,
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
    chainSymbol: 'ETH',
    coin: 'ETH',
    textColor: '#FFFFFF',
    color: '#000000',
    contractAddr: '0x50d6e5bea4CD1D9a166689f806CB744F0395041e',
    contractAbi: generalABI,
  },
  {
    chainId: 56,
    chainName: 'Binance Smart Chain',
    chainSymbol: 'BNB',
    coin: 'BNB',
    textColor: '#FFFFFF',
    color: 'warning',
    contractAddr: '0x91C865E693898D8cf61cbfD175CF03B06e80aa69',
    contractAbi: generalABI,
  },
  {
    chainId: 513100,
    chainName: 'Disney Chain',
    chainSymbol: 'DIS',
    coin: 'DIS',
    textColor: '#FFFFFF',
    color: 'primary',
    contractAddr: '0x818B271ACa8885EE8246B023A8e324fA9c0C414D',
    contractAbi: generalABI,
  },
  {
    chainId: 168587773,
    chainName: 'BLAST Sepolia',
    chainSymbol: 'ETH',
    coin: 'ETH',
    textColor: '#FF00FF',
    color: 'primary',
    contractAddr: '0x50d6e5bea4CD1D9a166689f806CB744F0395041e',
    contractAbi: blastABI,
  },
]
