export const CAMPAIGN_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_mockSwap', type: 'address' },
      { internalType: 'address', name: '_storageToken', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'AmountMustBeGreaterThanZero',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
    name: 'CampaignAlreadyExists',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'campaignId', type: 'uint256' }],
    name: 'CampaignNotFound',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requested', type: 'uint256' },
      { internalType: 'uint256', name: 'available', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'caller', type: 'address' }],
    name: 'OnlyOwnerCanWithdraw',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SwapFailed',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'campaignName', type: 'string' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'WithdrawalFailed',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'string', name: 'creatorName', type: 'string' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'creationTime', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'targetAmount', type: 'uint256' },
    ],
    name: 'CampaignCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'donor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'DonationReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'name', type: 'string' },
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: false, internalType: 'string', name: 'creatorName', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'FundWithdrawn',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'creatorName', type: 'string' },
      { internalType: 'uint256', name: 'targetAmount', type: 'uint256' },
    ],
    name: 'createCampaign',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'donate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'tokenIn', type: 'address' },
    ],
    name: 'donate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'campaignId', type: 'uint256' }],
    name: 'getCampaignInfo',
    outputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'creatorName', type: 'string' },
      { internalType: 'uint256', name: 'balance', type: 'uint256' },
      { internalType: 'uint256', name: 'targetAmount', type: 'uint256' },
      { internalType: 'uint256', name: 'creationTime', type: 'uint256' },
      { internalType: 'address', name: 'owner', type: 'address' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mockSwap',
    outputs: [{ internalType: 'contract MockSwap', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'storageToken',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'address', name: 'tokenIn', type: 'address' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'campaignId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
