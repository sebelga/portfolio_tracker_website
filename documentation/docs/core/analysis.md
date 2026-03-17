---
id: analysis
title: Analysis Sheet
slug: analysis
description: Learn how to use the Analysis sheet to filter and evaluate your trade performance across different assets, dates, and categories.
tags: [analysis, performance, portfolio-tracker, google-sheets]
---

# Analysis Sheet

The Analysis sheet is a powerful diagnostic tool designed to provide a "deep dive" into your trading performance. Unlike the automated summary sheets, the Analysis sheet is interactive, allowing you to use a custom filter engine to isolate specific groups of trades and view aggregated metrics like Success Rate, ROI, and FX Impact in real-time.

## Purpose and How It Works

- **Dynamic Filtering**: Narrow down your entire trading history by asset type, realization status, or specific calendar dates.
- **Performance Benchmarking**: Calculate vital signs like Success Rate and ROI specifically for the subset of data you have filtered.
- **Strategy Analysis**: Toggle between your global trade history and specific "Category" sheets to evaluate how different trading strategies are performing individually.

## Filter Controls

The left side of the sheet contains the filter engine. Adjusting these values will instantly update the header metrics and the underlying results.

| Filter             | Description                                                                                             |
| :----------------- | :------------------------------------------------------------------------------------------------------ |
| **Selected asset** | Set to TRUE to only include the specific asset below in the analysis.                                   |
| **Specific Asset** | If "Selected asset" is TRUE, select a specific ticker or root symbol here to isolate one asset.         |
| **Status**         | Choose "Open" to analyze unrealized positions or "Closed" for completed trades.                         |
| **Year**           | If the status is set to "Closed," use this to filter results by a specific calendar year.               |
| **Custom Range**   | A checkbox to enable a specific "From" and "To" date filter.                                            |
| **Date Range**     | If "Custom Range" is TRUE, enter the "From" and "To" dates to filter by the opening date of the trades. |
| **Category Mode**  | A checkbox to switch the data source from the global trade log to a specific Category sheet.            |
| **Category**       | If "Category Mode" is TRUE, select the specific category (e.g., "Swing" or "Hedge") to analyze.         |

## Header Vital Signs

The header displays the aggregated results of your filters in your base currency (EUR). These values are updated automatically to reflect only the trades that meet your active criteria.

- **Total Trades**: The count of individual trades that meet all active filter criteria.
- **Success Rate**: The percentage of filtered trades that resulted in a positive ROI.
- **P&L**: The total profit or loss in your base currency, including market movement and FX impact.
- **ROI**: The percentage return on the capital invested for the filtered group.
- **Estimated Tax**: The projected tax liability for the filtered trades. Note: This value is hidden when Category Mode is active.
- **FX Impact**: The total impact of currency fluctuations on the filtered trades relative to your base currency.

## Category Analysis

The Analysis sheet includes specialized logic for analyzing individual strategies. When **Category Mode** is enabled, the sheet pulls data exclusively from that category's dedicated sub-sheet. This allows you to isolate performance for specific trading styles (e.g., "Option Income" vs. "Crypto Long-term") without manually separating your data.

## Tips and Best Practices

- **Root Symbol Matching**: When filtering by a specific asset, the engine automatically matches both the spot equity and its corresponding options. This gives you a true "total position" view.
- **Bypassing Filters**: If you want to see all closed trades for all time, simply ensure "Selected asset" is FALSE, Status is set to "Closed," and Year/Date Range filters are left blank or disabled.

:::info
If the Analysis header returns zeros or no results, check if your status and year filters are conflicting.
:::
