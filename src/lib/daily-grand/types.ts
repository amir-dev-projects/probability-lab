export type DailyGrandDraw = { drawDate: string; mainNumbers: number[]; grandNumber: number };
export type SelectionStrategy = "random" | "balanced" | "experimental";
export type BalancedParameters = { minOdd:number; maxOdd:number; minLow:number; maxLow:number; minSum:number; maxSum:number };
export type GeneratedTicket = {
  id:string; generatedAt:string; game:"Daily Grand";
  rulesetVersion:"daily-grand-5-of-49-plus-1-of-7-v1";
  datasetVersion:string; strategy:SelectionStrategy; parameters:BalancedParameters|null;
  mainNumbers:number[]; grandNumber:number;
  outcome?:{drawDate:string; mainMatches:number; grandMatch:boolean};
};
export const DATASET_VERSION = "daily-grand-2016-10-20-to-2026-11-26-v1";
export const DEFAULT_BALANCED_PARAMETERS:BalancedParameters = {minOdd:2,maxOdd:3,minLow:2,maxLow:3,minSum:90,maxSum:160};
