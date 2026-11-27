# Lotto Max data sources and validation

Last reviewed: 2026-11-26

This document records the sources used to assemble and verify LotteryLab's Lotto Max history. A source being listed here does **not** mean all prize details are available for every draw.

## Source register

### 1. WCLC — primary source

- [WCLC recent winning numbers](https://www.wclc.com/recent-winning-numbers.htm)
- [WCLC Lotto Max results](https://www.wclc.com/winning-numbers/lotto-max-extra.htm)
- [WCLC Lotto Max since inception archive](https://www.wclc.com/display-on/display-on-downloads/lotto-max-since-inception.htm)
- [WCLC Lotto Max game page and prize structure](https://www.wclc.com/games/lotto-max.htm)
- [WCLC Lotto Max game conditions](https://www.wclc.com/display-on/display-on-downloads/lotto-max-3.0-game-conditions.htm)
- [WCLC publications and forms](https://www.wclc.com/for-players/publications-forms.htm)

Use WCLC as the preferred authority for draw results, advertised prize configurations, game conditions, and the historical archive. If sources disagree, official WCLC information prevails.

The downloaded WCLC archive supplied for this project is a PDF export of the historical spreadsheet. Its original supplied copy covers September 25, 2009 through November 3, 2026. The deploy workflow downloads the current WCLC archive, extracts its text, validates it, and generates normalized JSON datasets.

### 2. LottoMaxNumbers.com — secondary comparison source

- [LottoMaxNumbers.com home](https://www.lottomaxnumbers.com/)
- [Past Lotto Max numbers](https://www.lottomaxnumbers.com/past-numbers)
- [Lotto Max timeline](https://www.lottomaxnumbers.com/timeline)

Use this independent third-party website to cross-check draw dates, main numbers, bonus numbers, MAXPLUS results, MAXMILLIONS results, and contextual game-history notes.

**Authority limitation:** LottoMaxNumbers.com is not the lottery operator. Treat it as a secondary reference, not the final authority when sources disagree.

## Prize categories and analysis scope

LotteryLab focuses on prizes that can be won through number selections made by the player, plus the official prize outcomes associated with those selections.

- **Main jackpot:** the main 7/7 prize pool.
- **MAXPLUS:** separate $100,000 exact-match series introduced with the April 2026 game changes. The number of series is tied to the advertised jackpot amount.
- **MAXMILLIONS:** separate $1 million exact-match series when the main jackpot reaches the applicable threshold.
- **Main-draw subsidiary prizes:** match tiers such as 6/7 + bonus, 6/7, 5/7 + bonus, and others. Record the number of winners and actual payout per tier when official result detail is available.

**EXTRA is out of scope.** Its numbers are machine-generated and are not selected by the player, so LotteryLab will not import, analyze, compare, or include EXTRA results in statistics, prize-value comparisons, or number-selection research.

## Generated datasets

The GitHub Pages build generates and commits these files:

- [data/lotto-max/draws.json](../public/data/lotto-max/draws.json) — the seven main numbers and bonus number for every validated draw.
- [data/lotto-max/maxmillions.json](../public/data/lotto-max/maxmillions.json) — complete seven-number MAXMILLIONS series parsed from the WCLC archive, kept separate from the main draw.

The supplied archive plus the six verified November 2026 supplement records currently produce **1,288 main-draw records**, covering September 25, 2009 through November 24, 2026. The 1,282 dated records in the supplied WCLC PDF are merged with the six draws from November 6, 10, 13, 17, 20, and 24, 2026. If a later WCLC archive contains one of those dates, the build compares the records and stops on any mismatch rather than silently choosing one.

The WCLC archive yields **6,063 complete MAXMILLIONS series records** in the supplied copy. Fourteen incomplete or malformed MAXMILLIONS rows are excluded and listed in the generated file's `exceptions` array for follow-up. MAXPLUS results are not present in the WCLC since-inception archive and are not yet included in the generated historical side-draw file.

The datasets do not yet contain a complete historical record of advertised jackpot amounts, MAXPLUS winning series, winner counts, main prize-tier payouts, or ticket sales. These require a separate source and validation pass.

## Data corrections and audit notes

The PDF text layer has a few extraction defects. The generator applies explicit date-specific corrections and stores a note and cross-check URL with each corrected record:

- January 25, 2022 — bonus 37 was joined to the first digit of the EXTRA column in the extracted text.
- November 26, 2024 — the extracted row omitted main number 33 and bonus 50.
- March 3, 2026 — the WCLC archive text shows 61, which is outside the 1–50 pool in force on that date. The draw-specific secondary result gives 31 with bonus 2.
- October 9, 13, and 16, 2026 — the extracted text joined the final main number and bonus number.

These corrections are explicit and auditable; the original archive is not silently rewritten. If the official archive changes, the corrected values are still validated against the named draw-specific source.

## Rule history

- September 25, 2009 through May 14, 2019: 7 numbers from 1–49.
- May 17, 2019 through April 10, 2026: 7 numbers from 1–50. WCLC's archive shows the first 7/50 draw on May 17, 2019.
- From April 14, 2026: 7 numbers from 1–52. WCLC's current game conditions identify April 14, 2026 as the first draw under the new conditions.

The generator assigns a rule era to every draw and validates all seven main numbers and the bonus number against the correct pool for that date.

## Import and validation policy

1. Record the draw date and exactly seven main numbers.
2. Store the bonus number separately; it is not an eighth main number.
3. Validate uniqueness and the date-appropriate number range using the confirmed rule era.
4. Keep MAXMILLIONS and MAXPLUS separate from the main draw. Do not import or analyze EXTRA.
5. Store pre-draw prize configuration separately from post-draw results.
6. For each MAXPLUS / MAXMILLIONS series, store type, prize amount, seven winning numbers, series identifier, winner count, and actual payout when available.
7. For main-draw prize tiers, store tier, winner count, and actual payout when officially published.
8. Compare results against WCLC first and secondary sources as cross-checks.
9. Investigate every mismatch; never silently choose one value or average sources.
10. Preserve source URLs, retrieval date, and validation status in dataset metadata.

## Rebuilding locally

The generator requires Python 3 and Poppler's `pdftotext` utility:

```bash
sudo apt-get install poppler-utils
python3 scripts/build_lotto_max_data.py
```

You can also supply a local WCLC PDF:

```bash
python3 scripts/build_lotto_max_data.py --archive-path "/path/to/LOTTO MAX since Inception.pdf"
```
