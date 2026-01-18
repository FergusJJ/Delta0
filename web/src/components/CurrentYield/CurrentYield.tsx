import { memo } from "react";
import s from "./CurrentYield.module.css";

type Props = {
  isLoading?: boolean;
  fundingRate: number; // 8h funding rate as percentage (e.g., 0.01 for 0.01%)
  daily: number; // daily yield as percentage
  weekly: number; // weekly yield as percentage
  monthly: number; // monthly yield as percentage
  tvl: string; // formatted TVL string (e.g., "$12.4M")
  apy: number; // APY as percentage
  totalUSDCUnderManagement?: bigint;
};

export default memo(function CurrentYield({
  isLoading = false,
  fundingRate,
  daily,
  weekly,
  monthly,
  tvl,
  apy,
  totalUSDCUnderManagement = 0n,
}: Props) {
  const totalTVLFormatted = (Number(totalUSDCUnderManagement) / 1e6).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section className={s.card}>
      <div className={s.header}>
        <h2 className={s.title}>Current Yield</h2>
        <span className={s.badge}>Delta Neutral</span>
      </div>

      <div className={s.yieldContent}>
        <div className={s.assetHeader}>
          <span className={s.assetBadge}>ETH</span>
        </div>

        <div className={s.assetApyRow}>
          <span className={s.apyLabel}>Funding (8h)</span>
          <span className={s.apyValue}>
            {isLoading ? (
              <span className={s.skeletonSm} />
            ) : (
              <>
                <span className={s.apyNumber}>
                  {fundingRate >= 0 ? "+" : ""}
                  {fundingRate.toFixed(4)}
                </span>
                <span className={s.apyPercent}>%</span>
              </>
            )}
          </span>

          <div className={s.metricsGrid}>
            <MetricCard label="Daily" value={`+${daily.toFixed(3)}%`} isLoading={isLoading} />
            <MetricCard label="Weekly" value={`+${weekly.toFixed(3)}%`} isLoading={isLoading} />
            <MetricCard label="Monthly" value={`+${monthly.toFixed(3)}%`} isLoading={isLoading} />
          </div>
        </div>

        <div className={s.statsRow}>
          <Stat label="TVL" value={tvl} isLoading={isLoading} />
          <Stat label="APY" value={`${apy.toFixed(2)}%`} isLoading={isLoading} />
        </div>
      </div>

      <div className={s.totalTvlRow}>
        <span className={s.totalTvlLabel}>Total Value Under Management</span>
        <span className={s.totalTvlValue}>
          {isLoading ? "—" : `$${totalTVLFormatted}`}
        </span>
      </div>

      <div className={s.strategyInfo}>
        <p className={s.strategyText}>
          Yield is generated through delta-neutral hedging strategies,
          minimizing directional exposure while capturing funding rates and
          basis spreads.
        </p>
      </div>
    </section>
  );
});

function MetricCard({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div className={s.metricCard}>
      <span className={s.metricLabel}>{label}</span>
      <span className={s.metricValue}>
        {isLoading ? <span className={s.skeletonSm} /> : value}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  isLoading,
}: {
  label: string;
  value: string;
  isLoading: boolean;
}) {
  return (
    <div className={s.stat}>
      <span className={s.statLabel}>{label}</span>
      <span className={s.statValue}>{isLoading ? "—" : value}</span>
    </div>
  );
}
