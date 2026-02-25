---
id: open_positions_summary
title: Open positions summary sheet
slug: open-positions-summary
description: Learn about the Open Positions Summary sheet, which aggregates data for all your open investment positions in the Portfolio Tracker Add-on.
tags: [open positions, summary, portfolio-tracker, google-sheets]
---

# Open Positions Summary Sheet

The Open Positions Summary sheet provides a consolidated, aggregated overview of all your open investment positions. It streamlines your view by normalizing equities, cryptocurrencies, and options into a single "Risk-First" perspective, allowing you to monitor both your physical holdings and your total market exposure.

## Purpose and How It Works

- **Aggregation**: The sheet summarizes data only for assets with active, unrealized positions (`is_realized = FALSE`).
- **Units vs. Value Exposure**: It distinguishes between your physical inventory (**Spot Qty**), your share-equivalent risk (**Net Units**), and the actual monetary weight of that risk (**Net Exposure**). This is essential for managing portfolios with leverage or complex option strategies.
- **Real-Time Risk Monitoring**: The sheet calculates your "Leverage Ratio" in the header, providing an immediate pulse on how much market risk you are carrying relative to your actual equity.

## Header Vital Signs

The top of the sheet features a "Vital Signs" bar that reconciles your entire open portfolio in your base currency (EUR):

- **Total Value (in base currency)**: Your "Net Liquidation Value"—the actual equity you would have if you closed all positions now.
- **Total P&L (in base currency)**: The combined unrealized profit or loss across all open assets.
- **Total Exposure (in base currency)**: The total monetary "size of the bet" you have in the market (Spot + Delta-adjusted Options).
- **Leverage Ratio**: Your risk multiplier (`Total Exposure / Total Value`). A ratio of 1.0 means you are cash-backed; higher ratios indicate leverage.
- **Total ROI**: The weighted percentage return on your total invested capital.
- **Estimated Tax**: The projected tax liability you would incur if all positions were closed at current prices.

## Key Columns

The sheet utilizes 15 columns to bridge the gap between asset-native values and your base reporting currency.

| Column                   | Description                                                                                  |
| :----------------------- | :------------------------------------------------------------------------------------------- |
| **Ticker**               | The unique symbol of the asset (e.g., TSLA).                                                 |
| **Live price**           | The current market price per unit in the asset's native currency.                            |
| **Spot Qty**             | Your physical inventory of shares or coins. Matches your broker's "Positions" tab.           |
| **Options Qty**          | The share-equivalent exposure of your open contracts (e.g., 1 contract = 100 shares).        |
| **Net Units (Exp)**      | The sum of Spot Qty and Delta-adjusted Options Qty. Represents your "Synthetic" share count. |
| **Net Exposure**         | The monetary value of your risk in your base currency (`Net Units * Price * FX`).            |
| **Cost basis**           | The "Truth" average cost per share, factoring in both equity costs and option premiums.      |
| **Total Cost**           | The total principal currently invested in the asset's native currency.                       |
| **Total Value**          | The current market value of your position in the asset's native currency.                    |
| **Total cost b. curr.**  | The total cost converted to your base currency, including historical FX rates.               |
| **Total value b. curr.** | The current value of your position converted to your base currency at the latest FX rate.    |
| **P&L**                  | The unrealized profit or loss in your base currency.                                         |
| **ROI**                  | The percentage return on the capital invested for this specific position.                    |
| **Estimated Tax**        | The projected tax liability based on current P&L.                                            |
| **Trades**               | An audit count of the total number of open "legs" contributing to this summary row.          |

## Tips and Best Practices

- **Monitoring Leverage**: Keep a close eye on the **Leverage Ratio** in the header. If this number exceeds 2.0, a 10% market drop could result in a 20% loss of your actual equity.
- **Delta-Neutral Strategies**: If you are running a hedged strategy (e.g., a Straddle or a Collar), your **Net Units** and **Net Exposure** should be near zero, even if your **Spot Qty** is high.
- **Currency Risk**: Compare your **Asset P&L** to your **P&L (b. currency)**. If the base currency profit is lower, your gains are being eroded by unfavorable exchange rate movements.

:::info
If a ticker appears with a `0` Spot Qty but a non-zero **Net Exposure**, you are holding "Naked" options or have been assigned on a contract. Use the **Trades** count to investigate the specific open legs in your Trades sheet.
:::
