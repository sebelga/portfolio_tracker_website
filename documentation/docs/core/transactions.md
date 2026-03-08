---
id: transactions
title: Transactions
slug: transactions
description: Learn how to enter and manage your trading transactions (equity, crypto, and options) in the Portfolio Tracker Add-on.
tags: [transactions, portfolio-tracker, google-sheets]
---

# Transactions

The Transactions sheet is the central place where you enter all your trading transactions for equities, cryptocurrencies, and options. This sheet serves as the primary input for the add-on, and all other sheets (Trades, Dashboard, etc.) are automatically generated based on the data you enter here.

## Adding New Transactions

To add a new transaction, the recommended method is to copy an existing transaction row to preserve all the necessary formulas. Click on the row number of the last transaction to select the entire row, then copy and paste it to the row below. This ensures that all formulas and formatting are carried over correctly.

:::warning
Avoid adding new rows manually or inserting blank rows, as this may disrupt the spreadsheet's formulas and structure.
:::

## Transaction Columns

The Transactions sheet contains several columns for recording your transaction details. Below is a table describing each column:

| Column                             | Description                                                                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Date**                           | The date of the transaction. Enter the date in a format recognized by Google Sheets.                                                                                                                    |
| **Category**                       | An optional category for grouping transactions. Setting a category creates a separate trades sheet for that category.                                                                                   |
| **Asset type**                     | The type of asset being traded: equity, crypto, or options.                                                                                                                                             |
| **Symbol**                         | The ticker symbol for the asset (e.g., "NVDA", "BTC"). This must match an entry in your Assets Configuration.                                                                                           |
| **Op**                             | The operation type: "buy", "sell", "exercise", "assigned" or "reward". See the [Exercise and Assigned Operations](#exercise-and-assigned-operations) section for details on automated share conversion. |
| **Volume**                         | The number of shares, coins, or contracts bought or sold.                                                                                                                                               |
| **Price**                          | The price per unit at which the transaction occurred.                                                                                                                                                   |
| **Currency**                       | Automatically set based on the asset configuration via the `=TICKER_CURR()` formula.                                                                                                                    |
| **Fees**                           | Any fees associated with the transaction (e.g., trading fees or commissions).                                                                                                                           |
| **Account**                        | The account associated with the transaction, as defined in your Configuration sheet.                                                                                                                    |
| **Notes**                          | Optional custom text notes.                                                                                                                                                                             |
| **Amount**                         | The total amount of the transaction, automatically calculated (Volume \* Price + Fees).                                                                                                                 |
| **FX rate**                        | The exchange rate used to convert the asset's trading currency to your base currency. Use the **Update selected FX rate** menu tool to automate this.                                                   |
| **Root symbol** (internal)         | ⚠️ Internal use only. Formula: `=IF(C<rowNumber>="option", PT_EXTRACT_OPTION_ROOT_SYMBOL(D<rowNumber>), D<rowNumber>)`                                                                                  |
| **isValidOptionSymbol** (internal) | ⚠️ Internal use only. Formula: `=IF(C<rowNumber>="option", PT_IS_VALID_OPTION_SYMBOL(D<rowNumber>), "")`                                                                                                |

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

The add-on requires an accurate FX rate to normalize all transactions into your **Base Currency** (defined in the Configuration sheet). There are three ways to populate this value:

### 1. Automated Menu Update (Recommended)

You can automatically fetch the historical FX rate based on the asset's trading currency and your base currency for specific transactions:

1.  **Select the rows** in the Transactions sheet that you wish to update.
2.  Navigate to the top menu: **Portfolio Tracker** > **Update selected FX rate**.
3.  The script will identify the asset's currency (e.g., USD for TSLA) and fetch the rate relative to your base currency for that specific transaction date.

:::info API and Subscription Requirement
The **Update selected FX rate** tool works best with an API key from [ExchangeRate-API](https://www.exchangerate-api.com/), which enables hourly updates. Please note that to fetch rates for **historical (past) transaction dates**, a paid subscription to the service is required.
:::

### 2. Google Finance Formula

You can use the built-in formula `=CURR_RATE("<currency>")` to fetch the rate. For example, `=CURR_RATE("USD")` will fetch the USDEUR rate if your base currency is EUR.

:::warning Formula Reliability
The `GOOGLEFINANCE` service used by this formula can be unreliable and often returns `#N/A` for weekend dates. If this happens, temporarily change the transaction date to the previous Friday, wait for the rate to load, "lock" the value (see below), and then restore the original date.
:::

### 3. Manual Entry

If you prefer not to use an API or formulas, you can manually enter the exchange rate provided by your broker for that specific trade.

---

### Locking FX Rates

If you are using the `=CURR_RATE()` formula we recommend "locking" the FX rate once it is set to prevent unnecessary recalculations or errors:

1.  Copy the cell containing the rate.
2.  Right-click the same cell and select **Paste Special** > **Values**.
3.  **Tip**: Leave the very last row of your sheet with the formula/automation intact so it serves as a template when you copy the row for new transactions.
