# LotteryLab

LotteryLab is a transparent research and educational platform for exploring historical lottery draw data. It separates descriptive statistics from predictive claims and evaluates any proposed strategy against a fair random baseline.

> **Important:** Lottery draws are designed to be random. Historical frequencies, gaps, pairs, and other patterns do not provide a reliable way to predict future results or improve the odds of winning.

## Project status

The initial application foundation is being built. Lotto Max is the first game, followed by Daily Grand and Lotto 6/49.

- [x] Next.js + TypeScript application foundation
- [x] Static export configuration for GitHub Pages
- [x] Initial game catalogue and deterministic analytics primitives
- [ ] Verify official game-rule periods and historical draw sources
- [ ] Import and validate the official Lotto Max historical dataset
- [ ] Build descriptive analytics and visualizations
- [ ] Implement chronological walk-forward backtesting
- [ ] Add transparent number-set generation and CSV export
- [ ] Add Daily Grand, then Lotto 6/49
- [ ] Consider an AI research assistant for explaining results

## Development

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Run a production static build:

```bash
npm run build
```

The exported site is written to `out/`. The GitHub Actions workflow publishes it to GitHub Pages.

## Research principles

1. Keep each game's rules versioned by the date of the draw.
2. Keep main numbers separate from bonus numbers and add-on games.
3. Use chronological train/test splits; never use future draws to evaluate a past strategy.
4. Compare every strategy with random selections under the same rules.
5. Report sample sizes, uncertainty, and the number of strategies tested.
6. Treat hot/cold numbers, gaps, pairs, and sums as descriptive statistics unless they show robust out-of-sample evidence.

## Technology

- Next.js and React
- TypeScript analytics with no server dependency
- Static hosting on GitHub Pages
- Historical data stored as version-controlled CSV/JSON

A database or server-side processing can be considered later if the project needs it. No paid AI API is required for the core statistical engine.
