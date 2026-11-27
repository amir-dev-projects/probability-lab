import type { Draw, GameDefinition } from "./types";

export interface FrequencyRow {
  number: number;
  count: number;
  rate: number;
}

export interface PairRow {
  numbers: [number, number];
  count: number;
}

/** Validate the main-number portion of a draw against a game's configured pool. */
export function validateDraw(
  draw: Draw,
  game: Pick<GameDefinition, "mainNumberCount" | "minNumber" | "maxNumber">
): string[] {
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draw.date) || Number.isNaN(Date.parse(draw.date))) {
    errors.push("Draw date must use YYYY-MM-DD.");
  }
  if (draw.mainNumbers.length !== game.mainNumberCount) {
    errors.push(`Expected ${game.mainNumberCount} main numbers.`);
  }
  if (new Set(draw.mainNumbers).size !== draw.mainNumbers.length) {
    errors.push("Main numbers must be unique.");
  }
  for (const number of draw.mainNumbers) {
    if (!Number.isInteger(number) || number < game.minNumber || number > game.maxNumber) {
      errors.push(`Number ${number} is outside the configured range.`);
    }
  }
  return errors;
}

/** Count main-number appearances. Bonus numbers are intentionally excluded. */
export function calculateFrequencies(
  draws: Draw[],
  minNumber: number,
  maxNumber: number
): FrequencyRow[] {
  const counts = new Map<number, number>();
  for (let number = minNumber; number <= maxNumber; number += 1) counts.set(number, 0);
  for (const draw of draws) {
    for (const number of draw.mainNumbers) counts.set(number, (counts.get(number) ?? 0) + 1);
  }
  const total = draws.reduce((sum, draw) => sum + draw.mainNumbers.length, 0);
  return Array.from(counts, ([number, count]) => ({
    number,
    count,
    rate: total === 0 ? 0 : count / total
  }));
}

/** Count unordered pairs that occur together in a draw. */
export function calculatePairs(draws: Draw[]): PairRow[] {
  const counts = new Map<string, PairRow>();
  for (const draw of draws) {
    const numbers = [...draw.mainNumbers].sort((a, b) => a - b);
    for (let i = 0; i < numbers.length; i += 1) {
      for (let j = i + 1; j < numbers.length; j += 1) {
        const pair: [number, number] = [numbers[i], numbers[j]];
        const key = pair.join("-");
        const current = counts.get(key);
        counts.set(key, { numbers: pair, count: (current?.count ?? 0) + 1 });
      }
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.numbers[0] - b.numbers[0]);
}
