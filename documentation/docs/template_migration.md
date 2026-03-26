---
id: template_migration
title: Template Migration Guide
slug: template-migration
description: Learn how to successfully migrate your existing TradeGist spreadsheet and apply updates from newer template versions.
tags: [updates, migration, template, tradegist, google-sheets]
---

# Template Migration Guide

The TradeGist template continuously evolves with bug fixes, new core sheet features, and improvements to provide you with the best portfolio tracking experience.

The standard and most robust migration path is to make a new copy of the [latest template version](/setup-guides/official-template) and simply copy over the data from your original sheet (specifically from the **Transactions**, **Configuration**, **Cash** and **Snapshots** tabs).

However, we understand that copying over data for every minor update can be tedious and prone to human error. For that reason, we document the specific structural changes made in each version. Using this guide, you can manually replicate those adjustments in your existing spreadsheet without undergoing a full migration process.

:::note Roadmap Highlight
In the future, we plan to implement a script that can auto-migrate your template structure with a single click, but that feature is still further down on our roadmap!
:::

:::important
If you choose to manually migrate your existing sheet, you **must update the template version number** internally so the add-on knows which version you are using.

1. Click the **"All sheets"** hamburger menu in the bottom-left corner of Google Sheets.
2. Click on the grayed-out **`__AddOnConfig`** sheet to unhide and open it.
3. Locate the `version` key and update the value in the adjacent cell to the version you are migrating to (e.g., `0.6.0`).
   :::

## Migration Paths

### From `v0.5.2` to `v0.6.0`

Version `v0.6.0` introduces a licensing system and refines the data-entry structure in the Transactions sheet. To update an existing `v0.5.x` sheet to `v0.6.0`, apply the following structural changes:

1.  **Reorder Transactions Columns**: Navigate to your **Transactions** sheet and reorder the columns to match the new optimized sequence. The new required order is:
    - Date
    - Asset type
    - Op
    - Ticker
    - Volume
    - Price
    - Fees
    - FX rate
    - Currency
    - Account
    - Category
    - Notes
    - **Amount** (Moved to the far right)

    _Note_: Because the **Amount** column is auto-calculated, it has been given a blue background color to indicate that you should not enter values here manually.

2.  **Add License Key Configuration**: Navigate to the **Configuration** sheet. In the **General Configuration** section, add a new row:
    - **ID**: `license_key`
    - **Description**: "TradeGist license key" (or similar)
    - **Value**: Paste your valid TradeGist license key.
