import { useEffect, useMemo, useState } from "react";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdOutlineArrowOutward,
} from "react-icons/md";
import {
  useActiveAccount,
  useActiveWallet,
  useConnectModal,
} from "thirdweb/react";
import { parseUnits } from "viem";
import client from "../../util/client";
import { useDeposit, useWithdraw } from "../../hooks/useVaultContract";
import { hyperEVM } from "../../config/chains";

import VaultBalances from "../VaultBalances/VaultBalances";
import CurrentYield from "../CurrentYield/CurrentYield";
import ExchangeChart from "../ExchangeChart";
import Button from "../Button/Button";
import s from "./Account.module.css";
import type { ContractSymbol } from "src/contracts/vault";
import TokenNameAdressMapping from "@constants/tokens";
import { ChainId } from "@lifi/sdk";
import { useTokenPrices } from "../../hooks/useTokenPrices";
import { sendVaultStatus } from "@components/Bridge/utils/balanceApi";

type VaultToken = {
  symbol: string;
  address: `0x${string}`;
  amount: number;
};

const TOKEN_CATALOG: Array<{ symbol: ContractSymbol; address: `0x${string}` }> =
  [
    //{ symbol: "SOL", address: TokenNameAdressMapping[ChainId.HYP]["USOL"] },
    { symbol: "ETH", address: TokenNameAdressMapping[ChainId.HYP]["UETH"] },
    //{ symbol: "BTC", address: TokenNameAdressMapping[ChainId.HYP]["UBTC"] },
  ];

const formatAmount = (x: number) =>
  x.toLocaleString(undefined, { maximumFractionDigits: 6 });

export default function Account() {
  const wallet = useActiveWallet();
  const { connect, isConnecting } = useConnectModal();
  const handleConnect = async () => {
    const w = await connect({ client });
    console.log("connected to", w);
  };

  if (!wallet) {
    return (
      <div className={s.container}>
        <div className={s.connectGate}>
          <h2 className={s.connectTitle}>Connect your wallet</h2>
          <p className={s.connectSub}>
            You’ll need to connect a crypto wallet before you can deposit,
            withdraw, or view your yields and balances.
          </p>

          <Button
            color="var(--bg-dark)"
            bgColor="var(--accent-green)"
            disabled={isConnecting}
            onClick={() => void handleConnect()}
            label={isConnecting ? "Connecting..." : "Connect Wallet"}
            icon={<MdOutlineArrowOutward />}
            glow
          />
        </div>
      </div>
    );
  }

  return <AccountAuthed />;
}

function AccountAuthed() {
  const prices = useTokenPrices();
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [chainId] = useState(hyperEVM.id);

  const { deposit, isPending: isDepositing } = useDeposit(chainId);
  const { withdraw, isPending: isWithdrawing } = useWithdraw(chainId);

  // Raw token balances (in token units, not USD)
  const [balances, setBalances] = useState<Record<`0x${string}`, number>>({
    // [TokenNameAdressMapping[ChainId.HYP]["USOL"]]: 0, // dummy data
    [TokenNameAdressMapping[ChainId.HYP]["UETH"]]: 0, // dummy data
    // [TokenNameAdressMapping[ChainId.HYP]["UBTC"]]: 0, // dummy data
  });

  useEffect(() => {
    if (!account?.address) {
      setBalances({
        //      [TokenNameAdressMapping[ChainId.HYP]["USOL"]]: 0,
        [TokenNameAdressMapping[ChainId.HYP]["UETH"]]: 0,
        //   [TokenNameAdressMapping[ChainId.HYP]["UBTC"]]: 0,
      });
      return;
    }

    const getBalances = async () => {
      const promises = [
        sendVaultStatus({
          tokenAddress: TokenNameAdressMapping[ChainId.HYP]["USOL"],
          walletAddress: account.address as `0x${string}`,
          amount: 0,
        }),
        sendVaultStatus({
          tokenAddress: TokenNameAdressMapping[ChainId.HYP]["UETH"],
          walletAddress: account.address as `0x${string}`,
          amount: 0,
        }),
        sendVaultStatus({
          tokenAddress: TokenNameAdressMapping[ChainId.HYP]["UBTC"],
          walletAddress: account.address as `0x${string}`,
          amount: 0,
        }),
      ];
      const resp = await Promise.all(promises);
      setBalances(
        resp.reduce(
          (acc, { tokenAddress, amount }) => ({
            ...acc,
            [tokenAddress]: amount,
          }),
          {} as Record<`0x${string}`, number>,
        ),
      );
    };
    void getBalances();
  }, [account]);

  // Derive vault holdings (USD values) from balances and prices
  const vaultHoldings = useMemo<VaultToken[]>(
    () => [
      //      {
      //        symbol: "SOL (in USDC)",
      //        address: TokenNameAdressMapping[ChainId.HYP]["USOL"],
      //        amount:
      //          (balances[TokenNameAdressMapping[ChainId.HYP]["USOL"]] ?? 0) *
      //          (prices["SOL"] ?? 0),
      //      },
      {
        symbol: "ETH (in USDC)",
        address: TokenNameAdressMapping[ChainId.HYP]["UETH"],
        amount:
          (balances[TokenNameAdressMapping[ChainId.HYP]["UETH"]] ?? 0) *
          (prices["ETH"] ?? 0),
      },
      //      {
      //        symbol: "BTC (in USDC)",
      //        address: TokenNameAdressMapping[ChainId.HYP]["UBTC"],
      //        amount:
      //          (balances[TokenNameAdressMapping[ChainId.HYP]["UBTC"]] ?? 0) *
      //          (prices["BTC"] ?? 0),
      //      },
    ],
    [balances, prices],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"deposit" | "withdraw">("deposit");
  const [selectedSymbol, setSelectedSymbol] = useState(TOKEN_CATALOG[0].symbol);
  const [amountStr, setAmountStr] = useState("0");

  //  const totalUsdcValue = useMemo(
  //    () => vaultHoldings.reduce((sum, t) => sum + t.amount, 0),
  //    [vaultHoldings],
  //  );

  const tokensForDisplay = useMemo(
    () =>
      vaultHoldings.map((t) => ({
        symbol: t.symbol,
        address: t.address,
        amount: formatAmount(t.amount),
      })),
    [vaultHoldings],
  );

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  const openModal = (nextMode: "deposit" | "withdraw") => {
    setMode(nextMode);
    setModalOpen(true);
    setAmountStr("0");
    setSelectedSymbol(TOKEN_CATALOG[0].symbol);
  };

  const handleDeposit = () => openModal("deposit");
  const handleWithdraw = () => openModal("withdraw");
  const handleCloseModal = () => setModalOpen(false);

  const handleApplyAction = async () => {
    const amt = Number(amountStr);
    if (!account?.address) {
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) return;

    const tokenMeta = TOKEN_CATALOG.find((t) => t.symbol === selectedSymbol);
    if (!tokenMeta) return;

    try {
      const amountInWei = parseUnits(amountStr, 18);

      let totals: { tokenAddress: `0x${string}`; amount: number };
      if (mode === "deposit") {
        await deposit(amountInWei, selectedSymbol);
        totals = await sendVaultStatus({
          tokenAddress: tokenMeta.address,
          walletAddress: account.address as `0x${string}`,
          amount: amt,
        });
      } else {
        await withdraw(amountInWei, selectedSymbol);
        totals = await sendVaultStatus({
          tokenAddress: tokenMeta.address,
          walletAddress: account.address as `0x${string}`,
          amount: -amt,
        });
      }

      // Update raw balances with the totals returned from the backend
      setBalances((prev) => ({
        ...prev,
        [totals.tokenAddress]: totals.amount,
      }));

      handleCloseModal();
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val !== "SOL" && val !== "BTC" && val !== "ETH") {
      return;
    }
    setSelectedSymbol(val);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountStr(e.target.value);
  };

  const modalTitle =
    mode === "deposit" ? "Deposit to Vault" : "Withdraw from Vault";
  const isPending = isDepositing || isWithdrawing;

  // Get the balance for the currently selected token in the modal
  const selectedTokenBalance = useMemo(() => {
    const tokenMeta = TOKEN_CATALOG.find((t) => t.symbol === selectedSymbol);
    if (!tokenMeta) return 0;
    return balances[tokenMeta.address] ?? 0;
  }, [selectedSymbol, balances]);
  const actionLabel = isPending
    ? "Confirming..."
    : mode === "deposit"
      ? "Confirm Deposit"
      : "Confirm Withdraw";

  const depositLabel = "Deposit";
  const withdrawLabel = "Withdraw";
  const isAmountInvalid =
    !Number.isFinite(Number(amountStr)) || Number(amountStr) <= 0;

  return (
    <div className={s.container}>
      <div className={s.buttonRow}>
        <Button
          color="var(--bg-dark)"
          bgColor="var(--accent-green)"
          onClick={handleDeposit}
          label={depositLabel}
          icon={<MdArrowDownward />}
          glow
        />
        <Button
          color="var(--accent-green)"
          bgColor="var(--bg-dark)"
          onClick={handleWithdraw}
          label={withdrawLabel}
          icon={<MdArrowUpward />}
          glow
        />
      </div>

      <div className={s.grid}>
        <div className={s.left}>
          <CurrentYield isLoading={isLoading} />
        </div>

        <div className={s.right}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              minHeight: 0,
            }}
          >
            <VaultBalances
              isLoading={isLoading}
              tokens={tokensForDisplay}
              onRefresh={handleRefresh}
            />

            <div
              style={{
                width: "100%",
                minHeight: 520,
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(148,163,184,0.12)",
                background: "#06131c",
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <ExchangeChart />
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className={s.modalBackdrop} onMouseDown={handleCloseModal}>
          <div className={s.modalCard} onMouseDown={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h3 className={s.modalTitle}>{modalTitle}</h3>
              <button
                className={s.iconBtn}
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className={s.formRow}>
              <label className={s.label}>Token</label>
              <select
                className={s.select}
                value={selectedSymbol}
                onChange={handleSymbolChange}
              >
                {TOKEN_CATALOG.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div className={s.formRow}>
              <label className={s.label}>Amount</label>
              <input
                className={s.input}
                inputMode="decimal"
                value={amountStr}
                onChange={handleAmountChange}
                placeholder="0.0"
              />
            </div>

            <div className={s.formRow}>
              <label className={s.label}>Your Balance</label>
              <span className={s.balanceValue}>
                {formatAmount(selectedTokenBalance)} u{selectedSymbol}
              </span>
            </div>

            <div className={s.modalActions}>
              <Button
                label={"Cancel"}
                onClick={handleCloseModal}
                color={"var(--text-secondary)"}
                bgColor={"var(--border-subtle)"}
              />
              <Button
                label={actionLabel}
                onClick={handleApplyAction}
                color={
                  isPending || isAmountInvalid
                    ? "var(--text-secondary)"
                    : "var(--bg-dark)"
                }
                bgColor={
                  isPending || isAmountInvalid
                    ? "var(--border-subtle)"
                    : "var(--accent-green)"
                }
                disabled={isAmountInvalid || isPending}
              />
            </div>

            <div className={s.modalHint}>Connected to HyperEVM</div>
          </div>
        </div>
      )}
    </div>
  );
}
