---
id: open_positions_summary
title: Open positions summary sheet
slug: open-positions-summary
description: Learn about the Open Positions Summary sheet, which aggregates data for all your open investment positions in the Portfolio Tracker Add-on.
tags: [open positions, summary, portfolio-tracker, google-sheets]
---

# Open Positions Summary Sheet

The Open Positions Summary sheet provides a consolidated, aggregated overview of all your open investment positions. It streamlines your view by normalizing equities, cryptocurrencies, and options into a single "Total Exposure" perspective, while allowing you to reconcile physical holdings with your broker.

## Purpose and How It Works

- **Aggregation**: The sheet summarizes data only for assets with active, unrealized positions (`is_realized = FALSE`).
- **Exposure vs. Inventory**: It distinguishes between your physical shares (**Spot Qty**) and your derivative-adjusted risk (**Net Exposure**), which is essential for strategies like covered calls or protective puts.
- **Automatic Updates**: The sheet utilizes dynamic `ARRAYFORMULA` and `BYROW` logic to refresh automatically as trades are added or live prices update.

## Key Columns

The sheet utilizes 14 columns to bridge the gap between asset-native values and your base reporting currency (EUR).

| Column                   | Description                                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| **Ticker**               | The unique symbol of the asset (e.g., TSLA). Generated dynamically for all unrealized positions.      |
| **Live price**           | The current market price per unit in the asset's native currency.                                     |
| **Spot Qty**             | Your physical inventory of shares or coins. This matches your broker's "Positions" tab.               |
| **Options Qty**          | The share-equivalent exposure of your open contracts (e.g., 1 contract = 100 shares).                 |
| **Net exposure**         | The sum of Spot Qty and Options Qty. This represents your actual market delta.                        |
| **Cost basis**           | The "Truth" average cost per share, factoring in both equity costs and option premiums received/paid. |
| **Total Cost**           | The total principal currently invested in the asset's native currency.                                |
| **Total Value**          | The current market value of your total exposure in the asset's native currency.                       |
| **Total cost b. curr.**  | The total cost converted to your base currency (e.g., EUR), including historical FX rates.            |
| **Total value b. curr.** | The current value of your position converted to your base currency at the latest exchange rate.       |
| **P&L**                  | The unrealized profit or loss in your base currency (`Total value b. curr.` - `Total cost b. curr.`). |
| **ROI**                  | The percentage return on the capital invested for this position.                                      |
| **Estimated Tax**        | The projected tax liability based on current P&L if the position were to be closed immediately.       |
| **Trades**               | An audit count of the total number of open "legs" or trades contributing to this summary row.         |

## Tips and Best Practices

- **Reconciling with Broker**: Use the **Spot Qty** column to ensure your spreadsheet matches your actual broker holdings.
- **Monitoring Strategy**: If **Net Exposure** is significantly different from **Spot Qty**, it indicates active hedging or leverage (e.g., covered calls or LEAPs).
- **Understanding Cost Basis**: The **Cost Basis** here is a "Net Break-even." If you sell covered calls, you will see this value decrease as the premiums effectively "pay down" your shares.

:::info
If a ticker appears with a `0` Spot Qty but a non-zero `Net Exposure`, you are likely holding "Naked" options or have been assigned. Use the **Trades** count to investigate the specific open legs in your Trades sheet.
:::
