---
slug: /release-notes-template
sidebar_position: 10
id: release-notes-template
title: Template Release Notes
description: Stay up to date with the latest improvements, bug fixes, and structural changes to the TradeGist spreadsheet template.
tags: [updates, release-notes, changelog, template]
---

# Template Release Notes

To ensure the TradeGist add-on functions correctly, your spreadsheet must be compatible with the latest version of our template. This page tracks all versions, improvements, and breaking changes.

:::info Current Version
The latest stable version of the template is **v0.5.0**.
:::

## v0.5.0

This version introduces significant structural updates to the **Transactions** and **Trades** sheets to provide more granular financial data and better automation for options traders.

### New Features & Improvements

- **New Analysis Sheet**: An interactive dashboard for deep-dive performance reviews.
  - **Dynamic Filtering**: Filter trades by Asset (ticker or root symbol), Realization Status (Open/Closed), Year, or Custom Date Ranges.
  - **Header Vital Signs**: Real-time calculation of Success Rate, ROI, P&L, Estimated Tax, and FX Impact for any filtered subset.
- **Automated Options Handling**: The template now automatically handles option exercises and assignments. When an option is exercised/assigned, the template will automatically generate the corresponding buy or sell transactions for the underlying shares.
- **Enhanced Trade Analytics**: We’ve added several new columns to the **Trades** sheet to give you a deeper look at your performance:
  - **Realized P&L**: Track locked-in profits separately.
  - **Total Fees (Base Currency)**: Improved cost tracking by normalizing all fees to your base currency.
  - **Asset ROI & P&L**: See performance breakdown per specific asset.
  - **FX Impact & FX Return**: Isolate how much of your profit (or loss) was caused by currency fluctuations.
- **Advanced Options Configuration**: Added "Current delta" and "Type" columns to the options contracts configuration for better risk tracking.
- **Transaction UX**: Reorganized the **Transactions** sheet columns. Required fields are now grouped at the beginning, followed by optional columns, to speed up manual data entry.
- **FX Rate Management**: Added a new menu item: `Update selected FX rates`. This allows you to manually refresh or update the exchange rates for specific transaction rows.
- **New Named Functions**: Added `OPTION_TYPE` and `OPTION_DELTA` to simplify formula management and user customization.

### Bug Fixes & Refinements

- **Dashboard Robustness**: Updated core formulas in the **Dashboard** sheet to prevent errors and improve calculation stability.
- **Asset Performance Chart**: Fixed a calculation bug where asset performance was being compared to the total asset value in base currency instead of the asset currency.
- **Simplified Configuration**: Removed the "In Summary" option from the asset configuration sheet to streamline the setup process.

---

## v0.4.0

### Improvements

- **Performance Optimization**: Migrated the Asset Performance formulas to use `ArrayFormula`. This significantly reduces the number of formulas in the sheet, resulting in faster loading times and smoother scrolling.

---

:::tip Migration Notice
If you are using a version older than **v0.5.0**, some features of the add-on may not display correctly. We recommend downloading the latest version from the [official template](/setup-guides/official-template) page and migrating your data from your **Configuration** and **Transactions** sheets.
:::
