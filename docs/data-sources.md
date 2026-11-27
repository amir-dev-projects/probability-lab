# Lotto Max data sources and validation

Last reviewed: 2026-11-26

This document records the sources used to assemble and verify LotteryLab's Lotto Max history. A source being listed here does **not** mean all of its historical data has been imported.

## Source register

### 1. WCLC — primary source

- [WCLC recent winning numbers](https://www.wclc.com/recent-winning-numbers.htm)
- [WCLC Lotto Max and EXTRA results](https://www.wclc.com/winning-numbers/lotto-max-extra.htm)
- [WCLC Lotto Max since inception archive](https://www.wclc.com/display-on/display-on-downloads/lotto-max-since-inception.htm)
- [WCLC publications and forms](https://www.wclc.com/for-players/publications-forms.htm)

Use WCLC as the preferred authority for draw results and the historical archive. WCLC explicitly states on its recent-results page that its official information and prize calculations prevail if there is a discrepancy.

The downloaded WCLC archive supplied for this project is a PDF export of the historical spreadsheet. Its visible coverage is September 25, 2009 through November 3, 2026. It contains separate Maxmillions records; those records must not be interpreted as regular Lotto Max draws. The PDF extraction needs row-level validation before import because some lines do not preserve clear field boundaries.

### 2. LottoMaxNumbers.com — secondary comparison source

- [LottoMaxNumbers.com home](https://www.lottomaxnumbers.com/)
- [Past Lotto Max numbers](https://www.lottomaxnumbers.com/past-numbers)
- [Lotto Max timeline](https://www.lottomaxnumbers.com/timeline)

Use this independent third-party website to cross-check draw dates, main numbers, bonus numbers, and contextual game-history notes. Its Past Numbers page provides recent results and links to year-based historical archives. The site's timeline describes several rule changes.

**Authority limitation:** LottoMaxNumbers.com is not the lottery operator. Its footer states that it is not affiliated with the Ontario Lottery and Gaming Corporation and that its content and operations have not been approved or endorsed by OLG. Treat it as a secondary reference, not the final authority when sources disagree.

### 3. User-provided CSV — candidate reconciliation source

A CSV previously supplied in this project covers a recent period ending November 24, 2026. Treat it as a candidate comparison dataset only until its provenance and each draw are checked against authoritative results. Do not assume that the file's source or calculations are official.

## Verified supplemental results

The WCLC PDF archive ends on November 3, 2026. The six subsequent main draws from November 6 through November 24 have now been checked against both WCLC's results archive and LottoMaxNumbers.com's Past Numbers page.

The verified records are stored in [data/lotto-max/supplemental-2026-11.json](../data/lotto-max/supplemental-2026-11.json). This is a six-draw supplement, **not** the complete historical dataset. It contains only the seven main numbers and bonus number. Maxmillions, MaxPlus, and EXTRA are deliberately excluded and must remain separate if modelled later.

## Rule-history notes requiring official confirmation

The secondary site's timeline reports:
- Lotto Max launched on September 25, 2009.
- The ball pool increased from 49 to 50 ahead of the May 14, 2019 draw.
- The number matrix changed to 7/52 ahead of the April 14, 2026 draw.

These are useful research leads, not yet approved canonical rule metadata. Confirm the effective dates and full game mechanics against official WCLC / Interprovincial Lottery Corporation rule publications before implementing date-based validation. Do not infer earlier or intermediate rule periods from the current 7/52 rules.

## Import and validation policy

Before a draw enters the canonical historical dataset:

1. Record the draw date and exactly seven main numbers.
2. Store the bonus number in its own field; it is not an eighth main number.
3. Validate uniqueness and the date-appropriate number range using a confirmed rules version.
4. Keep Maxmillions, MaxPlus, EXTRA, and provincial add-ons separate from the seven-number main draw. Model each separately only if needed.
5. Compare the record against WCLC first and the secondary site as a cross-check.
6. Investigate every mismatch; never silently choose one value or average sources.
7. Check for duplicate dates, missing scheduled draws, malformed rows, and chronological ordering.
8. Preserve source URLs, retrieval date, and validation status in dataset metadata.

The six supplemental records are verified against both listed result sources. The full historical archive has not yet been parsed, reconciled, or certified.
