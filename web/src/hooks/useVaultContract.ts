import { useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import {
  getVaultContract,
  VAULT_ADDRESSES,
  type ContractSymbol,
} from "../contracts/vault";
import client from "../util/client";
import { hyperEVM } from "../config/chains";
import TokenNameAdressMapping from "@constants/tokens";
import { ChainId } from "@lifi/sdk";

const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;

const TOKEN_ADDRESSES: Record<ContractSymbol, `0x${string}`> = {
  ETH: TokenNameAdressMapping[ChainId.HYP]["UETH"],
};

export const readTokenBalance = async (
  walletAddress: string,
  symbol: ContractSymbol = "ETH",
) => {
  const tokenAddress = TOKEN_ADDRESSES[symbol];
  const tokenContract = getContract({
    client,
    chain: hyperEVM,
    address: tokenAddress,
    abi: ERC20_ABI,
  });
  const result = await readContract({
    contract: tokenContract,
    method: "balanceOf",
    params: [walletAddress],
  });
  return result;
};

export const readValueOfTokenUsdc = async () => {
  const vaultContract = getVaultContract(999, "ETH");
  const result = await readContract({
    contract: vaultContract,
    method: "valueOfTokenUsdc",
  });
  return result;
};

export const readUserTVL = async (address: string) => {
  const vaultContract = getVaultContract(999, "ETH");
  const result = await readContract({
    contract: vaultContract,
    method: "valueLockedByUser",
    params: [address],
  });
  return result;
};

export const readTVUMUsdc = async () => {
  const vaultContract = getVaultContract(999, "ETH");
  const result = await readContract({
    contract: vaultContract,
    method: "totalUSDCValueUnderManagement",
  });
  return result;
};

// amount must have correct decimals, i.e. 1 eth is 1e18
export function useDeposit() {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const deposit = async (amount: bigint, symbol: ContractSymbol) => {
    const vaultContract = getVaultContract(999, symbol);
    const vaultAddress = VAULT_ADDRESSES[999][symbol];
    const tokenAddress = TOKEN_ADDRESSES[symbol];
    const chain = hyperEVM;

    console.log(
      `deposit called [amount]: [${amount}] [symbol]: [${symbol}] [contract]: [${vaultContract.address}]`,
    );

    const tokenContract = getContract({
      client,
      chain,
      address: tokenAddress,
      abi: ERC20_ABI,
    });

    const approveTx = prepareContractCall({
      contract: tokenContract,
      method: "approve",
      params: [vaultAddress, amount],
    });
    await sendTx(approveTx);

    const depositTx = prepareContractCall({
      contract: vaultContract,
      method: "deposit",
      params: [amount],
    });
    return sendTx(depositTx);
  };

  return { deposit, isPending, error };
}

export function useWithdraw() {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const withdraw = async (amount: bigint, symbol: ContractSymbol) => {
    const vaultContract = getVaultContract(999, symbol);
    const vaultAddress = VAULT_ADDRESSES[999][symbol];
    const tokenAddress = TOKEN_ADDRESSES[symbol];
    const chain = hyperEVM;

    console.log(
      `withdraw called [amount]: [${amount}] [symbol]: [${symbol}] [contract]: [${vaultContract.address}]`,
    );

    // First approve the vault to spend tokens
    const tokenContract = getContract({
      client,
      chain,
      address: tokenAddress,
      abi: ERC20_ABI,
    });

    const approveTx = prepareContractCall({
      contract: tokenContract,
      method: "approve",
      params: [vaultAddress, amount],
    });
    await sendTx(approveTx);

    // Then withdraw
    const withdrawTx = prepareContractCall({
      contract: vaultContract,
      method: "withdraw",
      params: [amount],
    });
    return sendTx(withdrawTx);
  };

  return { withdraw, isPending, error };
}
