---
id: getting-started
title: Getting Started
slug: /getting-started
description: A step-by-step guide to setting up the Portfolio Tracker Add-on with minimum configuration to begin tracking your investments.
tags: [getting-started, configuration, setup, portfolio-tracker]
sidebar_position: 2
---

# Getting Started

:::info
Before following this guide, ensure you've completed the [Official Template](/setup-guides/official-template) and [Install & Uninstall](/setup-guides/install-uninstall) steps.
:::

To quickly set up and begin tracking your portfolio, focus on the essentials in the Configuration sheet. This guide covers the minimum required settings, with more advanced options detailed in the [dedicated configuration page](/setup-guides/configuration) later in this documentation.

## Configure

Navigate to the Configuration sheet to set up the basic parameters for the add-on. Below are the minimum configurations needed to get started.

### Accounting Method

Choose FIFO (First-In-First-Out) or LIFO (Last-In-First-Out) for trade matching. This determines how the add-on pairs your buy and sell transactions to calculate realized gains and losses.

- **FIFO**: Matches the oldest purchases with sales first. This is the default method in many jurisdictions for tax purposes.
- **LIFO**: Matches the most recent purchases with sales first. Use this if it aligns with your accounting preferences or tax strategy.

Select your preferred method in the Configuration sheet under the "General Configuration" section.

### Currency Settings

Define the **base_currency** (e.g., USD, EUR, GBP) in the Configuration sheet. This is the currency in which your total portfolio value and P&L will be calculated.

:::tip Currency Formats
If you need to change how dates or currencies are displayed (e.g., changing from $1,000.00 to 1.000,00 €), refer to the spreadsheet "Locale" in the advanced topics [Locale](/setup-guides/locale).
:::

## Update Prices and Generate Trades

:::tip Troubleshooting the Menu
If you click **Extensions** > **Portfolio tracker** and only see one option ("Enable extension"), click it to activate the full suite of tools. Once enabled, the full menu described below will appear.
:::

### Update Current Prices

Once you have set your API keys (if needed) we can update the current prices. Under the **Extensions** menu > **Portfolio tracker**, click on **Update prices**.
This will populate the `GOOGLEFINANCE` formulas for your equities and fetch the live prices of your crypto assets.

### Generate the Trades

Once you have the asset current prices, and you have added some transactions, it is time to generate your trades.
Under the **Extensions** menu > **Portfolio tracker**, click on **Generate trades**. After a few seconds you will have all your trades inside the "Trades" sheet.

Then check the **Summary** sheet to see an aggregated view of your holdings, and navigate to the **Dashboard** sheet for a visual breakdown of your performance.

## Next Steps

Now that you've generated your initial trades, explore the [Trades](/core/trades) sheet for detailed breakdowns, the [Summary](/core/open-positions-summary) for overviews, and the [Dashboard](/core/dashboard) for visualizations.
