---
id: trades
title: Trades sheet
slug: trades
description: Learn about the Trades sheet, the master table of all your investment trades in the TradeGist.
tags: [trades, portfolio-tracker, tradegist, google-sheets]
---

# Trades Sheet

The Trades sheet is the master table of all your investment trades. It aggregates detailed data for every transaction across equities, cryptocurrencies, and options. This sheet serves as the core data engine for your portfolio, calculating performance metrics like P&L and ROI while accounting for both asset price movements and foreign exchange (FX) impacts.

## Purpose and How It Works

- **Master Data Source**: Contains comprehensive details for each trade, including entry/exit prices, fees, and multi-currency conversions.
- **Automatic Regeneration**: This sheet is repopulated whenever you run "Generate trades." Manual changes will be overwritten.
- **Utility Function**: Use the `TT()` helper function to access column ranges dynamically in your custom formulas (e.g., `TT(c_ticker)` or `TT(c_pl)`).
- **Realized Logic**: Tracks positions based on whether they are "Realized" (fully closed for tax/accounting purposes) or still active.

## Key Columns

The sheet includes 37 columns for exhaustive trade analysis.

| Column                      | Description                                                                              |
| :-------------------------- | :--------------------------------------------------------------------------------------- |
| **Asset type**              | The category: "equity", "crypto", or "option".                                           |
| **Ticker**                  | The unique symbol of the asset.                                                          |
| **Root symbol**             | The underlying asset for options contracts.                                              |
| **Option type**             | "Call" or "Put".                                                                         |
| **Strike**                  | The strike price of the option contract.                                                 |
| **Exp. date**               | The expiration date for options.                                                         |
| **Option status**           | Current state of the contract (e.g., Open, Closed, Expired).                             |
| **Dir.**                    | Trade direction: "long" (buy) or "short" (sell).                                         |
| **Account**                 | The brokerage or wallet account used for the trade.                                      |
| **Realized**                | Boolean (TRUE/FALSE) indicating if the position is closed and the gain/loss is realized. |
| **Open date**               | The date the position was established.                                                   |
| **Close date**              | The date the position was closed or the current date if open.                            |
| **Year close**              | The calendar year in which the trade was realized.                                       |
| **Term**                    | Holding period classification (e.g., Short-term or Long-term).                           |
| **Volume**                  | Number of units traded. Note: Sales/Shorts are represented as negative values.           |
| **O. price**                | Opening price per unit in the native asset currency.                                     |
| **O. fees**                 | Fees paid at the time of opening the trade.                                              |
| **Cost Basis**              | Total native currency cost to open the position (Price × Volume + Fees).                 |
| **O. currency**             | The native currency of the asset (e.g., USD, EUR).                                       |
| **O. conv. rate**           | FX rate to base currency (e.g. EUR) at the time of opening.                              |
| **C. price**                | The closing price or the current live market price.                                      |
| **C. fees**                 | Estimated or actual fees for closing the position.                                       |
| **Net Proceeds**            | Total native currency received upon closing (Price × Volume - Fees).                     |
| **C. currency**             | The currency of the closing/live price.                                                  |
| **C. conv. rate**           | FX rate to base currency (e.g. EUR) at the time of closing/current.                      |
| **Cost Basis (base curr.)** | Opening cost converted to the base currency.                                             |
| **Proceeds (base curr.)**   | Closing/current value converted to the base currency at the current or exit FX rate.     |
| **Total Fees (base curr.)** | Sum of open and close fees converted to base currency.                                   |
| **Asset P&L**               | Profit/Loss generated strictly by the asset's price move (ignoring FX changes).          |
| **Asset ROI**               | Return on investment based solely on asset price performance.                            |
| **FX Impact**               | The portion of P&L attributed to changes in the exchange rate between entry and exit.    |
| **FX Return**               | Percentage return generated by currency fluctuations.                                    |
| **Net P&L**                 | Total Profit/Loss in the base currency.                                                  |
| **Net ROI**                 | Total return percentage including both asset move and FX impact.                         |
| **Tax rate**                | The applicable tax percentage for this trade.                                            |
| **Tax value**               | Calculated tax liability based on Net P&L.                                               |
| **Reentry if closed**       | The price required to re-establish the position without a net loss after taxes.          |

## Tips and Best Practices

- **Isolating Performance**: Use the **Asset P&L** vs. **FX Impact** columns to see if your profits are coming from your investment pick or simply from currency swings.
- **Advanced Custom Formulas**: Leverage the `TT()` function for personalized summaries. For example: `=SUMIF(TT(c_realized), FALSE, TT(c_pl))` sums all unrealized P&L.
- **Filtering**: Use the Filter icon on the **Realized** column to quickly toggle between your active portfolio and your historical trade log.

:::warning
Because this sheet is automatically generated, do not manually edit cells. Any changes will be lost the next time you click **Generate trades**.
:::
