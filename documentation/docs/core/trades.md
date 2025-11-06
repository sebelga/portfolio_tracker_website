---
id: trades
title: Trades sheet
slug: core/trades
description: Learn about the Trades sheet, the master table of all your investment trades in the Portfolio Tracker Add-on.
tags: [trades, portfolio-tracker, google-sheets]
---

# Trades Sheet

The Trades sheet is the master table of all your investment trades in the Portfolio Tracker Add-on. It aggregates and displays detailed data for every buy/sell transaction across equities, cryptocurrencies, and options, including metrics like profit/loss, ROI, and taxes. This sheet is automatically generated from your Transactions sheet and serves as the core data source for summaries, dashboards, and analysis.

## Purpose and How It Works

- **Master Data Source**: It contains comprehensive details for each trade, such as volumes, prices, dates, currencies, fees, and calculated values like P&L and ROI.
- **Filtering and Analysis**: Use Google Sheets' filter feature on the headers to slice data by asset, type, date, or other criteria for in-depth analysis.
- **Automatic Regeneration**: Every time you click "Generate trades" in the Portfolio Tracker menu, the sheet is cleared and repopulated with fresh data. Do not make manual changes, as they will be overwritten.
- **Utility Function**: A helper function `TT()` ("T" for Trades column) allows easy access to column ranges in formulas. Pass a column ID prefixed with `c_`, e.g., `TT(c_ticker)`, `TT(c_open_date)`, `TT(c_pnl)`. This is useful for advanced Google Sheets users creating custom analyses.
- **Data Flow**: Pulled from the Transactions sheet, with calculations based on your accounting method (FIFO/LIFO) and API/live prices.

## Key Columns

The sheet includes columns for detailed trade information. Below is a table describing each key column:

| Column                  | Description                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| Asset                   | The name or identifier of the asset.                                                                |
| Type                    | The asset type: "equity", "crypto", or "options".                                                   |
| Ticker                  | The symbol of the asset (e.g., AAPL for Apple stock).                                               |
| Root symbol             | For options, the underlying asset symbol (e.g., AAPL for an AAPL option).                           |
| Option type             | For options, the type: "call" or "put".                                                             |
| Strike                  | For options, the strike price.                                                                      |
| Exp. date               | For options, the expiration date.                                                                   |
| Status                  | The trade status: "open" or "closed".                                                               |
| Dir.                    | The direction: "long" (buy) or "short" (sell).                                                      |
| Volume                  | The number of shares, coins, or contracts traded.                                                   |
| Open date               | The date the trade was opened.                                                                      |
| Open price              | The price per unit at opening.                                                                      |
| Open currency           | The currency of the open price.                                                                     |
| Open fees               | Fees associated with opening the trade.                                                             |
| Open conv. rate         | Exchange rate for the open transaction (if multi-currency).                                         |
| Open amount             | Total amount for the open trade in its currency.                                                    |
| Open amount (b. curr.)  | Total amount for the open trade converted to your base currency.                                    |
| Close date              | The date the trade was closed (if applicable).                                                      |
| Close/curr. price       | The closing or current price per unit.                                                              |
| Close currency          | The currency of the close/current price.                                                            |
| Close fees              | Fees associated with closing the trade.                                                             |
| Close conv. rate        | Exchange rate for the close transaction (if multi-currency).                                        |
| Close/curr. amount      | Total amount for the close/current trade in its currency.                                           |
| Close amount (b. curr.) | Total amount for the close/current trade converted to your base currency.                           |
| Year close              | The year the trade was closed.                                                                      |
| Term                    | The duration the trade was open (long or short).                                                    |
| P&L                     | Profit or loss for the trade.                                                                       |
| ROI                     | Return on investment percentage.                                                                    |
| Account                 | The account associated with the trade.                                                              |
| Tax rate                | The applicable tax rate.                                                                            |
| Tax value               | The calculated tax amount.                                                                          |
| Reentry if closed       | Indicates the price at which you can re-enter the position without realizing a loss, after accounting for taxes due. |

## Tips and Best Practices

- **Data Integrity**: Since the sheet regenerates, rely on the Transactions sheet for inputs. Use filters to explore subsets without editing.
- **Advanced Analysis**: Leverage `TT()` for custom formulas, e.g., summing P&L by asset: `SUMIF(TT(c_ticker), "AAPL", TT(c_pnl))`.
- **Performance Monitoring**: Sort by P&L or ROI to identify top performers. For options, filter by expiration or strike.
- **Currency Handling**: Base currency columns ensure consistency; hide them if not needed.
- **Troubleshooting**: If data seems incorrect, verify Transactions entries and rerun "Generate trades".
- **Integration**: This sheet feeds into Summary and Dashboard sheets for overviews.

This sheet is essential for detailed trade analysis—use it to track performance and inform decisions.
