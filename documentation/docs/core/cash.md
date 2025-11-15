---
id: cash
title: Cash Balance
slug: cash-balance
description: Guide to managing cash balances across accounts in the Portfolio Tracker add-on.
tags: [cash, portfolio-tracker, google-sheets]
---

# Cash Balance

The Cash sheet tracks your cash balances across different accounts, including conversions to your base currency. This data integrates with portfolio snapshots and totals, ensuring accurate overall valuations.

## Overview

- **Purpose**: Monitor cash holdings in multiple accounts and currencies.
- **Template**: Comes with example rows; add as many as needed by inserting rows.
- **Important**: Do not delete the "total" cell at the bottom—it has the "cash_balance" named range. Confirm by selecting the cell and checking the named range in the formula bar.

_Tip_: The total cash balance is used in snapshots and Dashboard calculations.

## Columns

| Column                 | Description                                                                                                                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Label                  | A descriptive name for the account (e.g., "Brokerage Account", "Savings").                                                                                            |
| Amount                 | The cash amount in the account's currency (e.g., 1000).                                                                                                               |
| Currency               | The currency of the account (e.g., "USD", "EUR").                                                                                                                     |
| Conversion Rate        | The exchange rate to convert to your base currency. Use the helper formula `=CURR_RATE(C<rowNumber>)` to fetch automatically based on the currency and base currency. |
| Amount (Base Currency) | The converted amount in your base currency (calculated automatically).                                                                                                |

_Example_: For a USD account with $1,000 at a USD/EUR rate of 0.85, the base currency amount would be €850.

## Adding and Managing Cash Entries

1. **Insert Rows**: Right-click and insert rows above the total cell.
2. **Enter Data**: Fill in Label, Amount, and Currency. The Conversion Rate and Base Currency Amount will auto-calculate.

_Note_: Ensure your base currency is set in the Configuration sheet for accurate conversions.

## Troubleshooting

- **Named Range Missing**: If "cash_balance" isn't applied, reapply it to the total cell.
- **Conversion Errors**: Check base currency in Configuration and ensure `=CURR_RATE()` formulas are correct.
- **Totals Not Updating**: Verify no hidden rows or errors in formulas.
