import { getContract } from "thirdweb";
import client from "../util/client";
import { hyperEVM, hyperEVMTestnet } from "../config/chains";

// TODO: Replace this placeholder ABI with the actual ABI from Foundry output.
// After running `forge build`, copy the "abi" array from:
//   out/YourContract.sol/YourContract.json
// Ensure you keep `as const` at the end for TypeScript type inference.
export const VAULT_ABI = [
  {
    type: "function",
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
] as const;

// TODO: Replace these placeholder addresses with actual deployed contract addresses.
// After deploying via Foundry (`forge create` or `forge script`), paste the addresses here.
export const VAULT_ADDRESSES: Record<number, `0x${string}`> = {
  // TODO: Set mainnet address after deploying to HyperEVM mainnet (chain ID 999)
  [hyperEVM.id]: "0x0000000000000000000000000000000000000000",
  // TODO: Set testnet address after deploying to HyperEVM testnet (chain ID 998)
  [hyperEVMTestnet.id]: "0x0000000000000000000000000000000000000000",
};

export function getVaultContract(chainId: number) {
  const chain = chainId === hyperEVMTestnet.id ? hyperEVMTestnet : hyperEVM;
  const address = VAULT_ADDRESSES[chainId];

  if (!address) {
    throw new Error(`No vault address configured for chain ${chainId}`);
  }

  return getContract({
    client,
    chain,
    address,
    abi: VAULT_ABI,
  });
}
