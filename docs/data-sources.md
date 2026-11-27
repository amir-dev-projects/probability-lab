# Lotto Max data sources and validation

Last reviewed: 2026-11-26

This document records the sources used to assemble and verify LotteryLab's Lotto Max history. A source being listed here does **not** mean all of its historical data has been imported.

## Source register

### 1. WCLC — primary source

- [WCLC recent winning numbers](https://www.wclc.com/recent-winning-numbers.htm)
- [WCLC Lotto Max results](https://www.wclc.com/winning-numbers/lotto-max-extra.htm)
- [WCLC Lotto Max since inception archive](https://www.wclc.com/display-on/display-on-downloads/lotto-max-since-inception.htm)
- [WCLC Lotto Max game page and prize structure](https://www.wclc.com/games/lotto-max.htm)
- [WCLC Lotto Max game conditions](https://www.wclc.com/display-on/display-on-downloads/lotto-max-3.0-game-conditions.htm)
- [WCLC publications and forms](https://www.wclc.com/for-players/publications-forms.htm)

Use WCLC as the preferred authority for draw results, advertised prize configurations, game conditions, and the historical archive. If sources disagree, official WCLC information prevails.

The downloaded WCLC archive supplied for this project is a PDF export of the historical spreadsheet. Its visible coverage is September 25, 2009 through November 3, 2026. It contains separate Maxmillions records; those records must not be interpreted as regular Lotto Max draws. The PDF extraction needs row-level validation before import because some lines do not preserve clear field boundaries.

### 2. LottoMaxNumbers.com — secondary comparison source

- [LottoMaxNumbers.com home](https://www.lottomaxnumbers.com/)
- [Past Lotto Max numbers](https://www.lottomaxnumbers.com/past-numbers)
- [Lotto Max timeline](https://www.lottomaxnumbers.com/timeline)

Use this independent third-party website to cross-check draw dates, main numbers, bonus numbers, side-draw results, and contextual game-history notes.

**Authority limitation:** LottoMaxNumbers.com is not the lottery operator. Treat it as a secondary reference, not the final authority when sources disagree.

### 3. User-provided CSV — candidate reconciliation source

A CSV previously supplied in this project covers a recent period ending November 24, 2026. Treat it as a candidate comparison dataset only until its provenance and each draw are checked against authoritative results.

## Prize categories and analysis scope

LotteryLab focuses on prizes that can be won through number selections made by the player, plus the official prize outcomes associated with those selections.

- **Main jackpot:** the main 7/7 prize pool.
- **MAXPLUS:** separate $100,000 exact-match series introduced with the April 2026 game changes. The number of series is tied to the advertised jackpot amount (for example, a $40 million jackpot has 40 MAXPLUS series).
- **MAXMILLIONS:** separate $1 million exact-match series when the main jackpot reaches the applicable threshold.
- **Main-draw subsidiary prizes:** match tiers such as 6/7 + bonus, 6/7, 5/7 + bonus, and others. Record the number of winners and actual payout per tier when official result detail is available.

**EXTRA is out of scope.** Its numbers are machine-generated and are not selected by the player, so LotteryLab will not import, analyze, compare, or include EXTRA results in statistics, prize-value comparisons, or number-selection research. This is an intentional product-scope decision, not a data limitation.

For every draw, keep these concepts distinct:
1. Advertised prize configuration before the draw (jackpot amount, MAXPLUS count, MAXMILLIONS count).
2. Actual side-draw number sets after the draw (each MAXPLUS / MAXMILLIONS series, prize amount, and winners).
3. Main-draw prize-tier results (winner counts and actual payouts).
4. Sales, where officially published, so prize-pool and payout analysis can be contextualized.

Do not infer a player's chance of winning a side prize by adding the prize amounts. Calculate odds from the applicable game conditions and selection mechanics. Do not treat advertised prize value as an amount guaranteed to be won by a ticket holder; exact-match prizes may be shared or unclaimed according to the rules.

### Example: November 27, 2026 advertised prizes

WCLC advertises a $40 million main jackpot and 40 additional $100,000 MAXPLUS prizes for the November 27, 2026 draw. That represents $4 million in advertised MAXPLUS prize value and $44 million combined advertised value across those two categories. No MAXMILLIONS draws are advertised for this draw.

The pre-draw configuration is stored separately in [data/lotto-max/prize-configurations/2026-11-27.json](../data/lotto-max/prize-configurations/2026-11-27.json). It is not a draw result. Actual MAXPLUS winning series, winners, and payouts must be populated only after official results are released.

## Verified supplemental results

The WCLC PDF archive ends on November 3, 2026. The six subsequent main draws from November 6 through November 24 have been checked against WCLC and LottoMaxNumbers.com's Past Numbers page.

The verified records are stored in [data/lotto-max/supplemental-2026-11.json](../data/lotto-max/supplemental-2026-11.json). This is a six-draw supplement, **not** the complete historical dataset. It contains only the seven main numbers and bonus number. MAXPLUS and MAXMILLIONS records, when available, are maintained separately. EXTRA is excluded from the project.

## Rule-history notes requiring official confirmation

The secondary site's timeline reports:
- Lotto Max launched on September 25, 2009.
- The ball pool increased from 49 to 50 ahead of the May 14, 2019 draw.
- The number matrix changed to 7/52 ahead of the April 14, 2026 draw.

Confirm effective dates and full mechanics against official WCLC / Interprovincial Lottery Corporation game conditions before implementing date-based validation. Do not infer earlier or intermediate rule periods from current rules.

## Import and validation policy

1. Record the draw date and exactly seven main numbers.
2. Store the bonus number separately; it is not an eighth main number.
3. Validate uniqueness and the date-appropriate number range using a confirmed rules version.
4. Keep MAXMILLIONS and MAXPLUS separate from the main draw. Do not import or analyze EXTRA.
5. Store pre-draw prize configuration separately from post-draw results.
6. For each MAXPLUS / MAXMILLIONS series, store type, prize amount, seven winning numbers, series identifier, winner count, and actual payout when available.
7. For main-draw prize tiers, store tier, winner count, and actual payout when officially published.
8. Compare results against WCLC first and secondary sources as cross-checks.
9. Investigate every mismatch; never silently choose one value or average sources.
10. Preserve source URLs, retrieval date, and validation status in dataset metadata.

The six supplemental main-draw records are verified against both listed result sources. The full historical archive has not yet been parsed, reconciled, or certified.
