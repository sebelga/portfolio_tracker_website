---
slug: /
sidebar_position: 1
id: intro
title: Introduction
description: Welcome to the Portfolio Tracker Add-on documentation. Learn how to track your stock, crypto, and options investments in Google Sheets™.
tags: [introduction, getting-started, portfolio-tracker, google-sheets]
---

# Introduction

Welcome to the Portfolio Tracker Add-on for Google Sheets™! This documentation provides a comprehensive guide to help you get started, configure, and make the most of the add-on for tracking your stock, crypto, and options investments.

The Portfolio Tracker Add-on transforms your Google Sheets™ spreadsheet into a powerful tool for managing your investment portfolio. It automates trade matching, calculates profits and losses (P&L), handles tax computations, fetches live prices, and generates insightful dashboards—all within a single spreadsheet.

## Key Concepts

Before diving into setup and usage, let's cover the foundational concepts of how the add-on works.

### Spreadsheet Template

The add-on is designed to work with a specific Google Sheets™ template file. This template provides the pre-structured layout, formulas, and scripts needed for the add-on to function optimally.

- **How to Get Started**: Download the template from our website and make a personal copy in your Google Drive. This ensures you have full control and can customize it without affecting the original.
- **Why a Template?**: The template includes essential sheets, scripts, and configurations that integrate seamlessly with the add-on. Using it guarantees compatibility and reduces setup errors.

### User Input Sheets

The spreadsheet is designed for minimal manual input to keep things simple and efficient. Only two sheets require your direct input:

- **Configuration Sheet**: This is where you set up global settings such as your assets, base currency, tax rates, API keys, and other preferences. The add-on uses these to process your data accurately.
- **Transactions Sheet**: Here, you log your buy, sell, deposit, withdrawal, and other transaction details. The add-on automatically processes these entries to generate trades, P&L, and reports.

All other sheets in the spreadsheet (e.g., Trades, Dashboard, Snapshots) are automatically generated and updated by the add-on based on your inputs in the Configuration and Transactions sheets. Do not edit these generated sheets manually, as the add-on will overwrite them during processing.

## Getting Started with Minimum Configuration

To quickly set up and begin tracking your portfolio, focus on the essentials in the Configuration sheet. We'll cover the minimum required settings below, with more advanced options detailed in dedicated configuration pages later in this documentation.

1. **Accounting Method**: Choose FIFO (First-In-First-Out) or LIFO (Last-In-First-Out) for trade matching.
2. **API Keys (if needed)**: For live prices on crypto or options, add your CoinMarketCap or Polygon.io keys.
3. **Assets Configuration**: Under the "Assets configuration" section in the Configuration sheet, add a few assets. For each asset, insert their symbol, asset type (equity or crypto), and their currency. Leave the "Take snapshot" and "In Summary" checkboxes ticked. For crypto assets, set the CMC_id value to the CoinMarketCap ID (most of the time the symbol like "BTC" is enough; in case of price error, use the unique ID number).

Once these are set, enter a few sample transactions in the Transactions sheet, and run the add-on to see your dashboard come to life. For step-by-step instructions, proceed to the [Installation and Setup](/installation-setup) page.

This documentation is organized into sections for easy navigation:

- **Setup Guides**: Installation, configuration, and initial setup.
- **Core Features**: Detailed explanations of trade matching, tax calculations, live prices, and more.
- **Advanced Topics**: Multi-currency support, snapshots, utility functions, and troubleshooting.

If you have questions or need support, check our [FAQ](/faq) or contact us via the website.

Happy tracking!
