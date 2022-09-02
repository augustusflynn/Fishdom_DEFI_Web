export const seedAddress = "0x90F90dF2993faC69B4d22583105DC8474ACc389e";
export const seedAbi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "token_",
				type: "address",
			},
			{
				internalType: "address",
				name: "exchangeToken_",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "ClaimWDA",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "Register",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "soldout",
				type: "bool",
			},
		],
		name: "SoldOut",
		type: "event",
	},
	{
		inputs: [],
		name: "_cost",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_exchangeToken",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_firstLockingTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_max",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_min",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_soldOut",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_tge",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_tgeTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_token",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_totalBalances",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_totalVestingPeriod",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_vestingPeriod",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "buy",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "getRelease",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getTotalBoughtWDA",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getTotalUnboughtWDA",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "getUnlocked",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "getWDABalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "firstLockingTime_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "tge_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "vestingPeriod_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "totalVestingPeriod_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "totalBalances_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "cost_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "min_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "max_",
				type: "uint256",
			},
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "isExistAddress",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "isWhiteList",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "nextTimeClaim",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tgeTime_",
				type: "uint256",
			},
		],
		name: "setTgeTime",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "users_",
				type: "address[]",
			},
		],
		name: "setWhiteList",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "users",
		outputs: [
			{
				internalType: "uint256",
				name: "balance",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amountClaimVesting",
				type: "uint256",
			},
			{
				internalType: "bool",
				name: "isClaimTGE",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "vesting",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "whiteList",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "withdrawBusd",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
// Testonly
export const busdAddress = "0xca06025cb523ac1b134c2615a43a224B48dd936e";
export const busdAbi = [
	{
		inputs: [
			{ internalType: "string", name: "name_", type: "string" },
			{ internalType: "string", name: "symbol_", type: "string" },
			{ internalType: "uint256", name: "initialSupply", type: "uint256" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "sellTax",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "buyTax",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "transferTax",
				type: "uint256",
			},
		],
		name: "ChangeTax",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [],
		name: "_buyTax",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_rewardPool",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_sellTax",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_transferTax",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "spender", type: "address" },
		],
		name: "allowance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "approve",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "subtractedValue", type: "uint256" },
		],
		name: "decreaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "addedValue", type: "uint256" },
		],
		name: "increaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "account", type: "address" },
			{ internalType: "bool", name: "permission", type: "bool" },
		],
		name: "setLiquidityAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "rewardPool_", type: "address" }],
		name: "setRewardPool",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "sellTax_", type: "uint256" },
			{ internalType: "uint256", name: "buyTax_", type: "uint256" },
			{ internalType: "uint256", name: "transferTax_", type: "uint256" },
		],
		name: "setTaxes",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transfer",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
export const priavteAddress = "0x13aF22500C3F48089394094903e90646e56752AE";
export const privateAbi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "token_",
				type: "address",
			},
			{
				internalType: "address",
				name: "exchangeToken_",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "ClaimWDA",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "Register",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "bool",
				name: "soldout",
				type: "bool",
			},
		],
		name: "SoldOut",
		type: "event",
	},
	{
		inputs: [],
		name: "_cost",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_exchangeToken",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_firstLockingTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_maxW1",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_maxW2",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_minW1",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_minW2",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_soldOut",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_tge",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_tgeTime",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_token",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_totalBalances",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_totalVestingPeriod",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_vestingPeriod",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "buy",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "getRelease",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getTotalBoughtWDA",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getTotalUnboughtWDA",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "getUnlocked",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "getWDABalance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "firstLockingTime_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "tge_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "vestingPeriod_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "totalVestingPeriod_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "totalBalances_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "cost_",
				type: "uint256",
			},
		],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "isExistAddress",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "isWhiteList1",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
		],
		name: "isWhiteList2",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "nextTimeClaim",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "minW1_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "maxW1_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "minW2_",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "maxW2_",
				type: "uint256",
			},
		],
		name: "setMinMax",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tgeTime_",
				type: "uint256",
			},
		],
		name: "setTgeTime",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "setUserBalance",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "users_",
				type: "address[]",
			},
		],
		name: "setWhiteList1",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "users_",
				type: "address[]",
			},
		],
		name: "setWhiteList2",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "users",
		outputs: [
			{
				internalType: "uint256",
				name: "balance",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amountClaimVesting",
				type: "uint256",
			},
			{
				internalType: "bool",
				name: "isClaimTGE",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "vesting",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "whiteList1",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "whiteList2",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "withdrawBusd",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
export const luckyWDAAddress = "0xf685856a6203b87F0BB019a774BEa6511AD9a2f1";
export const luckyWDAAbi = [{ "inputs": [{ "internalType": "contract IERC20", "name": "_token", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "checkpoint", "type": "uint256" }], "name": "BuyTicket", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "RandomWinner", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint8", "name": "ticketType", "type": "uint8" }], "name": "TicketWin", "type": "event" }, { "inputs": [], "name": "DAOTreasuryWallet", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_quantity", "type": "uint256" }], "name": "buyTicket", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint8", "name": "_ticketType", "type": "uint8" }], "name": "claimCoin", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimReward", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contractState", "outputs": [{ "internalType": "enum LuckyTicketWDA.ContractState", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "mod", "type": "uint256" }], "name": "generateRandomNum", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getFeePerTicket", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerTicket", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerTicketReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerTicketRewardAvailable", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerWinningTicket100000WDA", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerWinningTicket100000WDAAvailable", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerWinningTicket5000WDA", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getOwnerWinningTicket5000WDAAvailable", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getRandomNumber", "outputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getTicketSoldPerDay", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "lastTimeCheck", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "winner", "type": "address" }, { "internalType": "uint256", "name": "rewardAmount", "type": "uint256" }, { "internalType": "uint256", "name": "purchaseDate", "type": "uint256" }, { "internalType": "uint256", "name": "checkpoint", "type": "uint256" }], "name": "payWinner", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "requestId", "type": "bytes32" }, { "internalType": "uint256", "name": "randomness", "type": "uint256" }], "name": "rawFulfillRandomness", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "resetAllTicket", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "player", "type": "address" }, { "internalType": "uint256", "name": "purchaseDate", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "rewardTicket", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_newDAOTreasuryWallet", "type": "address" }], "name": "setDAOTreasuryWallet", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_newFeePerTicket", "type": "uint256" }], "name": "setFeePerTicket", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "time", "type": "uint256" }], "name": "setLockTime", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "maxP", "type": "uint256" }], "name": "setMaxPercentProposal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "setMinimumPlayer", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "percentChange", "type": "uint256" }, { "internalType": "uint8", "name": "action", "type": "uint8" }], "name": "setProposal", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }, { "internalType": "bool", "name": "permission", "type": "bool" }], "name": "setValidTarget", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "totalTicketSoldPerPeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawWDAToDAOTreasury", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]

export const wdaAddress = "0x4f56B2325373Cf4427e101CffD2FFA7Be197e248";
export const wdaAbi = [
	{
		inputs: [
			{ internalType: "string", name: "name_", type: "string" },
			{ internalType: "string", name: "symbol_", type: "string" },
			{ internalType: "uint256", name: "initialSupply", type: "uint256" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "sellTax",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "_buyTax",
				type: "uint256",
			},
		],
		name: "ChangeTax",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "liquidity",
				type: "address",
			},
		],
		name: "SetLiquidity",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [],
		name: "_buyTax",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_rewardPool",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_sellTax",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "spender", type: "address" },
		],
		name: "allowance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "approve",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "decimals",
		outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "subtractedValue", type: "uint256" },
		],
		name: "decreaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "spender", type: "address" },
			{ internalType: "uint256", name: "addedValue", type: "uint256" },
		],
		name: "increaseAllowance",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "liquidity", type: "address" },
			{ internalType: "bool", name: "permission", type: "bool" },
		],
		name: "setLiquidityAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "rewardPool_", type: "address" }],
		name: "setRewardPool",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "sellTax_", type: "uint256" },
			{ internalType: "uint256", name: "buyTax_", type: "uint256" },
		],
		name: "setTaxes",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transfer",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

export const auctionAddress = "0x2A8ED83df11ef4BbD9EDA7e2b29d48abE918f836";
export const auctionAbi = [
	{
		inputs: [
			{ internalType: "address", name: "token_", type: "address" },
			{ internalType: "address", name: "daoTreasuryAddress_", type: "address" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "nftId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "highestBid",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "withBnb",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "address",
				name: "highestBidder",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "totalBid",
				type: "uint256",
			},
		],
		name: "AuctionClosed",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "nftId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "bidPrice",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "withBnb",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "address",
				name: "bidder",
				type: "address",
			},
		],
		name: "BidPlaced",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "nftId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "startingBid",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "withBnb",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "closingTime",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "address",
				name: "originalOwner",
				type: "address",
			},
		],
		name: "NewAuctionOpened",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{ stateMutability: "payable", type: "fallback" },
	{
		inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		name: "auctions",
		outputs: [
			{ internalType: "uint256", name: "highestBid", type: "uint256" },
			{ internalType: "uint256", name: "withBnb", type: "uint256" },
			{ internalType: "uint256", name: "closingTime", type: "uint256" },
			{ internalType: "address", name: "highestBidder", type: "address" },
			{ internalType: "address", name: "originalOwner", type: "address" },
			{ internalType: "bool", name: "isActive", type: "bool" },
			{ internalType: "uint256", name: "totalBid", type: "uint256" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "balances",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "closeAuction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "decimalPlusBnb",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "durationTime",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "forceCloseAuction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "_sNft", type: "address" }],
		name: "initialize",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "isAuction",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "lastNftId",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "openAuction",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "periodDays",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "_priceBid", type: "uint256" }],
		name: "placeBid",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "priceBnb",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "target", type: "address" },
			{ internalType: "bool", name: "permission", type: "bool" },
		],
		name: "setAdmin",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "days_", type: "uint256" },
			{ internalType: "uint256", name: "decimalPlusBnb_", type: "uint256" },
		],
		name: "setAugmentBnb",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "daoTreasuryAddress_", type: "address" },
		],
		name: "setDaoTreasuryAddress",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "duration_", type: "uint256" }],
		name: "setDurationTime",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_target", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
		],
		name: "withdraw",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "_target", type: "address" },
			{ internalType: "uint256", name: "_amount", type: "uint256" },
		],
		name: "withdrawWDA",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{ stateMutability: "payable", type: "receive" },
];

export const crownNFTAdress = "0x317774A16Cc8AcCe5DA6a942524247b1178F0Ed6";
export const crownNFTAbi = [
	{
		inputs: [
			{ internalType: "string", name: "name_", type: "string" },
			{ internalType: "string", name: "symbol_", type: "string" },
			{ internalType: "string", name: "baseUri_", type: "string" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "Approval",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{ indexed: false, internalType: "bool", name: "approved", type: "bool" },
		],
		name: "ApprovalForAll",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "delegator",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "fromDelegate",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "toDelegate",
				type: "address",
			},
		],
		name: "DelegateChanged",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "delegate",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "previousBalance",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newBalance",
				type: "uint256",
			},
		],
		name: "DelegateVotesChanged",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "minter",
				type: "address",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "aprBonus",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "reduce",
				type: "uint256",
			},
		],
		name: "MintCrown",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: "address", name: "from", type: "address" },
			{ indexed: true, internalType: "address", name: "to", type: "address" },
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256",
			},
		],
		name: "Transfer",
		type: "event",
	},
	{
		inputs: [],
		name: "DOMAIN_SEPARATOR",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "_transferCoolDown",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "approve",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "owner", type: "address" }],
		name: "balanceOf",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "burn",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "delegatee", type: "address" }],
		name: "delegate",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "delegatee", type: "address" },
			{ internalType: "uint256", name: "nonce", type: "uint256" },
			{ internalType: "uint256", name: "expiry", type: "uint256" },
			{ internalType: "uint8", name: "v", type: "uint8" },
			{ internalType: "bytes32", name: "r", type: "bytes32" },
			{ internalType: "bytes32", name: "s", type: "bytes32" },
		],
		name: "delegateBySig",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "delegates",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "getApproved",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "account", type: "address" },
			{ internalType: "uint256", name: "blockNumber", type: "uint256" },
		],
		name: "getPastTokenLocked",
		outputs: [
			{ internalType: "uint256[]", name: "", type: "uint256[]" },
			{ internalType: "uint256", name: "", type: "uint256" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "blockNumber", type: "uint256" }],
		name: "getPastTotalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "account", type: "address" },
			{ internalType: "uint256", name: "blockNumber", type: "uint256" },
		],
		name: "getPastVotes",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "getTraits",
		outputs: [
			{
				components: [
					{ internalType: "uint8", name: "reduce", type: "uint8" },
					{ internalType: "uint8", name: "aprBonus", type: "uint8" },
					{ internalType: "bool", name: "staked", type: "bool" },
					{ internalType: "uint256", name: "lockDeadline", type: "uint256" },
				],
				internalType: "struct CrownNFT.CrownTraits",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "getVotes",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "address", name: "operator", type: "address" },
		],
		name: "isApprovedForAll",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "maxSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "number", type: "uint256" }],
		name: "mintValidTarget",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "owner", type: "address" }],
		name: "nonces",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "ownerOf",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "ownerToTokenArray",
		outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "bytes", name: "_data", type: "bytes" },
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "operator", type: "address" },
			{ internalType: "bool", name: "approved", type: "bool" },
		],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "string", name: "baseUri_", type: "string" }],
		name: "setBaseUri",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "target", type: "address" },
			{ internalType: "bool", name: "permission", type: "bool" },
		],
		name: "setValidTarget",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
			{ internalType: "bool", name: "status", type: "bool" },
		],
		name: "stakeOrUnstake",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "symbol",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "index", type: "uint256" }],
		name: "tokenByIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "owner", type: "address" },
			{ internalType: "uint256", name: "index", type: "uint256" },
		],
		name: "tokenOfOwnerByIndex",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
		name: "tokenURI",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "totalSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "from", type: "address" },
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "tokenId", type: "uint256" },
		],
		name: "transferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

export const swapSceptorAddress = "0xe631dF1d7C20E0DC35F9811a777c1B2BaFecFB96";
export const swapSceptorAbi = [
	{
		inputs: [
			{ internalType: "address", name: "CrownNFT_", type: "address" },
			{ internalType: "address", name: "ScepterNFT_", type: "address" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "MAX_SUPPLY",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "PRICE",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "burnScepter",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "currentSupply",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "uint256[]", name: "", type: "uint256[]" },
			{ internalType: "uint256[]", name: "", type: "uint256[]" },
			{ internalType: "bytes", name: "", type: "bytes" },
		],
		name: "onERC1155BatchReceived",
		outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "uint256", name: "", type: "uint256" },
			{ internalType: "uint256", name: "", type: "uint256" },
			{ internalType: "bytes", name: "", type: "bytes" },
		],
		name: "onERC1155Received",
		outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "address", name: "", type: "address" },
			{ internalType: "uint256", name: "", type: "uint256" },
			{ internalType: "bytes", name: "", type: "bytes" },
		],
		name: "onERC721Received",
		outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "swapCrown",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];

export const sceptorAddress = "0x7225AACBa07Dd3d18c6283F6F344c5efad2a92dc";
export const sceptorAbi = [
	{
		inputs: [],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool",
			},
		],
		name: "ApprovalForAll",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]",
			},
			{
				indexed: false,
				internalType: "uint256[]",
				name: "values",
				type: "uint256[]",
			},
		],
		name: "TransferBatch",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "id",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256",
			},
		],
		name: "TransferSingle",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "string",
				name: "value",
				type: "string",
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "id",
				type: "uint256",
			},
		],
		name: "URI",
		type: "event",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256",
			},
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address[]",
				name: "accounts",
				type: "address[]",
			},
			{
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]",
			},
		],
		name: "balanceOfBatch",
		outputs: [
			{
				internalType: "uint256[]",
				name: "",
				type: "uint256[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address",
			},
			{
				internalType: "address",
				name: "operator",
				type: "address",
			},
		],
		name: "isApprovedForAll",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
		],
		name: "mintValidTarget",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				internalType: "uint256[]",
				name: "ids",
				type: "uint256[]",
			},
			{
				internalType: "uint256[]",
				name: "amounts",
				type: "uint256[]",
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes",
			},
		],
		name: "safeBatchTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address",
			},
			{
				internalType: "address",
				name: "to",
				type: "address",
			},
			{
				internalType: "uint256",
				name: "id",
				type: "uint256",
			},
			{
				internalType: "uint256",
				name: "amount",
				type: "uint256",
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes",
			},
		],
		name: "safeTransferFrom",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address",
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool",
			},
		],
		name: "setApprovalForAll",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "target",
				type: "address",
			},
			{
				internalType: "bool",
				name: "permission",
				type: "bool",
			},
		],
		name: "setValidTarget",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4",
			},
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "uri",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];

export const daoAddress = "0x9bBE70106A7835CB14CbA751c3AAc55BDB285347";
export const daoAbi = [
	{
		inputs: [
			{ internalType: "contract IVotes", name: "token_", type: "address" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "proposalId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "address",
				name: "proposer",
				type: "address",
			},
			{
				indexed: false,
				internalType: "address",
				name: "targets",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "values",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "bytes",
				name: "calldatas",
				type: "bytes",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "startBlock",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "endBlock",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "string",
				name: "description",
				type: "string",
			},
		],
		name: "ProposalCreated",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "proposalId",
				type: "uint256",
			},
		],
		name: "ProposalExecuted",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "voter",
				type: "address",
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "proposalId",
				type: "uint256",
			},
			{ indexed: false, internalType: "uint8", name: "support", type: "uint8" },
			{
				indexed: false,
				internalType: "uint256",
				name: "weight",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "string",
				name: "reason",
				type: "string",
			},
		],
		name: "VoteCast",
		type: "event",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint256",
				name: "finalProposalId",
				type: "uint256",
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "voteStart",
				type: "uint64",
			},
			{
				indexed: false,
				internalType: "uint64",
				name: "voteEnd",
				type: "uint64",
			},
		],
		name: "setFinalProposal",
		type: "event",
	},
	{
		inputs: [],
		name: "BALLOT_TYPEHASH",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "COUNTING_MODE",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
		name: "_resetCountVote",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "proposalId", type: "uint256" },
			{ internalType: "uint8", name: "support", type: "uint8" },
		],
		name: "castVote",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "proposalId", type: "uint256" },
			{ internalType: "uint8", name: "support", type: "uint8" },
			{ internalType: "uint8", name: "v", type: "uint8" },
			{ internalType: "bytes32", name: "r", type: "bytes32" },
			{ internalType: "bytes32", name: "s", type: "bytes32" },
		],
		name: "castVoteBySig",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "proposalId", type: "uint256" },
			{ internalType: "uint8", name: "support", type: "uint8" },
			{ internalType: "string", name: "reason", type: "string" },
		],
		name: "castVoteWithReason",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "deminator",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "targets", type: "address" },
			{ internalType: "uint256", name: "values", type: "uint256" },
			{ internalType: "bytes", name: "calldatas", type: "bytes" },
			{ internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
		],
		name: "execute",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "account", type: "address" }],
		name: "getBlockToPropose",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "account", type: "address" },
			{ internalType: "uint256", name: "blockNumber", type: "uint256" },
		],
		name: "getVotes",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "proposalId", type: "uint256" },
			{ internalType: "address", name: "account", type: "address" },
		],
		name: "hasVoted",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "targets", type: "address" },
			{ internalType: "uint256", name: "values", type: "uint256" },
			{ internalType: "bytes", name: "calldatas", type: "bytes" },
			{ internalType: "bytes32", name: "descriptionHash", type: "bytes32" },
		],
		name: "hashProposal",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "pure",
		type: "function",
	},
	{
		inputs: [],
		name: "name",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "bool", name: "isFinal", type: "bool" }],
		name: "numerator",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
		name: "proposalDeadline",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
		name: "proposalForRate",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
		name: "proposalSnapshot",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "proposalThreshold",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
		name: "proposalVotes",
		outputs: [
			{ internalType: "uint256", name: "againstVotes", type: "uint256" },
			{ internalType: "uint256", name: "forVotes", type: "uint256" },
			{ internalType: "address[]", name: "votedAddress", type: "address[]" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "targets", type: "address" },
			{ internalType: "uint256", name: "values", type: "uint256" },
			{ internalType: "bytes", name: "calldatas", type: "bytes" },
			{ internalType: "string", name: "description", type: "string" },
		],
		name: "propose",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [],
		name: "proposeCoolDown",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "uint256", name: "blockNumber", type: "uint256" },
			{ internalType: "bool", name: "isFinal", type: "bool" },
		],
		name: "quorum",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "setFirstFinalProposal",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "blockNumber", type: "uint256" }],
		name: "setProposeCoolDown",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
		name: "state",
		outputs: [
			{ internalType: "enum IDAO.ProposalState", name: "", type: "uint8" },
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ internalType: "bool", name: "", type: "bool" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "token",
		outputs: [{ internalType: "contract IVotes", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "version",
		outputs: [{ internalType: "string", name: "", type: "string" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "votingDelay",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "votingFinalPeriod",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "votingPeriod",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{ stateMutability: "payable", type: "receive" },
];

export const daoTreasuryAddress = "0xd1ABA74F03C6A984Feb6556733EeDd62453401Eb";
export const daoTreasuryAbi = [
	{
		inputs: [
			{ internalType: "contract IERC20", name: "wda_", type: "address" },
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address",
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address",
			},
		],
		name: "OwnershipTransferred",
		type: "event",
	},
	{ stateMutability: "payable", type: "fallback" },
	{
		inputs: [],
		name: "deposit",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [],
		name: "getBalance",
		outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "owner",
		outputs: [{ internalType: "address", name: "", type: "address" }],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "renounceOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address", name: "to", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "sendWDA",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "address payable", name: "to", type: "address" },
			{ internalType: "uint256", name: "amount", type: "uint256" },
		],
		name: "transferBNB",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
		name: "transferOwnership",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
];
