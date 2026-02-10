import * as cheerio from "cheerio";

import { logger } from "../logger";
import { CORPORATIONS, GAME_IDS, LOCALE, LOCALE_OPTIONS } from "./_constants";

import type { Corporation, GameID } from "./results-enum";
import { isSameDate } from "./utils/date";

export const parseResults = async (options: {
  url: string;
  filterDate?: string;
}) => {
  const phTime = new Date().toLocaleDateString(LOCALE, LOCALE_OPTIONS);
  // const cachedResults = await redisClient.get("");
  // const resetHours = [10, 14, 15, 17, 19, 20, 21];

  // if (cachedResults != null && !options.filterDate) {
  //   logger.info(`Cache hit: ${phTime}`);
  // }

  const games: Record<string, Record<string, string>> = {};

  try {
    const document = await cheerio.fromURL(options.url);

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
          isValidFigure =
            GAME_IDS.includes(gameId) && isSameDate(new Date(), dateB);
        } else {
          isValidFigure = CORPORATIONS.includes(headerValue as Corporation);
        }

        if (!isValidFigure) return;

        for (const tableRow of tableBodyChildren) {
          const tableData = document(tableRow).children();
          const key = document(tableData[0]).text();
          const value = document(tableData[1]).text();

          games[gameId] = {
            ...games[gameId],
            [key]: value,
          };
        }
      });

    return games;
  } catch (error) {
    logger.error(`Error fetching results: ${error}`);
  }
};
