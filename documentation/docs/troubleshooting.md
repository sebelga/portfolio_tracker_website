---
id: troubleshooting
title: Troubleshooting
description: Common issues and solutions for the Portfolio Tracker add-on in Google Sheets.
tags: [troubleshooting, portfolio-tracker, google-sheets]
---

# Troubleshooting

This page covers common issues you may encounter with the Portfolio Tracker add-on and provides step-by-step solutions. If you can't resolve an issue, check the [FAQ](/faq) or report it via the add-on's help menu.

## `#N/A` returned from currency rate transaction value

The `=CURR_RATE_AT(H<rowNumber>, A<rowNumber>)` formula uses under the hood the `GOOGLEFINANCE` formula. `GOOGLEFINANCE` is unfortunately not always reliable and consistent. It can happen that you see the exchange rate value in the Transaction sheet but when you run "Generate Trades" a `#N/A` value appears under the "Open conv. rate" column.

To fix that, once you have fetched the currency conversion rate using the `=CURR_RATE_AT(H<rowNumber>, A<rowNumber>)` formula, lock the value by copying the cell and then "Paste value only" onto the cell. This will replace the formula with the rate value. You can then run "Generate trades" again and the problem should be fixed.

## Prices not updating

- **Symptoms**: Current prices remain blank or outdated after running "Update prices."
- **Causes**: Incorrect API keys, invalid symbols, or API limits.
- **Solutions**:
  1. Verify API keys in the Configuration sheet (e.g., CoinMarketCap for crypto, Polygon.io for options). For options, ensure you have at least an "Options Starter" subscription (or superior) from Polygon.io to fetch live snapshot prices.
  2. Check asset symbols for accuracy (e.g., "BTC" for Bitcoin).
  3. Run "Update prices" manually and wait for completion.
  4. For equities, refresh the page to get the latest `GOOGLEFINANCE` value. `GOOGLEFINANCE` updates prices approximately every minute. You can also set your spreadsheet setting "recalculation" to "On change and every minute".
- **Example**: If BTC prices don't update, confirm your CMC API key is active and the symbol is "BTC".
- **Prevention**: Test API keys periodically and avoid exceeding rate limits.

## API errors or rate limits

- **Symptoms**: Error messages like "API key invalid" or "Rate limit exceeded."
- **Causes**: Expired keys, incorrect setup, or high usage.
- **Solutions**:
  1. Regenerate API keys from the provider (CoinMarketCap or Polygon.io).
  2. Update keys in the Configuration sheet and save.
  3. Reduce update frequency or upgrade to paid API plans for higher limits.
- **Example**: If Polygon.io returns a rate limit error, wait a few minutes or switch to a higher limit subscription.
- **Prevention**: Monitor usage on provider dashboards and refresh prices at reasonable intervals.

## Calculation errors in trades

- **Symptoms**: Incorrect P/L, unmatched trades, or `#ERROR!` in cells.
- **Causes**: Data entry mistakes, mismatched currencies, or formula issues.
- **Solutions**:
  1. Review trade entries in the Transactions sheet for accuracy (dates, quantities, prices).
  2. Ensure base currency is set correctly in Configuration.
  3. Run "Generate trades" after fixes and check for errors.
  4. For tax calculations, verify rates in Configuration match your jurisdiction.
- **Example**: If a sell trade shows wrong gains, confirm the buy trades are entered and matched via FIFO/LIFO.
- **Prevention**: Double-check entries in your Transactions sheet.

:::info
It's possible for an asset to increase in value (e.g., TSLA went from $200 to $250), but if the currency conversion rate decreased during the same period, it could result in an overall negative ROI and a loss for the trade.
:::

## Snapshot failures

- **Symptoms**: No daily snapshots or errors in logs.
- **Causes**: Incorrect hour setting, disabled triggers, or permission issues.
- **Solutions**:
  1. Confirm "daily_snapshot_hour" in Configuration is a valid 24-hour time.
  2. Ensure assets have "Take snapshot" checked.
  3. Make sure snapshot trigger is set by clicking on Snapshots > Set up snapshots trigger.
- **Example**: If snapshots miss at 9 AM, verify the hour is set to 9 and triggers are active.
- **Prevention**: Test snapshots manually and review logs for patterns.

:::info
The snapshot hour is set in GMT. Adjust for your timezone (e.g., 16:00 in New York is 20:00 or 21:00 GMT depending on daylight saving).
:::

## Chart display problems

- **Symptoms**: Charts not updating or showing incorrect data.
- **Causes**: Configuration mismatches or data issues.
- **Solutions**:
  1. Adjust "Num days" or "Num assets" in Chart Configuration.
  2. Ensure snapshots are current and assets are included.
- **Example**: If the ROI chart misses assets, increase "Num assets" in Configuration.
- **Prevention**: Keep Configuration settings aligned with your portfolio size.

## General tips

- **Backups**: Regularly export your sheet to avoid data loss.
- **Updates**: Ensure the add-on is up-to-date via the Google Workspace Marketplace.
- **Support**: For unresolved issues, provide your temporary user key and details when contacting support.

If these steps don't help, refer to the [FAQ](/faq).
