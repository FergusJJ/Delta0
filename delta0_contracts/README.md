# Delta0 Contracts

Delta0 provides a decentralized service for users to **hedge any asset**, making it delta-neutral, instantly withdrawable, and yield-generating. By leveraging **Hyperliquid's HyperEVM and HyperCore**, the protocol automates the process of maintaining a long spot position and a corresponding short perpetual future contract.

The protocol logic, custody, and execution are **fully on-chain** and decentralized.

---

## Architecture Overview

The system operates across two main layers of the Hyperliquid ecosystem:

*

**HyperEVM:** Handles user deposits, withdrawals, and the issuance of yield-bearing ERC20 tokens (e.g., ETHhUSDC).

*

**HyperCore:** Manages the perpetual future contracts used for automated hedging.

### Core Logic

1.

**Deposits:** When a user sends an asset (e.g., 1.0 BTC), a portion remains on HyperEVM (e.g., 0.8 BTC), while the remainder is bridged to HyperCore.

1.

**Hedging:** The bridged portion is converted to USDC and used as collateral for a short perpetual contract to offset the price exposure of the asset held on the EVM.

1.

**Yield:** Yield is primarily generated from the **funding rate** paid to short position holders. This yield is reflected in the increasing USDC value of the protocol's ERC20 tokens.

---

## Contract Details: `Delta0_ETH.sol`

The main contract manages the lifecycle of hedged ETH positions:

*

**`rebalance()`:** A two-stage function (`rebalanceA` and `rebalanceB`) called every block to maintain the target leverage and delta-neutrality. It calculates necessary trades based on long spot, short perp, and collateral values.

* **Withdrawal Curve:** To prevent a "run on the bank," the protocol utilizes `withdrawalMultiplier()`. If a user attempts to withdraw a large proportion of the available EVM liquidity, they experience a **haircut**.

*

**Yield Distribution:** The `valueOfTokenUsdc()` increases over time as funding fees are collected, ensuring users receive more of the underlying asset upon withdrawal than they initially deposited.

---

## Testing

The project includes a robust test suite utilizing the `HyperCore` simulation environment provided by `hyper-evm-lib`.

### 1. `PerpAccountMarginSummaryTest`

Located in the `test/` directory, this suite focuses on the low-level interactions with HyperCore:

* **L1 State Reading:** Verifies the ability to accurately read account value, margin usage, and notional position sizes from the L1 via the `L1Read` utility.
* **Short Execution:** Tests the logic for opening short positions and confirms that the resulting margin changes are correctly reported by the precompiles.
* **Decimal Handling:** Validates the conversion between EVM decimals and HyperCore's internal representation.

### 2. `FiguringOutCoreWriter`

This test suite serves as an integration test for the high-level protocol logic:

* **Deposit & Accounting:** Simulates user deposits and verifies that the correct amount of Delta0 tokens are minted based on the current Asset Under Management (AUM).
* **Comprehensive Rebalancing:** Tests the full `rebalance()` flow, including moving collateral to HyperCore and adjusting short sizes to achieve a specific target leverage.
* **Withdrawal Multiplier:** Validates the "Anti Run on the Bank" logic by checking the haircut applied to withdrawals of varying sizes relative to the total pool liquidity.

---

## Development Info

*

**Smart Contracts:** ~800 lines of Solidity written using **Forge** and **hyper-evm-lib**.
