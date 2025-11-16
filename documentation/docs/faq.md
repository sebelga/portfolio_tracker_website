---
id: faq
title: FAQ
description: Frequently asked questions about the Portfolio Tracker add-on for Google Sheets.
tags: [faq, portfolio-tracker, google-sheets]
---

# FAQ

## How do I add more assets to the configuration?

The number of assets you can add by default in the configuration is limited by the area with the light yellow background, which extends until row 100. If you need to add more assets, extend the named range to include your complete list.

To do that, click on "Data" > "Named ranges" and locate the "asset_config" named range. You can edit the named range and modify the last row to include all of your assets.

You can then apply the same light yellow background to the new named range area.

## How do I set up the add-on for the first time?

1. Obtain the official Google Sheets template from the [setup guide](/setup-guides/official-template).
2. Install the Portfolio Tracker add-on from the Google Workspace Marketplace.
3. Configure your API keys (CoinMarketCap for crypto, Polygon.io for options) in the Configuration sheet.
4. Add your assets, accounts, and tax rates in the respective sections of the Configuration sheet.
5. Enter your initial trades in the Transactions sheet and run "Generate trades" to populate calculations.

_Note_: Ensure your Google account has permissions to use add-ons and access external APIs.

## What is the difference between FIFO and LIFO matching methods?

- **FIFO (First In, First Out)**: Matches the oldest buy transactions first when selling. Default and commonly used for tax purposes in many jurisdictions.
- **LIFO (Last In, First Out)**: Matches the most recent buy transactions first. May affect tax calculations differently.

_Example_: If you bought 100 shares at $10 each on Day 1 and 100 at $15 on Day 2, selling 100 shares under FIFO would use the $10 cost basis; under LIFO, it would use $15.

## How are tax rates applied?

Tax rates are set in the Configuration sheet for long-term (>365 days) and short-term (≤365 days) holdings, per asset type (equity, options, crypto). The add-on calculates capital gains based on matched trades and applies the appropriate rate.

_Note_: Consult a tax professional, as rates vary by location and may change annually.

## Why are my prices not updating?

- Check that your API keys are correctly entered in the Configuration sheet.
- Ensure the asset symbols are accurate (e.g., "BTC" for Bitcoin).
- Run "Update prices" manually from the add-on menu.

## How are live prices fetched?

- **Equity**: By adding the `GOOGLEFINANCE` formula.
- **Crypto**: Using your CoinMarketCap API key.
- **Options**: Using your Polygon.io API key.

## How do I update GOOGLEFINANCE prices automatically?

To ensure GOOGLEFINANCE prices update automatically without manual refreshes, adjust your spreadsheet settings. Go to **File > Settings**, then select the **Calculation** tab. Set **Recalculation** to **"On change and every minute"**. This allows GOOGLEFINANCE formulas to refresh prices approximately every minute.

_Note_: This setting applies to the entire sheet and may increase recalculation frequency, potentially affecting performance with large datasets.

## How do I handle stock splits?

Record splits in the Configuration sheet under "Stock Splits" with the ticker, date, and split ratio. The add-on adjusts historical prices and holdings accordingly.

_Example_: For a 2-for-1 split of AAPL on 2020-08-31, enter Ticker: AAPL, Date: 2020-08-31, Split amount: 2. This will halve historical prices before the split.

## Can I import trades from another platform?

The add-on does not support direct imports. Manually enter transactions into the Transactions sheet, or use Google Sheets' import features to copy data from CSV exports. You can also connect services like Zapier to automatically insert the transactions based on events from your brokerage accounts like HTTP hooks.

_Tip_: Ensure columns match the template (e.g., Date, Asset, Symbol, Volume, Price).

## What are snapshots and how do they work?

Snapshots capture your portfolio's state daily, including values, holdings, and custom data. They enable performance tracking over time and are used for Dashboard charts.

_Configuration_: Set the snapshot hour in the Configuration sheet and ensure assets have "Take snapshot" checked.

## How do I customize charts on the Dashboard?

Adjust settings in the Configuration sheet under "Chart Configuration," such as the number of days or assets to display. Changes apply automatically to the Dashboard.

_Example_: Set "Num days" to 180 for a 6-month performance chart.

## Is my data secure?

Data is **only** stored in your Google Sheets file, which uses Google's security. The add-on does not transmit data to external servers beyond API calls for prices.

_Note_: Regularly back up your sheet.

## How do I report bugs or request features?

Contact support via the add-on's help menu. For bugs, provide your temporary user key, which you can find through the menu "Troubleshooting / Show temporary user key", along with as many details as possible of what you were doing and the error messages.
