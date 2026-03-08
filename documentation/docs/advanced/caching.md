---
id: performance_caching
title: Performance and Caching
slug: performance-caching
description: Learn how to optimize the processing speed of your Portfolio Tracker using the built-in incremental caching engine.
tags: [performance, cache, optimization, apps-script]
---

# Performance and Caching

Processing thousands of financial transactions in Google Sheets can lead to slow execution times or script timeouts. To ensure a "snappy" experience, the Portfolio Tracker uses two distinct caching mechanisms designed to bypass the latency of repetitive spreadsheet reads during complex script executions.

## 1. Trades Caching

Instead of rebuilding your entire history every time you update your portfolio, the engine utilizes "Delta Processing" to minimize resource usage:

- **Incremental Scanning**: The script stores the last scanned row index in the **Cache Service**. On subsequent runs, it only reads the **Transaction** sheet from that specific index to the end.
- **Differential Updates**: Rather than a full "dump and replace" of the Trades sheet, the logic identifies only the specific rows that require changes and updates them individually.
- **Data Integrity**: This system preserves the complex logic required for LIFO/FIFO matching and accurately calculates P&L, ROI, and FX impact across stocks, options, and crypto.

### Enabling Trades Cache

1.  Navigate to the **Configuration** sheet.
2.  Locate the setting `tsx_cache_enabled`.
3.  Toggle the **Tick Box** to `TRUE`.

### The "Any Change" Rule for Trades

Because the engine relies on a "last known state," it will not automatically detect modifications made to "previous" transactions (rows located before the last scanned index).

**You must manually clear the trades cache if ANY changes are made to an existing transaction row.** This includes:

- Editing **Volume**, **Price**, **Fees**, or **Currency**.
- Changing the **Date** or **Ticker** symbol.
- **Deleting** or **Inserting** a row anywhere in the middle of the sheet.

---

## 2. Configuration Caching

Fetching settings directly from spreadsheet cells is one of the slowest operations in Google Apps Script. When the "Generate Trades" script runs, it frequently needs to reference your API keys, tax rules, and asset specifications. Caching these settings in memory significantly reduces execution time by eliminating redundant "Read" calls to the Configuration sheet.

This cache covers:

- **General Config**: API keys, matching method and all general configuration.
- **Asset & Options**: Asset ticker-specific settings and option contract specifications.
- **Events & Reports**: Stock splits and tax rates settings.

### Enabling Configuration Cache

Once you have finalized configuring all your settings and your workflow has shifted to only adding new records to the Transactions sheet, you can activate the configuration cache to further optimize performance. To enable it:

1.  Navigate to the **Configuration** sheet.
2.  Locate the setting `config_cache_enabled`.
3.  Toggle the **Tick Box** to `TRUE`.

:::tip Script Efficiency
Enabling this feature prevents the add-on from having to "look up" your settings during the trade generation process, leading to a much faster and more reliable execution.
:::

### Handling Config Updates

If you change **any** value in the Configuration sheet (e.g., updating an API key or adding a new Stock Split), the script will continue to use the "old" values stored in the cache.

**You must manually clear the configuration cache after making ANY settings change.**

---

## Cache Management Tools

The top menu provides granular control over your data state. Access these via **Portfolio Tracker** > **Cache**:

| Menu Option                   | When to use it                                                                                                                   |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Clear trades cache**        | Use after editing, inserting, or deleting any historical transaction row.                                                        |
| **Clear configuration cache** | Use after changing API keys, tax rates, splits, or any asset-specific setting.                                                   |
| **Clear all caches**          | The "nuclear option." Use this if you have made extensive changes to both data and settings to ensure a perfectly clean rebuild. |

:::danger Important
After clearing a cache, always click **Generate Trades** to initiate a full scan and sync your sheets with the most recent data and settings.
:::
