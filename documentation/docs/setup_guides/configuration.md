---
title: Configuration
slug: /setup-guides/configuration
description: How to obtain and prepare the official Google Sheets template for the Portfolio Tracker add-on.
tags: [template, setup, getting-started]
---

# Configuration Sheet

The Configuration sheet is the central place to set up all parameters for the Portfolio Tracker add-on. It consists of multiple sections that control how the add-on behaves, including general settings, asset definitions, and more. Proper configuration ensures accurate tracking and reporting of your portfolio.

## General Configuration

This section configures the core settings of the add-on. These settings apply globally to your portfolio.

- **matching_method**: Determines the method for matching buy and sell transactions. Options are "LIFO" (Last In, First Out) or "FIFO" (First In, First Out). Default: FIFO.  
  _Example_: Set to "FIFO" if you want to sell the oldest shares first.
- **cmc_api_key**: Your CoinMarketCap API key for fetching cryptocurrency prices. Obtain it from [CoinMarketCap](https://coinmarketcap.com/api/).  
  _Note_: Required for crypto assets; leave blank if not trading crypto or if you prefer to use your own method to update the prices.
- **polygon_api_key**: Your Polygon.io API key for fetching stock and options data. Obtain it from [Polygon.io](https://polygon.io/).  
  _Note_: Required for options; leave blank if not needed or if you prefer to use your own method to update the prices.
- **dashboard_days_delta_total**: The number of days to look back in snapshots to calculate the percentage change in portfolio value.  
  _Example_: Set to 30 for a monthly delta comparison.
- **base_currency**: The primary currency for your portfolio (e.g., USD, EUR). Default: USD.  
  _Note_: All values will be converted to this currency under the columns with "b. curr.".
- **daily_snapshot_hour**: The hour (in 24-hour format) when daily snapshots are taken.  
  _Example_: Set to 9 for 9 AM snapshots.

## Asset Configuration

Define all assets you trade here. Each asset requires specific details for accurate tracking.

For each asset, configure the following columns:

- **Symbol**: The ticker symbol (e.g., TSLA for Tesla stock).
- **Asset type**: Either "equity" or "crypto".
- **Currency**: The asset's trading currency (e.g., USD).
- **CMC_id**: The CoinMarketCap UUID for crypto assets (leave blank for equities). Only required if the Symbol is not returning the correct coin's price.
- **Take snapshot**: Checkbox to include the asset in daily snapshots.
- **In Summary**: Checkbox to include the asset in summary tables.
- **Current price**: Leave blank; it updates automatically via "Update prices".

_Example_: For Bitcoin, set Symbol to "BTC", Asset type to "crypto", Currency to "USD", CMC_id: leave blank as there is only one BTC, and check both checkboxes.

_Note_: Run "Update prices" to populate the current price column.

## Trades Accounts

List the accounts used for transactions. Add one account name per line.

_Example_:

- Fidelity
- Kraken

_Note_: These will appear as options when entering transactions.

## Trades Categories

Define categories for classifying trades. Refer to the [Trades Categories documentation](/advanced/trades_categories) for detailed guidance.

_Example_:

- Trading
- HODL

_Note_: Custom categories help in analyzing matching trades within a specific category without taking into consideration taxes.

## Option Contracts

Configure options contracts you trade. Enter only the Ticker (e.g., "NVDA271217C00090000"), and other fields auto-populate if you copy/paste the dummy row provided in the template.

- **Ticker**: The full options ticker.
- **Current price**: Updates via "Update prices".
- **Root symbol**: Auto-filled using `=PT_EXTRACT_OPTION_ROOT_SYMBOL(Q<rowNumber>)`.
- **Exp. date**: Auto-filled using `=PT_EXTRACT_OPTION_EXPIRY_DATE(Q<rowNumber>)`.
- **Days to exp.**: Auto-calculated with `=IF(TODAY() > DATEVALUE(T<rowNumber>), 0, DAYS(T<rowNumber>, TODAY()))`.
- **Has open trades**: Set to "yes" or "no" after running "Generate trades". Remove contracts with "no".

_Example_: Enter "AAPL240315C00150000" for an Apple call option expiring March 15, 2024.

_Note_: Ensure the ticker format is correct for auto-extraction.

## Tax Rates

Set tax rates for different asset types and holding periods.

For each type (equity, options, crypto), specify rates for "long" (held >365 days) and "short" (held ≤365 days) trades. Add rows for additional years.

_Example_:

- Equity, Long: 15%
- Equity, Short: 30%
- Crypto, Long: 0% (if tax-free)

_Note_: Rates apply to capital gains calculations.

## Stock Splits

Record stock splits for equities (or root symbols for options-only assets).

- **Ticker**: The equity ticker (e.g., TSLA).
- **Date**: The split date (e.g., 2022-08-25).
- **Split amount**: The split ratio (e.g., "10" for a 10:1 split).

_Example_: For a 2-for-1 split of AAPL on 2020-08-31, enter Ticker: AAPL, Date: 2020-08-31, Split amount: 2.

_Note_: This adjusts historical prices and holdings.

## Snapshot Custom Data

Add custom key-value pairs to save in daily snapshots for analysis. See [Snapshots documentation](/advanced/snapshots).

_Example_:

- Key: usdeur, Value: =GOOGLEFINANCE("USDEUR") (stores USD/EUR exchange rate).

_Note_: Use Google Sheets formulas for dynamic values.

# Chart Configuration

Customize charts in the Dashboard sheet.

- **Performance over time** chart:
  - **Num days**: Total days to display (e.g., 365 for a year).
- **Assets ROI** chart:
  - **Num assets**: Number of top assets to include, ordered by Asset Configuration.
- **Asset performance** chart:
  - **Num assets**: Number of assets to include, ordered by Asset Configuration.
  - **Num days**: Days to look back for performance calculation (e.g., 90).

_Example_: Set "Performance over time" to 180 days for a 6-month view.
