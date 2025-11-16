---
id: snapshots
title: Portfolio Snapshots
description: Guide to creating and managing portfolio snapshots in the Portfolio Tracker add-on for tracking value over time.
tags: [snapshots, portfolio-tracker, google-sheets]
---

# Portfolio Snapshots

Snapshots capture a point-in-time view of your portfolio, including total value, cash balance, and details for each tracked asset. They enable performance tracking, historical analysis, and power the Dashboard charts. Each snapshot is stored as a row in the "Snapshots" sheet.

## What Is Included in a Snapshot?

- **Portfolio Totals**: Total portfolio value and cash balance.
- **Asset Details**: For each asset with "Take Snapshot" checked in the Asset Configuration:
  - Current price.
  - Number of shares or holdings.
  - Position value (e.g., for stocks, includes shares plus any associated options).
- **Custom Data**: Any additional key-value pairs defined in the Configuration sheet (e.g., exchange rates).
- **Timestamps**: Date and time of the snapshot.

_Note_: Untick "Take Snapshot" for assets you don't want included to reduce data volume.

:::info
Charts assume one snapshot per day for accurate performance calculations. If you take multiple snapshots daily, adjust the "Num days" in Chart Configuration accordingly.
:::

## Creating a Manual Snapshot

To take a snapshot manually:

1. Click on the menu: **Snapshots > Create assets snapshot**.
2. A new row will be added to the "Snapshots" sheet with the current data.

_Note_: Snapshots are just normal Google Sheets rows. If you don't need a snapshot, simply delete the row. The same applies to columns—you can delete the 3 columns of an asset to completely remove that asset's snapshots without affecting other assets' snapshots.  
The only thing that needs to stay consistent is that the first column is the timestamp and the second column is the portfolio total value.

## Setting Up Daily Automated Snapshots

Automate snapshots for consistent daily tracking:

1. **Configure the Hour**: In the Configuration sheet, under "General Configuration," set `daily_snapshot_hour` to a 24-hour format value (e.g., 14 for 2 PM). This is in GMT—adjust for your timezone (e.g., 16:00 in New York is 20:00 or 21:00 GMT, depending on daylight saving).
2. **Set Up the Trigger**: Click **Snapshots > Setup snapshots trigger**. This creates a daily Google Apps Script trigger to run at the specified hour.

_Example_: For 9 AM EST (which is 14:00 GMT), set to 14.

:::info
The snapshot hour is in GMT. Double-check your timezone conversion to avoid missed snapshots.
:::

## Removing the Daily Snapshot Trigger

To stop automated snapshots:

- Click **Snapshots > Delete snapshot trigger**.

:::warning
If uninstalling the add-on, remove the trigger first to prevent continued executions.
:::

## Adding Custom Values to Snapshots

Include extra data like exchange rates or market indices:

1. Go to the Configuration sheet, under "Snapshot Custom Data."
2. Add key-value pairs:
   - **Key**: A unique ID (e.g., "usdeur").
   - **Value**: A formula or static value (e.g., `=GOOGLEFINANCE("USDEUR")`).

_Example_: To track USD/EUR rate, set Key to "usdeur" and Value to `=GOOGLEFINANCE("USDEUR")`. This adds a column in the Snapshots sheet.

## Handling Multi-Currency Snapshots

For portfolios with multiple currencies, add exchange rate configurations to ensure accurate conversions. Refer to the [Multi-Currencies documentation](/advanced/multi-currencies) for setup details, including adding `xchange_rate_<CURRENCY>` entries.

_Tip_: This ensures snapshots reflect true base-currency values.

## Troubleshooting Snapshots

- **Snapshots not triggering**: Verify the hour is in GMT and the trigger is set.
- **Missing data**: Ensure assets have "Take Snapshot" checked and prices are updated.
