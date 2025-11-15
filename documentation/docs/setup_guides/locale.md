---
id: locale
title: Spreadsheet Locale
description: Guide to understanding and managing the locale settings in your Portfolio Tracker Google Sheets template.
tags: [locale, portfolio-tracker, google-sheets]
---

# Spreadsheet Locale

The locale setting in Google Sheets determines how dates, numbers, and formulas are interpreted and displayed. The Portfolio Tracker template is designed with specific locale considerations to ensure formulas work correctly. Misconfigured locales can lead to errors in calculations, data entry, and formula parsing.

## Supported Locales

- The template sheet is set to the "United States" locale by default (accessible via File > Settings > Locale).
- It has been tested and is compatible with "United States" and "United Kingdom" locales.
- Other locales are not tested and may not function properly, potentially causing issues with formulas or data formatting.

:::warning
Do not change the locale to unsupported regions, as it could break the sheet's functionality.
:::

## Key Impacts of Locale Settings

### Decimal Delimiter

- The template requires the decimal separator to be a dot (`.`), as used in US and UK formats (e.g., 123.45).
- Formulas like `=SUMIFS(...)` rely on commas (`,`) as parameter separators. If the locale uses comas (`,`) for separators (common in European locales), these formulas will fail.
- Always ensure numbers use a dot for decimals to avoid calculation errors.

_Example_: In a US/UK locale, enter prices as "123.45". In a European locale (e.g., Germany), it might be "123,45", which would break the template.

### Date Formatting

- Locale affects how dates are entered and interpreted in formulas and cells.
- In "United States" locale: Dates are in MM/DD/YYYY format (e.g., "11/04/2025" means November 4, 2025).
- In "United Kingdom" locale: Dates are in DD/MM/YYYY format (e.g., "11/04/2025" means April 11, 2025).

_Tip_: Always double-check date entries to match your sheet's locale. If unsure, enter dates in a clear format like "2025-11-04" (YYYY-MM-DD), which is universally recognized.

## Tips for Copying Data

When importing transactions from another sheet or source:

1. Ensure all numbers (e.g., prices, quantities) are formatted with a dot as the decimal separator (US/UK style).
2. Convert dates to match the template's locale or use YYYY-MM-DD format.
3. After pasting, verify that formulas recalculate correctly and no errors appear.

_Example_: If copying from a European sheet with "123,45" as a price, manually replace commas with dots before pasting to avoid formula failures.

## Troubleshooting Locale Issues

- **Formulas not working**: Check if the locale changed accidentally. Reset to "United States" or "United Kingdom" via File > Settings.
- **Date errors**: Confirm the date format matches the locale.
- **Import problems**: Clean data in a separate sheet first, ensuring US/UK formatting, then copy to the Transactions sheet.
