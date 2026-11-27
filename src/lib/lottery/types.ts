export type GameId = "lotto-max" | "daily-grand" | "lotto-649";

export type LottoMaxSidePrizeType = "maxplus" | "maxmillions";

export interface LottoMaxSidePrizeDraw {
  type: LottoMaxSidePrizeType;
  prizeAmount: number;
  winningNumbers: number[];
  seriesNumber?: number;
  winners?: number;
  actualPayout?: number;
}

export interface LottoMaxPrizeConfiguration {
  /** Advertised main jackpot in Canadian dollars. */
  jackpotAmount?: number;
  /** Number of separate exact-match $100,000 MAXPLUS number sets. */
  maxPlusPrizeCount?: number;
  /** Number of separate exact-match $1,000,000 MAXMILLIONS number sets. */
  maxMillionsPrizeCount?: number;
}

export interface Draw {
  date: string;
  mainNumbers: number[];
  bonusNumber?: number;
  /** Advertised prize configuration for this draw, not a result or guarantee of a win. */
  prizeConfiguration?: LottoMaxPrizeConfiguration;
  /** Separate side-draw results; never mix these numbers into the main draw. */
  sidePrizeDraws?: LottoMaxSidePrizeDraw[];
}

export interface GameDefinition {
  id: GameId;
  name: string;
  description: string;
  scope: string;
  status: "In progress" | "Planned";
  mainNumberCount: number;
  minNumber: number;
  maxNumber: number;
  hasBonusNumber: boolean;
}
