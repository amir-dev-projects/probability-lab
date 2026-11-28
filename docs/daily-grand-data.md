# Daily Grand data and generator

## Dataset

The Daily Grand preview uses 1,045 regular draws from October 20, 2016 through November 26, 2026. The source set combines the supplied Daily Grand since-inception PDF with the November 2026 results spreadsheet. The overlapping November 2, 2026 record is included once. Bonus draws are excluded.

Each record was validated for a unique date, five distinct main numbers in the range 1–49, and a Grand Number in the range 1–7. The data is stored in `src/data/daily-grand-draws.json` as compact strings. Each string contains a four-digit day offset from 2016-10-20, five two-digit main numbers, and the Grand Number digit. The manifest is in `data/daily-grand/manifest.json`.

For future updates, use official WCLC results as the authority, compare overlapping dates before merging, and stop on mismatches rather than silently replacing a result.

## Generator modes

- Random: uniform selection and the default mode.
- Balanced: uniform random candidates filtered by user-defined odd/even, low/high, and sum constraints.
- Experimental: weighted sampling using 50% long-term frequency, 35% last-100-draw frequency, and 15% current gap score.

Historical backtesting did not demonstrate an advantage for frequency-based or hybrid selection over random selection. Balanced mode filters the combinations displayed; it does not increase the probability of any individual valid combination.

Generated tickets are stored in the user's browser only, with a maximum of 500 records. CSV export is available. No server, database, or paid API is required.
