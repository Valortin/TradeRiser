export const DEX_AGGREGATOR_ABI = [
  "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, address to) external returns (uint256)",
  "function getBestSwap(address tokenIn, address tokenOut, uint256 amountIn) external view returns (address dex, uint256 amountOut)",
];

export const SOCIAL_CONTRACT_ABI = [
  "function shareTrade(address trader, string memory strategy, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut) external",
  "function followTrader(address trader) external",
  "function getTrades(address trader) external view returns (tuple(address trader, string strategy, uint256 amountIn, uint256 amountOut, address tokenIn, address tokenOut)[])",
];