export const NERO_CHAIN_CONFIG = {
  rpcUrl: process.env.REACT_APP_NERO_RPC_URL || "https://rpc-testnet.nerochain.io",
  chainId: 689,
};

export const AA_PLATFORM_CONFIG = {
  paymasterRpc: "https://paymaster.nerochain.io", // Replace with actual Paymaster RPC
  bundlerRpc: "https://bundler.nerochain.io", // Replace with actual Bundler RPC
};

export const CONTRACT_ADDRESSES = {
  dexAggregator: "0xYourDexAggregatorAddress", // Replace with deployed contract address
  socialContract: "0xYourSocialContractAddress", // Replace with deployed contract address
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // Standard ERC-4337 EntryPoint
  accountFactory: "0xYourAccountFactoryAddress", // Replace with actual factory address
};

export const API_KEY = process.env.REACT_APP_PAYMASTER_API_KEY || "";