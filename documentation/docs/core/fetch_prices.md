---
id: fetch_prices
title: Fetch Prices
slug: fetch_prices
description: Learn how to update live prices for crypto, options, and equities across your portfolio tracker.
tags:
  [
    prices,
    update,
    crypto,
    options,
    equities,
    portfolio-tracker,
    tradegist,
    google-sheets,
  ]
---

# Fetch Prices

To ensure your portfolio reflects current market conditions, you need to regularly update the live prices of your assets. This applies to crypto, options contracts, and equities.

Updating prices will refresh the asset valuations everywhere in your spreadsheet, including the Dashboard, Open Positions Summary sheet, and Analysis sheet.

To trigger an update, navigate to the custom add-on menu and select **Menu > Update prices**.

## Equities

When the "Update prices" action is triggered, the add-on automatically handles stock and ETF prices:

- **Empty Cells:** If the price cell for an equity asset is empty, the add-on will automatically insert the standard `GOOGLEFINANCE` formula for you.
- **Existing Values:** If there is already a value or your own custom formula in the cell, the add-on will leave it exactly as is. This gives you the flexibility to use alternative mechanisms or custom APIs to fetch equity prices if you prefer.

## Option Contracts

Calling "Update prices" will also update the prices and delta values for all your option contracts, **provided you have configured a Massive API key**.

- If an API key is not provided, the add-on will not override your existing prices.
- As with equities, you can manually input your own custom formulas to fetch option contract prices instead.

:::warning Note on Delta Values and the Massive API
According to the Massive API documentation, the greeks information might not be returned in certain scenarios, such as when an option contract is deep in the money.

To prevent missing delta values from breaking your sheet and downstream calculations, the add-on applies a failsafe:

- **Call Options:** Applies a default delta of `1` whenever the Massive API does not return a value.
- **Put Options:** Applies a default delta of `-1` whenever the Massive API does not return a value.
  :::
