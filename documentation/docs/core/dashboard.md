---
id: dashboard
title: Dashboard sheet
slug: core/dashboard-sheet
description: Overview of the Dashboard sheet, the visual interface for monitoring your portfolio's performance and status.
tags: [dashboard, portfolio-tracker, google-sheets]
---

# Dashboard Sheet

The Dashboard sheet serves as the primary visual interface for your Portfolio Tracker add-on. It provides a quick, at-a-glance view of your investment portfolio's current status, performance trends, and key metrics. All data displayed here is automatically populated from your Trades sheet and snapshots, ensuring real-time accuracy based on your transaction history.

## Purpose and Overview

- **Centralized View**: Consolidates essential portfolio information into one sheet, eliminating the need to navigate multiple tabs.
- **Real-Time Updates**: Refreshes automatically when you run add-on functions like "Generate trades" or "Update prices."
- **Customization**: Charts and displays can be tailored via the [Configuration sheet](/setup-guides/configuration#chart-configuration).

## Key Components

### Summary

- **Portfolio Summary**: Displays total value, gains/losses, and breakdowns by asset type (e.g., equities, crypto, options).
- **Top holdings and bottom 5 performers**: Lists the top 5 holdings by value and the bottom 5 performers by ROI to highlight strengths and weaknesses.
- **Tax amount**: Shows the unrealized and realized tax amounts for the current year, based on configured tax rates.

_Example_: The Portfolio Summary might display a total value of $100,000 with $5,000 in gains, while Top holdings could list TSLA as the top performer with 15% ROI.

### Charts

Visual representations of your portfolio's performance, configurable in the [Configuration sheet](/setup-guides/configuration):

- **Performance Over Time**: A line chart showing portfolio value changes over a specified number of days (e.g., 365 days).
- **Overall performance**: A bar chart highlighting the return on investment for top assets, ordered by your Asset Configuration.
- **Asset Performance**: A chart comparing asset performance over a set period (e.g., 90 days), focusing on price changes and holdings.

_Note_: Adjust chart parameters like "Num days" or "Num assets" in the Configuration sheet to customize what is displayed.

## Data Sources and Updates

- **Primary Source**: Data is derived from the Trades sheet, where transactions are logged, and snapshots, which capture daily portfolio states.
- **Update Process**: Run "Generate trades" to refresh calculations, or "Update prices" to pull latest market data.
- **Dependencies**: Ensure your API keys (e.g., for CoinMarketCap or Polygon) are set in the Configuration sheet for accurate pricing.

## Tips for Use

- Regularly review the Dashboard after adding new trades to monitor impacts.
- Use the charts to identify trends, such as underperforming assets.
- If data seems outdated, check for errors in the Trades sheet or rerun add-on functions.

For detailed configuration options, refer to the [Configuration sheet](/setup-guides/configuration).
