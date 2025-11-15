---
id: multi_currencies
title: Multi-currencies
description: Guide to handling multi-currency trades in the Portfolio Tracker add-on, including setup, configuration, and examples.
tags: [multi-currencies, portfolio-tracker, google-sheets]
---

# Multi-Currencies

Trading assets in different currencies can complicate portfolio tracking, especially when calculating real profits, losses, and taxes. The Portfolio Tracker add-on simplifies this by allowing you to log currency conversion rates at the time of each transaction, ensuring accurate ROI, P&L, and tax calculations that account for currency fluctuations.

## Why Multi-Currency Tracking Matters

When your base currency differs from an asset's trading currency, exchange rate changes can significantly impact your actual returns. Ignoring this can lead to inaccurate profit/loss reporting and tax calculations.

### Example: Impact of Currency Fluctuations

Suppose your base currency is Euro (EUR), and you trade Tesla (TSLA) shares, which are priced in USD.

- On March 5th, you buy 10 shares of TSLA at $280 each, costing $2,800 USD. The USD/EUR exchange rate is 0.94, so the cost in EUR is $2,800 × 0.94 = €2,632.
- On October 2nd, you sell the 10 shares at $469 each, worth $4,690 USD. Without currency changes, this would be a 67.50% ROI.
- However, the USD/EUR rate has dropped to 0.8526. Converting $4,690 USD to EUR: $4,690 × 0.8526 = €3,998.69, resulting in a 51.92% ROI—a difference of over 15%!
- This fluctuation affects not only your perceived gains but also capital gains taxes, which are calculated on the actual EUR value.

Properly tracking conversion rates ensures your portfolio reflects true performance.

## Setting Up Multi-Currency Trades

Follow these steps to configure multi-currency support:

1. **Set Your Base Currency**: In the Configuration sheet, under "General Configuration," set the `base_currency` (e.g., "EUR" or "USD"). This is the currency in which your portfolio value is reported.
2. **Configure Asset Currencies**: In the Configuration sheet, under "Asset Configuration," specify the underlying currency for each asset (e.g., "USD" for TSLA).
3. **Log Conversion Rates in Transactions**: In the Transactions sheet, for each trade, enter the currency conversion rate in the "Curr. rate" column. Use the helper formula `=CURR_RATE_AT(H<rowNumber>, A<rowNumber>)` to automatically fetch the rate from GOOGLEFINANCE based on the asset's currency and the transaction date.
4. **Generate Trades**: Run "Generate Trades" to calculate ROI, P&L, and taxes, factoring in currency fluctuations.

_Tip_: If you prefer manual entry, input the rate directly, but the formula ensures accuracy and saves time.

## Handling Cryptocurrencies

Cryptocurrencies don't have an underlying currency like stocks; you can buy them in any fiat currency (e.g., BTC in USD or EUR). To handle this:

- In the Configuration sheet, set the asset's currency to your most common trading currency (e.g., "USD" for BTC).
- For transactions in a different currency, override the "Currency" column by entering the actual currency (e.g., "EUR") of the transaction.

This flexibility allows accurate tracking even for mixed-currency crypto trades.

## Configuration Settings for Snapshots

To enable snapshots (daily portfolio captures) with multi-currency support, add exchange rate configurations in the "General Configuration" section. Snapshots use these rates to convert all values to your base currency.

For each traded currency (besides your base), add a row with:

- **id**: `xchange_rate_<CURRENCY>` (e.g., `xchange_rate_USD`)
- **Description**: A label like "Exchange rate USD"
- **Value**: `=CURR_RATE("<CURRENCY>")` (e.g., `=CURR_RATE("USD")`)

_Example_: For USD trades, add:

- id: `xchange_rate_USD`
- Description: Exchange rate USD
- Value: `=CURR_RATE("USD")`

Repeat for each additional currency (e.g., GBP, JPY).

## Currency Formatting in Sheets

By default, amounts display as plain numbers. Customize formatting to reflect currencies:

- For asset-specific columns (e.g., cost basis, cost, value for TSLA), set the format to the asset's currency (e.g., USD).
- For base currency columns (e.g., "Cost b. curr.", "Value b. curr.", "P&L", "Tax"), set the format to your base currency (e.g., EUR).

To change formatting: Select the column, right-click > "Format cells" > Choose the currency symbol.

## Troubleshooting

If you encounter issues with currency rates, such as `#N/A` errors from `=CURR_RATE_AT()`, refer to the [Troubleshooting guide](/troubleshooting) for solutions, including locking values or refreshing GOOGLEFINANCE.

For more help, check the [FAQ](/faq) or contact support.
