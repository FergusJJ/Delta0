import { defineChain } from "thirdweb";

export const hyperEVM = defineChain({
  id: 999,
  name: "HyperEVM",
  rpc: "https://rpc.hyperliquid.xyz/evm",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
});

export const hyperEVMTestnet = defineChain({
  id: 998,
  name: "HyperEVM Testnet",
  rpc: "https://rpc.hyperliquid-testnet.xyz/evm",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  testnet: true,
});

export const arbitrumSepolia = defineChain({
  id: 421614,
  name: "Arbitrum Sepolia",
  rpc: "https://sepolia-rollup.arbitrum.io/rpc",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  testnet: true,
});
