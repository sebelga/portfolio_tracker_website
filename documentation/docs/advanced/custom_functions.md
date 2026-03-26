---
id: custom_functions
slug: custom-functions
title: Custom Functions
description: Reference guide for custom functions available in the TradeGist add-on.
tags: [custom-functions, portfolio-tracker, tradegist, google-sheets]
---

# Custom Functions

The TradeGist add-on provides custom functions for advanced analysis of trades, assets, and snapshots. These can be used in any sheet cell for deeper insights. Below is a complete list with descriptions and examples.

## Available Functions

### ASSET_HAS_SNAP(ticker)

Checks if an asset has "Take snapshot" activated. Returns TRUE or FALSE.  
**Example**: `=ASSET_HAS_SNAP("TSLA")` returns TRUE if snapshots are enabled for TSLA.

### ASSET_METRIC(ticker, metric)

Gets a specific metric for an asset with an open position. Metric must be a valid column ID from the `COLINDEX_OPEN_SUMMARY` function (see below).  
**Example**: `=ASSET_METRIC("TSLA", "roi")` returns the overall ROI for TSLA (including shares and options).

### ASSET_PRICE(ticker)

Retrieves the current price of an asset. This function reads the live value in the Asset configuration. Make sure to click "Update prices" to fetch the latest price.  
**Example**: `=ASSET_PRICE("NVDA")` returns the latest NVDA price.

### CAT(catId, range)

Gets values from a category sheet column. Use exposed named ranges like `c_ticker` for full columns.  
**Example**: `=CAT("Trading", c_ticker)` returns all ticker values from the `cat__Trading` sheet.

### COLINDEX_OPEN_SUMMARY(columnId)

Returns the column index for a specific "Open Positions Summary" column. Available IDs: "ticker", "livePrice", "spotQty", "optionsQty", "netUnits", "netExposure", "costBasis", "totalCost", "totalValue", "assetPl", "totalCostBcurr", "totalValueBcurr", "pl", "roi", "tax", "trades".  
**Example**: `=COLINDEX_OPEN_SUMMARY("totalValueBcurr")` returns the index (e.g., 15) for "Total value b. curr."

### CONFIG(id, defaultValue)

Gets a general config value from the Configuration sheet.  
**Example**: `=CONFIG("daily_snapshot_hour", 10)` returns the snapshot hour or 10 if not set.

### CURR_RATE(currency)

Gets the current exchange rate to the base currency.  
**Example**: `=CURR_RATE("USD")` returns the USD/EUR rate if base is EUR.

### CURR_RATE_AT(currency, date)

Gets the exchange rate for a specific date.  
**Example**: `=CURR_RATE_AT("USD", DATE(2025,4,16))` returns the USD/EUR rate on April 16, 2025.

### OPTION_PRICE(ticker)

Returns the option contract price from Asset Configuration. Run "Update prices" first.  
**Example**: `=OPTION_PRICE("NVDA250117C00300000")` returns the price for that option.

### OPTION_TYPE(ticker)

Returns the option contract type, "Call" or "Put" from Asset Configuration.  
**Example**: `=OPTION_TYPE("NVDA250117C00300000")` returns "Call".

### OPTION_DELTA(ticker)

Returns the option contract delta from Asset Configuration. Run "Update prices" first.  
**Example**: `=OPTION_DELTA("NVDA250117C00300000")` returns the delta for that option.

### SNAP_COL_LETTER(ticker, column)

Retrieves the Snapshots column letter for a ticker's value. Column: "value", "shares", or "price".  
**Example**: `=SNAP_COL_LETTER("TSLA", "shares")` returns the column letter (e.g., "E") for TSLA shares.

### SNAP_RANGE(ticker, column)

Returns the column range for a ticker in Snapshots.  
**Example**: `=SNAP_RANGE("NVDA", "value")` returns the range for NVDA values (e.g., "D2:D100").

### SNAP_VALUE_DELTA(ticker, currentValue, rowDelta)

Calculates the delta between current value and a previous snapshot.  
**Example**: `=SNAP_VALUE_DELTA("TSLA", 50000, 3)` returns the difference from 3 snapshots ago (e.g., 5000 if previous was 45000).

### SUM_REALIZED(range, year)

Sums column values for realized trades in a specific year. Use named ranges like `c_tax_value`.  
**Example**: `=SUM_REALIZED(c_tax_value, 2025)` sums tax values for realized 2025 trades.

### SUM_UNREALIZED(range)

Sums column values for unrealized trades.  
**Example**: `=SUM_UNREALIZED(c_tax_value)` sums unrealized tax values.

### TICKER_CURR(ticker)

Returns the currency of a specific asset.  
**Example**: `=TICKER_CURR("NVDA")` returns "USD".

### TICKER_CURR_RATE(ticker)

Returns the current conversion rate to base currency.  
**Example**: `=TICKER_CURR_RATE("NVDA")` returns the USD/EUR rate if base is EUR.

### TICKER_RATE_AT(ticker, date)

Returns the conversion rate for a specific date.  
**Example**: `=TICKER_RATE_AT("NVDA", DATE(2025,4,16))` returns the rate on April 16, 2025.

### TT(range)

Returns values from the Trades sheet. Use named ranges for full columns.  
**Example**: `=TT(c_ticker)` returns all tickers from the Trades sheet.

## Notes

- **Named Ranges**: Many functions work with exposed named ranges (e.g., `c_ticker`). See the [Named Ranges documentation](/advanced/named-ranges) for a full list.
- **Updates**: Some functions (e.g., prices) require running "Update prices" or "Generate Trades" first.
- **Errors**: If a function returns an error, check parameters and ensure data is available.
