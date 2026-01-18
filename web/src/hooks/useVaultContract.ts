import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { getVaultContract, type ContractSymbol } from "../contracts/vault";

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
    const contract = getVaultContract(chainId, symbol);
    console.log(
      `deposit called [amount]: [${amount}] [symbol]: [${symbol}] [contract]: [${contract.address}]`,
    );
    const tx = prepareContractCall({
      contract,
      method: "deposit", // "deposit",
      params: [amount],
    });
    return sendTx(tx);
  };

  return { deposit, isPending, error };
}

export function useWithdraw(chainId: number) {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const withdraw = async (amount: bigint, symbol: ContractSymbol) => {
    const contract = getVaultContract(chainId, symbol);
    console.log(
      `withdraw called [amount]: [${amount}] [symbol]: [${symbol}] [contract]: [${contract.address}]`,
    );
    const tx = prepareContractCall({
      contract,
      method: "withdraw",
      params: [amount],
    });
    return sendTx(tx);
  };

  return { withdraw, isPending, error };
}
