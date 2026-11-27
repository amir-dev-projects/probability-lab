import type { GameDefinition } from "./types";

export const games: GameDefinition[] = [
  {
    id: "lotto-max",
    name: "Lotto Max",
    description: "Start with Canada's multi-million-dollar draw. Historical rules and source data will be verified before analysis is enabled.",
    scope: "Historical draws · 7 main numbers",
    status: "In progress",
    mainNumberCount: 7,
    minNumber: 1,
    maxNumber: 52,
    hasBonusNumber: true
  },
  {
    id: "daily-grand",
    name: "Daily Grand",
    description: "A separate analysis workspace with its own draw structure and validation rules.",
    scope: "Coming in phase 2",
    status: "Planned",
    mainNumberCount: 5,
    minNumber: 1,
    maxNumber: 49,
    hasBonusNumber: true
  },
  {
    id: "lotto-649",
    name: "Lotto 6/49",
    description: "A dedicated workspace that will keep Classic Draw and Gold Ball information separate.",
    scope: "Coming in phase 3",
    status: "Planned",
    mainNumberCount: 6,
    minNumber: 1,
    maxNumber: 49,
    hasBonusNumber: true
  }
];
