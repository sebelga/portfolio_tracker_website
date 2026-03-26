---
id: transactions
title: Transactions
slug: transactions
description: Learn how to enter and manage your trading transactions (equity, crypto, and options) in the TradeGist Add-on.
tags: [transactions, portfolio-tracker, tradegist, google-sheets]
---

# Transactions

The Transactions sheet is the central place where you enter all your trading transactions for equities, cryptocurrencies, and options. This sheet serves as the primary input for the add-on, and all other summary sheets (Trades, Open Positions, Dashboard, etc.) are automatically generated based on the data you enter here.

## Adding New Transactions

To add a new transaction, the recommended method is to copy an existing transaction row to preserve all necessary formulas. Select the entire row of the last transaction, then copy and paste it into the row below. This ensures that formatting and auto-calculated formulas are carried over correctly.

## Transaction Columns

The Transactions sheet utilizes the following 13 columns to record your trade details:

| Column         | Description                                                                                                                                                                                                                    |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date**       | **(Required)** The date of the transaction.                                                                                                                                                                                    |
| **Asset type** | **(Required)** The type of asset: equity, crypto, or option.                                                                                                                                                                   |
| **Ticker**     | **(Required)** The unique symbol for the asset (e.g., "TSLA" or an OSI option string).                                                                                                                                         |
| **Op**         | **(Required)** The operation type: "buy", "sell", "exercise", "assigned", or "reward".                                                                                                                                         |
| **Volume**     | **(Required)** The number of shares, coins, or contracts traded.                                                                                                                                                               |
| **Price**      | **(Required)** The price per unit in the asset's native trading currency.                                                                                                                                                      |
| **Fees**       | **(Optional)** Any commissions associated with the trade. Defaults to 0 if left blank.                                                                                                                                         |
| **Amount**     | **(Auto-generated)** The total amount of the transaction. Do not manually edit this cell.                                                                                                                                      |
| **Account**    | **(Optional)** Dropdown menu to select the account, taking values from your Accounts configuration.                                                                                                                            |
| **FX rate**    | **(Optional)** The exchange rate used to convert to your base currency. Only required if the asset is in a different currency than your portfolio's base currency.                                                             |
| **Currency**   | **(Optional)** The trading currency. Only set this if the currency used for this transaction differs from the standard currency set in your asset configuration (e.g., trading Bitcoin in EUR when the default config is USD). |
| **Category**   | **(Optional)** Dropdown menu to categorize the trade based on your Category configuration.                                                                                                                                     |
| **Notes**      | **(Optional)** Free text for custom notes about the transaction.                                                                                                                                                               |

## Exercise and Assigned Operations

When dealing with options, you may decide to exercise a contract or you may be assigned on a short position. The script includes automated logic to bridge these transactions between your options and the underlying equity.

### Exercise

When you add an "Exercise" transaction, the script automatically adds a position to buy or sell the corresponding shares based on the contract type.

- **Logic**: The script closes the open contract position using the original opening price (resulting in a $0 P&L for the option leg) and immediately opens the corresponding equity position at the strike price.
- **Example**:
  1.  On March 1st, you buy 1 TSLA call option (TSLA271217C00300000) with a $300 strike price for $100.
  2.  On June 10th, you add an **exercise** transaction for that ticker (Volume: 1, Price: leave blank).
  3.  The script automatically closes the contract at $100 (0 P&L) and opens a long position of 100 shares of TSLA at an open price of $300.

### Assigned

The "Assigned" operation works similarly to an exercise but applies when you have sold a contract to the market.

- **Logic**: If you add an "assigned" transaction, the script will automatically buy or sell the shares corresponding to the matching contract.
- **Short Put Assignment**: If you sold a put and are assigned, the script automatically buys the corresponding shares.
- **Short Call Assignment**: If you sold a call and are assigned, the script automatically sells the corresponding shares.

## Auto populate the FX rate value

Accurate FX rates are required to normalize all transactions into your **Base Currency** (defined in the Configuration sheet). There are three ways to populate this value:

### 1. Automated Menu Update (Recommended)

You can automatically fetch the historical FX rate based on the asset's trading currency and your base currency for specific transactions:

1.  **Select the rows** in the Transactions sheet that you wish to update.
2.  Navigate to the top menu: **TradeGist** > **Update selected FX rates**.
3.  The script will identify the asset's currency (e.g., USD for TSLA) and fetch the rate relative to your base currency for that specific transaction date.

:::info API and Subscription Requirement
The **Update selected FX rates** tool works best with an API key from [ExchangeRate-API](https://www.exchangerate-api.com/), which enables hourly updates. Please note that to fetch rates for **historical (past) transaction dates**, a paid subscription to the service is required.
:::

### 2. Google Finance Formula

You can use the built-in formula `=CURR_RATE_AT("<currency>", "<date>")` to fetch the rate on a specific date. For example, `=CURR_RATE_AT("USD", "2026-01-20T09:44:35")` will fetch the USDEUR rate for January 20th 2026 if your base currency is EUR.

:::warning Formula Reliability
The `GOOGLEFINANCE` service used by this formula can be unreliable and often returns `#N/A` for weekend dates. If this happens, temporarily change the transaction date to the previous Friday, wait for the rate to load, "lock" the value (see below), and then restore the original date.
:::

### 3. Manual Entry

You may manually enter the specific exchange rate provided by your broker for the trade.

---

### Locking FX Rates

If you are using the `=CURR_RATE_AT()` formula we recommend "locking" the FX rate once it is set to prevent unnecessary recalculations or errors:

1.  Copy the cell containing the rate.
2.  Right-click the same cell and select **Paste Special** > **Values**.
