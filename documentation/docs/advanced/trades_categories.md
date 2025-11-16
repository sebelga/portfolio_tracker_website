---
id: trades_categories
title: Trades Categories
slug: trades-categories
description: Guide to using trades categories to isolate and analyze specific transactions in the Portfolio Tracker add-on.
tags: [trades-categories, portfolio-tracker, google-sheets]
---

# Trades Categories

Trades categories allow you to label transactions for separate analysis, without affecting the main Trades sheet calculations (e.g., P&L, ROI, taxes). This is useful for isolating specific strategies or timeframes, such as short-term trading versus long-term holding.

## Why Use Categories?

- **Isolation**: Analyze subsets of trades independently. For example, separate day-trading profits from long-term investments.
- **Matching Control**: By default, sell transactions match buys based on the full transaction history (e.g., FIFO). Categories ensure sells match only within the same category.
- **No Impact on Main Calculations**: Categories don't alter overall P&L or taxes in the Trades sheet.

_Example_:  
You buy GOOG shares multiple times at low prices. Later, you enter a short-term trade (buy and sell within a week). Without a category, the sell might match an old buy under FIFO. By assigning a "trading" category to the short-term buy/sell, they match as one isolated trade.

## Setting Up Categories

1. **Add Categories in Configuration**: Go to the Configuration sheet, under "Trades Categories," add one line per category (e.g., "Trading", "HODL").
2. **Assign in Transactions**: In the Transactions sheet, select a category from the dropdown in the "Category" column. (If the column is hidden, look for the "+" toggle in the header.)
3. **Generate Trades**: Run "Generate Trades." This creates the main Trades sheet and additional sheets for each category, named `cat__<categoryName>` (e.g., `cat__Trading`).

_Note_: Category sheets include trade details but exclude tax-related columns ("Tax rate", "Tax value", "Reentry if closed"), as taxes are calculated globally in the main Trades sheet.

## Managing Categories

- **Editing**: Change category names in Configuration, update the Transactions rows with the new category then re-run "Generate Trades" to update sheets.
- **Deleting**: If you no longer need a category, delete its sheet (e.g., `cat__Trading`). Sheets regenerate automatically on the next "Generate Trades" run.
- **Multiple Categories**: A transaction can have one category; use different categories for different strategies.

_Tip_: Regularly review category sheets for strategy-specific insights.

## Troubleshooting

- **Dropdown Not Appearing**: Ensure categories are added in Configuration and the column is visible. Also, make sure the Data Validation extends to all transaction rows. Check the range in **Data > Data Validation** and confirm the "Value contains one from range" validation for the "Category" column.
- **Sheets Not Generating**: Run "Generate Trades" after assigning categories.
- **Matching Issues**: Verify category assignments for accurate isolation.
