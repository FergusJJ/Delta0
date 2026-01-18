import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { getVaultContract } from "../contracts/vault";

export function useDeposit(chainId: number) {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const deposit = async (amount: bigint) => {
    const contract = getVaultContract(chainId);
    const tx = prepareContractCall({
      contract,
      // TODO: Update method name to match your contract's deposit function.
      // This must match a function name in VAULT_ABI (e.g., "deposit", "stake", "supply").
      method: "deposit",
      // TODO: Update params to match your contract's function signature.
      // Current: deposit(uint256 amount)
      // If your function takes different params, update accordingly.
      params: [amount],
    });
    return sendTx(tx);
  };

  return { deposit, isPending, error };
}

export function useWithdraw(chainId: number) {
  const { mutateAsync: sendTx, isPending, error } = useSendTransaction();

  const withdraw = async (amount: bigint) => {
    const contract = getVaultContract(chainId);
    const tx = prepareContractCall({
      contract,
      // TODO: Update method name to match your contract's withdraw function.
      // This must match a function name in VAULT_ABI (e.g., "withdraw", "unstake", "redeem").
      method: "withdraw",
      // TODO: Update params to match your contract's function signature.
      // Current: withdraw(uint256 amount)
      // If your function takes different params, update accordingly.
      params: [amount],
    });
    return sendTx(tx);
  };

  return { withdraw, isPending, error };
}
