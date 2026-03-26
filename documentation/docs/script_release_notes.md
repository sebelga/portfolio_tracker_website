---
slug: /release-notes-addon
sidebar_position: 11
id: release-notes-addon
title: Add-on Release Notes
description: Stay up to date with the latest improvements, bug fixes, and features added to the TradeGist Add-on script.
tags: [updates, release-notes, changelog, script, add-on]
---

# Add-on Release Notes

The TradeGist Google Workspace Add-on follows a different release schedule than the [Google Sheets template](/release-notes-template). This page details all the behind-the-scenes script improvements, tweaks, and bug fixes.

:::info Automatic Updates
New versions of the Add-on are automatically rolled out to your installation—you don't need to do anything. You can always verify which version of the Add-on you are running by selecting **TradeGist > Troubleshooting > Show App information** from the Google Sheets menu.
:::

## v4.0.1

### Bug Fixes

- **Empty Options Configuration**: Fixed a bug that triggered an error during price fetching when no options contracts were defined in the Configuration sheet.
- **Preserve Custom Prices**: Prevented automated price fetching from overwriting manually entered prices in the Configuration sheet. This allows users to safely rely on custom formulas to fetch equity prices instead of being restricted solely to `GOOGLEFINANCE`.

## v4.0.0

### New Features & Improvements

- **Licensing Support**: Added backend processing to support the new validation system for licenses and subscriptions.
- **Updated Tabular Mapping**: Adjusted script internal logic to correctly handle the new, reordered columns within the Transactions sheet (introduced in template v0.6.0).
