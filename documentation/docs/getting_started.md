---
id: getting-started
title: Getting Started
slug: setup-guides/getting-started
description: A step-by-step guide to setting up the Portfolio Tracker Add-on with minimum configuration to begin tracking your investments.
tags: [getting-started, configuration, setup, portfolio-tracker]
---

# Getting Started

To quickly set up and begin tracking your portfolio, focus on the essentials in the Configuration sheet. This guide covers the minimum required settings, with more advanced options detailed in dedicated configuration pages later in this documentation.

:::warning
Make sure that you have a copy of the official template file. For more information, see the [official template](/setup-guides/official-template) guide.
:::

## Configuration Sheet

Navigate to the Configuration sheet to set up the basic parameters for the add-on. Below are the minimum configurations needed to get started.

### Accounting Method

Choose FIFO (First-In-First-Out) or LIFO (Last-In-First-Out) for trade matching. This determines how the add-on pairs your buy and sell transactions to calculate realized gains and losses.

- **FIFO**: Matches the oldest purchases with sales first. This is the default method in many jurisdictions for tax purposes.
- **LIFO**: Matches the most recent purchases with sales first. Use this if it aligns with your accounting preferences or tax strategy.

Select your preferred method in the Configuration sheet under the "General Settings" section.

### API Keys (If Needed)

For live prices on crypto or options, add your CoinMarketCap or Polygon.io keys. These are required only if you plan to track cryptocurrencies or options contracts with real-time pricing.

- **CoinMarketCap API Key**: Obtain a free or paid key from [CoinMarketCap](https://coinmarketcap.com/api/). Enter it in the designated field to enable crypto price fetching.
- **Polygon.io Key**: For options pricing, subscribe to the "Options Starter" plan at [Polygon.io](https://polygon.io/options) and input your API key.

If you're only tracking stocks, you can skip this step as Google Finance handles equity prices natively.

### Assets Configuration

Under the "Assets Configuration" section in the Configuration sheet, add a few assets to start tracking. For each asset, insert their symbol, asset type (equity or crypto), and their currency.

- **Symbol**: The ticker symbol (e.g., AAPL for Apple stock or BTC for Bitcoin).
- **Asset Type**: Select "equity" for stocks or "crypto" for cryptocurrencies.
- **Currency**: The currency in which the asset is denominated (e.g., USD). This will be the asset default currency for your transactions. You will be able to overwrite this value on specific transaction if need be.

For the "Current Price" column: leave it blank as the script will automatically set the the current price.

For the "CMC_id" column (only crypto): set the CMC_id value to either the coin ticker/symbol or the CoinMarketCap ID. While many coins can be identified by a ticker symbol (e.g., BTC for Bitcoin), these can sometimes change or be used for multiple cryptocurrencies. In case of price error, replace the symbol by the unique ID number ([UCID](https://support.coinmarketcap.com/hc/en-us/articles/20092704479515-Unified-Cryptoasset-ID-UCID)).

Leave the "Take Snapshot" and "In Summary" checkboxes ticked to enable daily snapshots and include the asset in summary views.

## Transactions Sheet

Navigate to the Transactions sheet where you will find a few transaction rows as a starting point. Some columns contain formulas, so we recommend editing the existing rows rather than adding new ones initially to avoid disrupting the structure.  
To add more transactions, duplicate the **entire** row by clicking on the row number to select the full row before copying and pasting it below.

To quickly get started, the required columns to fill are: "Date", "Asset type", "Symbol", "Op", "Volume", and "Price".

We will dig deeper into the other columns in the dedicated [Transactions](/core/transactions) documentation under Core Features.

:::warning
The template spreadsheet requires numbers to be in the US or UK format (dot for decimals). Read more about the spreadsheet "Locale" in the advanced topics [Locale](/advanced/locale).
:::

## Install the Add-on

If you haven't already, install the "Portfolio Tracker" Add-on. Go to the market place and click "Install".
You will have to give the Add-On some permission:

- Access to the current sheet (it only has access to the file you attach it to, none of your other sheets)

- To make external request. This is _only_ required to be able to fetch live prices (crypto and options). None of your transactions data is stored anywhere.

- To manage scripts and setup triggers for automated snapshots.

### Update Current Prices

Once you have set your API keys (if needed) we can update the current prices. Under the "Extensions" menu > "Portfolio tracker", click on "Update prices".
This will populate the `GOOGLEFINANCE` formulas for your equities and fetch the live prices of your crypto assets.

### Generate the Trades

Once you have the asset current prices, and you have added some transactions, it is time to generate your trades.
Under the "Extensions" menu > "Portfolio tracker", click on "Generate trades". After a few seconds you will have all your trades inside the "Trades" sheet. Use filters to narrow down on certain assets, asset type or any other metrics you want to analyze.

Then check the "Summary" sheet. You should see a summary by asset of your trades. You will find for each asset in one row the aggregated value of your trades (number of shares, option contracts (for equities), your cost basis, P&L, ROI, taxes due (if the position were closed)

Finally navigate to the Dashboard sheet. You should have a clear visual of the trades. It might not look perfect just yet, we will dig deeper in the "Dashboard" documentation under Core features
