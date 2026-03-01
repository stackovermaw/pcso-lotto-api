import { extractGameResultsLegacy } from "../v1/results/results-parser";
import { extractGameResults } from "../v2/results/results-parser";
import { CUTOVER_DATE } from "./_constants";
import type { ExtractedResults, GameResultsSource } from "./results-types";

type Strategy = {
  version: string;
  canHandle: (date: string) => boolean;
  extract: (source: GameResultsSource) => Promise<ExtractedResults>;
};

const strategies: Strategy[] = [
  {
    version: "v2",
    canHandle: (date: string) => new Date(date) >= CUTOVER_DATE,
    extract: async (source: GameResultsSource) => extractGameResults(source),
  },
  {
    version: "legacy",
    canHandle: (date: string) => new Date(date) < CUTOVER_DATE,
    extract: async (source: GameResultsSource) =>
      extractGameResultsLegacy(source),
  },
];

export const getResults = async (source: GameResultsSource) => {
  for (const strategy of strategies) {
    if (strategy.canHandle(source.date)) {
      return strategy.extract(source);
    }
  }
  throw new Error("No strategy found to handle the given date");
};
