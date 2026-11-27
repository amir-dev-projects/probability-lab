export type GameId = "lotto-max" | "daily-grand" | "lotto-649";

export interface Draw {
  date: string;
  mainNumbers: number[];
  bonusNumber?: number;
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
