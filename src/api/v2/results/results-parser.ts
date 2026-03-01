import * as cheerio from "cheerio";
import createHttpError from "http-errors";

import { logger } from "../../../logger";
import { CORPORATIONS, GAME_IDS } from "../../results/_constants";
import type { Corporation, GameID } from "../../results/results-enum";
import type {
  ExtractedResults,
  GameResultsSource,
} from "../../results/results-types";
import { hasVolatileValues } from "./has-volatile-results";
import { cacheData, getCachedData } from "./results.cache";
import { isSameDate } from "./utils/date";

export const extractGameResults = async (source: GameResultsSource) => {
  const games: ExtractedResults = {
    date: source.date,
    results: {},
  };

  try {
    const cachedData = await getCachedData(source.date);

    if (cachedData) {
      logger.info(`Cache hit for date: ${source.date}`);
      return cachedData;
    }

    const document = await cheerio.fromURL(source.url);

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
        const now = source.date ? new Date(source.date) : new Date();
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
    logger.error(`Error fetching results: ${error}`);

    throw new createHttpError.InternalServerError(
      "Failed to fetch results. Please try again later.",
    );
  }
};
