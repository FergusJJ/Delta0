# Delta0: Fully Decentralized Auto-Hedging on Hyperliquid

Delta0 is a service that allows users to hedge any asset **entirely on chain**, making it **delta-neutral, instantly withdrawable, and yield-generating**. By utilizing Hyperliquid's HyperEVM and HyperCore infrastructure, Delta0 automates the management of long spot positions against short perpetual futures.

---

## Project Structure

* 
`backend/`: Off-chain logic for calculating optimal target leverage using Geometric Brownian Motion.


* 
`delta0_contracts/`: Solidity smart contracts for HyperEVM, including the rebalancing engine and withdrawal curve logic.


* 
`web/`: A React + Vite frontend for managing deposits, monitoring yields, and executing cross-chain swaps.


* `lib/`: Shared dependencies and libraries.

---

## How It Works - deposit example

### 1. Instant Hedging

When a user deposits an asset (e.g., 1.0 BTC), the protocol keeps the majority on **HyperEVM** (e.g., 0.8 BTC) and bridges the remainder to **HyperCore**. This bridged portion is converted to USDC and used as collateral for a short perpetual contract, effectively neutralizing price exposure.

### 2. Yield Generation

Yield is primarily generated from the **funding rate**. As short holders, the contract collects premiums, which increases the Total USDC Value Under Management (AUM). This yield is reflected in the value of the issued ERC20 tokens, which appreciate relative to USDC over time.

### 3. Smart Rebalancing

Every EVM block, a `rebalance()` function is called. The protocol checks current spot and perp values and executes trades to maintain delta-neutrality based on a **Target Leverage** calculated off-chain.
this is in two stages - rebalanceA() which increases/decreases collateral, and changes short size. When rebalance() is called next, rebalanceB() executes, either bridging ETH back to HyperEVM (if increasing leverage), or transferring the class of previously bridged HyperCore USDC to be margin collateral (when de-leveraging).
### 4. Liquidity & Withdrawals

Users can withdraw their position at any time. To prevent "runs on the bank," Delta0 employs an **Anti-Run Withdrawal Curve**. If a withdrawal would dangerously deplete EVM liquidity, a "haircut" fee is applied to incentivize users to spread out withdrawals.

---

## Technical Features

* 
**Fully On-chain Execution**: Custody, trade logic, and execution are entirely decentralized.


* 
**One-Click Cross-Chain Swaps**: Integrated with **Li.Fi** to allow users to bridge and swap from any chain into a hedged position in a single step.


* 
**Stochastic Risk Management**: The off-chain backend optimizes target leverage to minimize liquidation probability using recent volatility () and drift () data.



---

## Development Summary

* **Total Build Time**: 48 Hours (Hyperliquid Hackathon).
* 
**Stack**: Solidity (Forge), React/Vite, Arch Linux, Neovim.


* 
**Smart Contracts**: ~800 lines of Solidity (No AI usage).


* 
**Frontend**: ~6000 lines of React (AI assisted).

