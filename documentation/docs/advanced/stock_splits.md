---
id: stock_splits
title: Stock Splits
slug: stock-splits
description: Guide to configuring and handling stock splits in the Portfolio Tracker add-on.
tags: [stock-splits, portfolio-tracker, google-sheets]
---

# Stock Splits

Stock splits occur when a company divides its shares, increasing the number of shares while reducing the price per share proportionally. The Portfolio Tracker add-on automatically adjusts historical transactions for splits, ensuring accurate calculations without manual edits. This is especially useful for assets with many transactions, as it prevents the need to update volumes and prices individually.

## How Stock Splits Are Handled

- **Automatic Adjustments**: The add-on detects transactions before a split date and adjusts the volume (number of shares) and price proportionally. Original transactions remain unchanged in the Transactions sheet; adjustments are applied during "Generate Trades."
- **No Manual Edits Needed**: For assets with frequent trades, this saves time and reduces errors.
- **Post-Split Transactions**: Trades after the split date are unaffected.

_Example_:

- You buy 10 shares of NVDA at $500 on March 10th.
- NVDA announces a 5:1 stock split on June 20th.
- After running "Generate Trades," the transaction shows 50 shares at $100 (adjusted for the split).
- Any NVDA trades after June 20th remain as entered.

## Configuring Stock Splits

To enable split adjustments:

1. Go to the Configuration sheet, under "Stock Splits."
2. Add a row for each split:
   - **Date**: The split date (e.g., "2024-08-08").
   - **Ticker**: The asset symbol (e.g., "MSTR").
   - **Split Amount**: The ratio (e.g., 10 for a 10:1 split).
3. Run "Generate Trades" to apply adjustments. All transactions for that ticker before the date will be updated.

_Example_: For a 10:1 split of MSTR on August 8, 2024, enter:

- Date: 2024-08-08
- Ticker: MSTR
- Split Amount: 10

Transactions before August 8th will adjust volumes and prices accordingly.

_Note_: Ensure dates have a "Date" format.

## Impact on Option Contracts

Stock splits also affect associated options:

- **Strike Prices**: Adjusted proportionally (e.g., a $300 strike becomes $30 in a 10:1 split).
- **Contracts**: The number of contracts may increase (e.g., 1 contract becomes 10).
- **Matching Trades**: Pre- and post-split options can be matched in the same trade.

_Example_:

- You buy "MSTR250117C00300000" (strike $300) before August 8, 2024.
- After the 10:1 split, it adjusts to 10 contracts of "MSTR250117C00030000" (strike $30).
- You can sell the 10 contracts on October 10, 2024, and they will match as one trade.

_Tip_: Review adjusted options in the Trades sheet after running "Generate Trades."

## Troubleshooting

- **Adjustments Not Applying**: Confirm the split is configured correctly and run "Generate Trades" again.
- **Incorrect Ratios**: Double-check the split amount (e.g., 2 for 2:1, 10 for 10:1).
- **Options Issues**: Ensure the root symbol matches the ticker.
