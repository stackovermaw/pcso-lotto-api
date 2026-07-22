import * as cheerio from "cheerio";
import createHttpError from "http-errors";
import { logger } from "../../../logger";
import { redisClient } from "../../lib/redisClient";
import { GAME_IDS } from "../../results/_constants";
import type { GameID } from "../../results/results-enum";
import type {
  ExtractedResults,
  GameResultsSource,
} from "../../results/results-types";
import { hasVolatileValues } from "./has-volatile-results";
import { parseCity } from "./parse-city";
import { acquireLock, cacheData, getCachedData } from "./results.cache";
import { isSameDate, isToday, parseDate } from "./utils/date";

type CollectedGame = {
  gameId: GameID;
  city: string | null;
  results: Record<string, string>;
};

// ? a game can be drawn in more than one city on the same date (e.g. STL
// ? Swer3), so we collect them separately and only suffix the city when the
// ? same game id shows up more than once.
const toResults = (collected: Map<string, CollectedGame>) => {
  const occurrences = new Map<GameID, number>();
  for (const { gameId } of collected.values()) {
    occurrences.set(gameId, (occurrences.get(gameId) ?? 0) + 1);
  }

  const results: ExtractedResults["results"] = {};
  for (const game of collected.values()) {
    const { gameId, city } = game;
    const isDuplicate = (occurrences.get(gameId) ?? 0) > 1;
    const key = isDuplicate && city ? `${gameId} (${city})` : gameId;

    results[key] = { ...results[key], ...game.results };
  }

  return results;
};

export const extractGameResults = async (source: GameResultsSource) => {
  const cachedData = await getCachedData(source.date);

  if (cachedData) {
    logger.info(`[V2] Cache hit for date ${source.date}`);
    return cachedData;
  }

  const games: ExtractedResults = {
    date: source.date,
    results: {},
  };

  const lockKey = isToday(source.date)
    ? "results:today-lock"
    : `results:date-${source.date}-lock`;

  let lockOwned = false;
  const now = source.date ? parseDate(source.date) : new Date();
  const collected = new Map<string, CollectedGame>();

  try {
    const document = await cheerio.fromURL(source.url);
    lockOwned = await acquireLock(source.date);
    if (!lockOwned) {
      logger.info(
        `[V2] Waiting for lock to be released for date ${source.date}`,
      );
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** i)); // exponential backoff, 300ms, 600ms, 1200ms
        const retryData = await getCachedData(source.date);
        if (retryData) return retryData;
      }

      logger.warn(
        `[V2] Failed to acquire results lock for date ${source.date} after retries`,
      );
      throw new createHttpError.ServiceUnavailable(
        "Results are currently being updated. Please try again shortly.",
      );
    }

    document(".post_content")
      .find("figure")
      .each((_, figure) => {
        const tableHeadTableRowChildren = document(figure)
          .find("table thead tr")
          .children();
        const tableBodyChildren = document(figure)
          .find("table tbody")
          .children();

        const headerKey = document(tableHeadTableRowChildren[0]).text();
        const headerValue = document(tableHeadTableRowChildren[1]).text();
        const gameId = headerKey as GameID;

        const dateB = new Date(headerValue);
        const isValidDateB = !Number.isNaN(dateB.getTime());

        const city = isValidDateB ? null : parseCity(headerValue);

        let isValidFigure = false;
        if (isValidDateB) {
          isValidFigure = GAME_IDS.includes(gameId) && isSameDate(now, dateB);
        } else {
          isValidFigure = GAME_IDS.includes(gameId) && city !== null;
        }

        if (!isValidFigure) return;

        // ? keying by city too keeps a game drawn in two cities from
        // ? overriding itself, since both tables share the same row keys
        const collectedKey = `${gameId}|${city ?? ""}`;
        const game = collected.get(collectedKey) ?? {
          gameId,
          city,
          results: {},
        };

        for (const tableRow of tableBodyChildren) {
          const tableData = document(tableRow).children();
          const key = document(tableData[0]).text();
          const value = document(tableData[1]).text();

          game.results[key] = value;
        }

        collected.set(collectedKey, game);
      });

    games.results = toResults(collected);

    if (!hasVolatileValues(games)) {
      await cacheData(games);
    }

    return games;
  } catch (error) {
    logger.error("[V2] Error fetching results", { error });
    throw new createHttpError.InternalServerError(
      "Failed to fetch results. Please try again later.",
    );
  } finally {
    if (lockOwned) await redisClient.del(lockKey);
  }
};
