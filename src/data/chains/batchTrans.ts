// const batchToolAbi = [
//   {
//     inputs: [
//       { internalType: 'uint256', name: 'amount', type: 'uint256' },
//       { internalType: 'address[]', name: 'addressList', type: 'address[]' },
//     ],
//     name: 'batchTrans',
//     outputs: [],
//     stateMutability: 'payable',
//     type: 'function',
//     payable: true,
//   },
//   {
//     inputs: [
//       { internalType: 'address', name: 'tokenAddr', type: 'address' },
//       { internalType: 'uint256', name: 'amount', type: 'uint256' },
//       { internalType: 'address[]', name: 'addressList', type: 'address[]' },
//     ],
//     name: 'batchTransToken',
//     outputs: [],
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ]

const batchToolAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_frenAddr', type: 'address' },
      { internalType: 'uint256', name: '_coinFee', type: 'uint256' },
      { internalType: 'uint256', name: '_frenMinimum', type: 'uint256' },
      { internalType: 'uint256', name: '_frenFee', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'address', name: 'token', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'totalAmount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'numbers', type: 'uint256' },
    ],
    name: 'BatchTrans',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: '_newCashier', type: 'address' }],
    name: 'ChangeCashier',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: '_newFren', type: 'address' }],
    name: 'ChangeFren',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: '_newHod', type: 'address' }],
    name: 'ChangeOwner',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: '_coinFee', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: '_frenMinimum', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: '_frenFee', type: 'uint256' },
    ],
    name: 'ChangeParam',
    type: 'event',
  },
  {
    inputs: [],
    name: 'cashier',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'coinFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'frenFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'frenMinimum',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'frenToken',
    outputs: [{ internalType: 'contract ERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_coinFee', type: 'uint256' },
      { internalType: 'uint256', name: '_frenMinimum', type: 'uint256' },
      { internalType: 'uint256', name: '_frenFee', type: 'uint256' },
    ],
    name: 'opParam',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newHod', type: 'address' }],
    name: 'opOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newPayAddr', type: 'address' }],
    name: 'transCashier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_deployedFren', type: 'address' }],
    name: 'setFrenToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_tokenAddr', type: 'address' },
      { internalType: 'address', name: '_spenderAddr', type: 'address' },
    ],
    name: 'getTokenInfo',
    outputs: [
      {
        components: [
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'uint256', name: 'decimals', type: 'uint256' },
          { internalType: 'uint256', name: 'totalSupply', type: 'uint256' },
          { internalType: 'uint256', name: 'allowance', type: 'uint256' },
          { internalType: 'uint256', name: 'balance', type: 'uint256' },
          { internalType: 'uint256', name: 'frenBalance', type: 'uint256' },
          { internalType: 'uint256', name: 'frenAllowance', type: 'uint256' },
          { internalType: 'uint256', name: 'coinFee', type: 'uint256' },
          { internalType: 'uint256', name: 'frenFee', type: 'uint256' },
          { internalType: 'uint256', name: 'useToken', type: 'uint256' },
        ],
        internalType: 'struct BatchTransfer.TokenUser',
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
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address[]', name: 'addressList', type: 'address[]' },
    ],
    name: 'transEq',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'address[]', name: 'addressList', type: 'address[]' },
    ],
    name: 'transDiff',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenAddr', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address[]', name: 'addressList', type: 'address[]' },
    ],
    name: 'transTokenEq',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenAddr', type: 'address' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'address[]', name: 'addressList', type: 'address[]' },
    ],
    name: 'transTokenDiff',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address[]', name: 'addressList', type: 'address[]' },
    ],
    name: 'transFrenEq',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'address[]', name: 'addressList', type: 'address[]' },
    ],
    name: 'transFrenDiff',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]

export interface MulChainTransfer {
  abi: any[]
  address: string
  chainId: number
  chainName: string
  fren: string
}

export const createMulChainTransfer = (
  abi: any[],
  address: string,
  chainId: number,
  chainName: string,
  fren: string,
): MulChainTransfer => {
  return {
    abi,
    address,
    chainId,
    chainName,
    fren,
  }
}

const mulChainTransfer: Record<string, MulChainTransfer> = {
  BSC: createMulChainTransfer(
    batchToolAbi,
    '0xbd2CD53Fd264b891123a7b5C041955EcCf2d51Bb',
    56,
    'BSC',
    '0xE6A768464B042a6d029394dB1fdeF360Cb60bbEb',
  ),
  ETHF: createMulChainTransfer(
    batchToolAbi,
    '0x0Fc2A54a6F9DBc38F85261544c2e21AAB066ABC5',
    513100,
    'ETHF',
    '0xf81ed9cecFE069984690A30b64c9AAf5c0245C9F',
  ),
}

export const selectChain = (chainId: number) => {
  if (chainId == 56) {
    return mulChainTransfer.BSC
  } else if (chainId == 513100) {
    return mulChainTransfer.ETHF
  }
  return mulChainTransfer.BSC
}
