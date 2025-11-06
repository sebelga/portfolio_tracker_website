---
id: transactions
title: Transactions
slug: core/transactions
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

| Column                         | Description                                                                                                                                                                                                                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date                           | The date of the transaction. Enter the date in a format recognized by Google Sheets (e.g., MM/DD/YYYY or DD/MM/YYYY depending on your locale).                                                                                                                                                                    |
| Category                       | An optional category for grouping transactions. Setting a category creates a separate trades sheet for that category, which does not affect the main "Trades" sheet where tax calculations (based on FIFO or LIFO) are performed. See the advanced topic "Trades categories" for more information.                |
| Asset type                     | The type of asset being traded. Valid values are "equity" (for stocks), "crypto" (for cryptocurrencies), or "options" (for options contracts).                                                                                                                                                                    |
| Symbol                         | The ticker symbol for the asset. This must match an entry in your Assets Configuration. Examples include "NVDA" for NVIDIA stock, "BTC" for Bitcoin, or "NVDA271217C00090000" for an options contract.                                                                                                            |
| Op                             | The operation type. Valid values are "buy", "sell", "exercise", or "reward".                                                                                                                                                                                                                                      |
| Volume                         | The number of shares, coins, or contracts bought or sold.                                                                                                                                                                                                                                                         |
| Price                          | The price per unit (share, coin, or contract) at which the transaction occurred.                                                                                                                                                                                                                                  |
| Currency                       | The currency in which the asset was traded. This field typically does not need to be entered manually, as the formula `=TICKER_CURR(N<rowNum>)` will automatically set the correct currency based on the asset configuration. Only enter a value here if you need to override the default.                        |
| Fees                           | Any fees associated with the transaction (e.g., trading fees or commissions).                                                                                                                                                                                                                                     |
| Account                        | The account associated with the transaction. Each transaction can be linked to a specific account as defined in your Configuration sheet. See the Configuration documentation for details on setting up accounts.                                                                                                 |
| Notes                          | Optional custom text notes for the transaction.                                                                                                                                                                                                                                                                   |
| Amount                         | The total amount of the transaction. This is automatically calculated based on Volume, Price, and Fees, and should not be entered manually.                                                                                                                                                                       |
| Curr. rate                     | The exchange rate for the transaction date, used when the asset's currency differs from your base currency. The formula `=CURR_RATE_AT(H<rowNumber>, A<rowNumber>)` will automatically fetch the correct rate using Google Finance. If you don't want to rely on Google finance you can enter the value manually. |
| Root symbol (internal)         | ⚠️ This column is for internal purpose, you should not enter it manually. If you have deleted it by mistake, the default formula is `=IF(C<rowNumber>="option", PT_EXTRACT_OPTION_ROOT_SYMBOL(D<rowNumber>), D<rowNumber>)`                                                                                       |
| isValidOptionSymbol (internal) | ⚠️ This column is for internal purpose, you should not enter it manually. If you have deleted it by mistake, the default formula is `=IF(C<rowNumber>="option", PT_IS_VALID_OPTION_SYMBOL(D<rowNumber>), "")`                                                                                                     |

:::warning
The currency rate formula relies on GOOGLEFINANCE, which can be unreliable. Once the rate is set, we recommend "locking" it by copying the cell and pasting only the value (Paste Special > Values) to prevent it from recalculating. However, leave the last row with the formula so it serves as the template for new transactions.

Note that GOOGLEFINANCE may return an #N/A error for weekend dates (Saturday or Sunday). As a workaround, temporarily change the date to the previous Friday to fetch the rate, lock the value, then restore the correct date.
:::
