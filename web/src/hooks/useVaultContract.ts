import { useSendTransaction } from "thirdweb/react";
import { getContract, prepareContractCall } from "thirdweb";
import {
  getVaultContract,
  VAULT_ADDRESSES,
  type ContractSymbol,
} from "../contracts/vault";
import client from "../util/client";
import { hyperEVM, hyperEVMTestnet } from "../config/chains";
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
] as const;

const TOKEN_ADDRESSES: Record<ContractSymbol, `0x${string}`> = {
  ETH: TokenNameAdressMapping[ChainId.HYP]["UETH"],
  //SOL: TokenNameAdressMapping[ChainId.HYP]["USOL"],
  //BTC: TokenNameAdressMapping[ChainId.HYP]["UBTC"],
};

/*
 * deposit, withdraw will both only take an amount
 * - the symbol chosen in the menu will decide which smart contact we call
 *   - so probably want to export a hook/function which essentially acts as a
 *   switch statement and then returns the correct abi
 * */

// amount must have correct decimals, i.e. 1 eth is 1e18
export function useDeposit(chainId: number) {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const deposit = async (amount: bigint, symbol: ContractSymbol) => {
    const vaultContract = getVaultContract(chainId, symbol);
    const vaultAddress = VAULT_ADDRESSES[chainId][symbol];
    const tokenAddress = TOKEN_ADDRESSES[symbol];
    const chain = chainId === hyperEVMTestnet.id ? hyperEVMTestnet : hyperEVM;

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

export function useWithdraw(chainId: number) {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const withdraw = async (amount: bigint, symbol: ContractSymbol) => {
    const vaultContract = getVaultContract(chainId, symbol);
    const vaultAddress = VAULT_ADDRESSES[chainId][symbol];
    const tokenAddress = TOKEN_ADDRESSES[symbol];
    const chain = chainId === hyperEVMTestnet.id ? hyperEVMTestnet : hyperEVM;

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
