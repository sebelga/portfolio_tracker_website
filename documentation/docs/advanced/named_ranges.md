---
id: named_ranges
slug: named-ranges
title: Named Ranges
description: Guide to using named ranges in the TradeGist template for advanced analysis.
tags: [named-ranges, portfolio-tracker, tradegist, google-sheets]
---

# Named Ranges

Named ranges in Google Sheets™ are predefined labels for cell ranges, making formulas easier to read and maintain. The TradeGist template exposes several named ranges for accessing configuration, cash, and trade data dynamically. These update automatically as your data grows, avoiding hard-coded ranges.

## How to Use Named Ranges

- **In Formulas**: Reference a named range directly (e.g., `=cash_balance`).
- **With INDIRECT**: For dynamic sheets, use `=INDIRECT("Trades!" & c_ticker)` to get the ticker column from the Trades sheet.
- **Custom Functions**: Use the `TT(range)` function for Trades sheet (e.g., `=TT(c_ticker)`) or the `CAT(categoryId, range)` function for category sheets (e.g., `=CAT("Trading", c_ticker)`).
- **Benefits**: Ranges auto-expand with new data, so formulas stay accurate without manual updates.

_Example_: Instead of `=INDIRECT("Trades!B2:B30")`, use `=TT(c_ticker)` for all ticker values.

## General Named Ranges

These provide access to configuration and summary data:

- `accounts`: The accounts range (used in transaction dropdowns).
- `base_currency`: The portfolio's base currency.
- `cash_balance`: Your total cash balance.
- `categories`: The trades categories range (used in transaction dropdowns).
- `cat_sheet_prefix`: The prefix for category sheets (e.g., "cat\_\_").
- `trades_sheet`: The name of the "Trades" sheet.

_Example_: `=base_currency` returns "EUR" if set as your base.

## Trades Sheet Column Named Ranges

Each Trades sheet column has a named range prefixed with `c_` (for "column"). These point to the full column range (e.g., "B2:B16"), updating with new trades. Use with `TT()` or `INDIRECT()`.

- `c_asset_type`
- `c_ticker`
- `c_root_symbol`
- `c_option_type`
- `c_strike`
- `c_exp_date`
- `c_option_status`
- `c_dir`
- `c_volume`
- `c_open_date`
- `c_open_price`
- `c_open_currency`
- `c_open_fees`
- `c_open_conv_rate`
- `c_open_amount`
- `c_open_amount_base_currency`
- `c_close_date`
- `c_close_current_price`
- `c_close_currency`
- `c_close_fees`
- `c_close_current_conv_rate`
- `c_close_current_amount`
- `c_close_current_amount_base_currency`
- `c_year_close`
- `c_term`
- `c_pl`
- `c_roi`
- `c_account`
- `c_tax_rate`
- `c_tax_value`
- `c_reentryIfClosed`

_Example_: `=SUM(TT(c_pl))` sums all P&L values from the Trades sheet.

## Tips

- **Category Sheets**: Use `CAT()` for isolated analysis (e.g., `=CAT("Trading", c_roi)` for ROI in the Trading category).
- **Dynamic Updates**: Named ranges adjust automatically after running "Generate Trades."
- **Troubleshooting**: If a range seems outdated, regenerate trades or check for errors.

For more help, refer to the [Custom Functions documentation](/advanced/custom-functions) or [FAQ](/faq).
