import * as cheerio from "cheerio";
import createHttpError from "http-errors";
import { logger } from "../../../logger";
import { redisClient } from "../../lib/redisClient";
import { CORPORATIONS, GAME_IDS } from "../../results/_constants";
import type { Corporation, GameID } from "../../results/results-enum";
import type {
  ExtractedResults,
  GameResultsSource,
} from "../../results/results-types";
import { hasVolatileValues } from "./has-volatile-results";
import { acquireLock, cacheData, getCachedData } from "./results.cache";
import { isSameDate, isToday } from "./utils/date";

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
  const now = source.date ? new Date(source.date) : new Date();
  const document = await cheerio.fromURL(source.url);

  try {
    lockOwned = await acquireLock(source.date);
    if (!lockOwned) {
      logger.info(`[V2] Waiting for lock to be released for date ${source.date}`);
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300 * 2 ** i)); // exponential backoff, 300ms, 600ms, 1200ms
        const retryData = await getCachedData(source.date);
        if (retryData) return retryData;
      }
      return games;
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

        let isValidFigure = false;
        if (isValidDateB) {
          isValidFigure = GAME_IDS.includes(gameId) && isSameDate(now, dateB);
        } else {
          isValidFigure = CORPORATIONS.includes(headerValue as Corporation);
        }

        if (!isValidFigure) return;

        for (const tableRow of tableBodyChildren) {
          const tableData = document(tableRow).children();
          const key = document(tableData[0]).text();
          const value = document(tableData[1]).text();

          games.results[gameId] = {
            ...games.results[gameId],
            [key]: value,
          };
        }
      });

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
