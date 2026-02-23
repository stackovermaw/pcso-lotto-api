import * as cheerio from "cheerio";
import createHttpError from "http-errors";

import { logger } from "../../../logger";
import {
  CORPORATIONS,
  DESCRIPTION_KEYS,
  GAME_IDS,
  LOCALE,
  LOCALE_OPTIONS,
  RESULTS_TIME,
} from "../../results/_constants";
import type {
  Corporation,
  GameID,
  GameKeys,
  ResultTime,
} from "../../results/results-enum";
import type { GameResultsSource } from "../../results/results-types";
import { formatDate } from "../../v2/results/utils/date";
import { groupBy } from "../utils/group-by";
import { formatGameId } from "./format-game-id";
import { cacheData, getCachedData } from "./results.cache";
import type { Game } from "./results-interfaces";

export const extractGameResultsLegacy = async (source: GameResultsSource) => {
  const phTime = new Date().toLocaleString(LOCALE, LOCALE_OPTIONS);
  const cachedResults = await getCachedData();

  const now = new Date();
  const todayDate = formatDate(now);
  const isToday = source.date === todayDate;

  if (cachedResults != null && isToday) {
    logger.info(`Cache hit: ${phTime}`);
    return cachedResults;
  }

  const url = source.url + source.date;

  try {
    const document = await cheerio.fromURL(url);

    let gameId = "",
      gameId2 = "",
      gameId3 = "",
      description = "",
      corporation = "",
      time = "",
      result = "",
      result2 = "",
      result3 = "";
    const data: Game[] = [];

    function resetValues() {
      gameId = "";
      gameId2 = "";
      gameId3 = "";
      result = "";
      result2 = "";
      result3 = "";
    }

    // ? look to the respective table in the site while tracking the code (easy way)
    document(".post_content")
      .find("figure")
      .each((_, figure) => {
        const tableHeaderRowChildren = document(figure)
          .find("table thead tr")
          .children();
        const tableBodyRowChildren = document(figure)
          .find("table tbody")
          .children();

        // ? loops over the table head rows to get all current games
        // ? + the current corporation (if existing)
        // ? + the current description (if existing)
        for (const c of tableHeaderRowChildren) {
          const key = document(c).text();

          if (GAME_IDS.includes(key as GameID)) {
            if (!gameId) gameId = key;
            else if (!gameId2) gameId2 = key;
            else gameId3 = key;
          }

          if (CORPORATIONS.includes(key as Corporation)) {
            corporation = key;
          }

          if (DESCRIPTION_KEYS.includes(key as GameKeys)) {
            description = key;
          }
        }

        for (let i = 0; i < tableBodyRowChildren.length; i++) {
          const rowChildren = document(tableBodyRowChildren[i]).children();

          for (let j = 0; j < rowChildren.length; j++) {
            const key = document(rowChildren[j]).text();

            if (DESCRIPTION_KEYS.includes(key as GameKeys)) {
              description = key;

              if (gameId && gameId2) resetValues();
            }

            if (RESULTS_TIME.includes(key as ResultTime)) time = key;

            if (
              key.includes("-") ||
              key === "Stand by…" ||
              key === "Updating…"
            ) {
              if (!result) result = key;
              else if (!result2) result2 = key;
              else result3 = key;
            }
          }

          // ? we only found 1 game in the current table with a description (more likely a 6D or 6/X lotto)
          // ? so we reset gameId, description, and result to get the next game
          if (gameId && description && result && !gameId2) {
            data.push({
              gameId: formatGameId(gameId),
              description,
              time: time ? time : RESULTS_TIME[RESULTS_TIME.length - 1],
              corporation,
              result,
            });

            if (gameId && !gameId2) {
              gameId = "";
              description = "";
              result = "";
            }
          }

          // ? for gameId, we reset result if we don't have a second game
          // ? for the server to set [result] to its respective gameId on table body loop
          if (gameId && time && result) {
            data.push({
              gameId: formatGameId(gameId),
              description,
              time,
              corporation,
              result,
            });

            if (!gameId2) result = "";
          }

          // ? for gameId2, we reset result if we don't have a third game
          // ? for the same reason as above.
          if (gameId2 && time && result2) {
            data.push({
              gameId: formatGameId(gameId2),
              description,
              time,
              corporation,
              result: result2,
            });

            if (!gameId3) {
              result = "";
              result2 = "";
            }
          }

          // ? for gameId3, we reset all results since this will be the last game
          if (gameId3 && time && result3) {
            data.push({
              gameId: formatGameId(gameId3),
              description,
              time,
              corporation,
              result: result3,
            });

            result = "";
            result2 = "";
            result3 = "";
          }
        }
        // ? reset all values every table
        resetValues();
        corporation = "";
      });

    const grouped = groupBy(data, "gameId");
    const groupedData = {
      date: new Date(source.date)
        .toLocaleString(LOCALE, LOCALE_OPTIONS)
        .split(",")[0],
      ...grouped,
    };

    if (!isToday) return groupedData;

    await cacheData({
      data: groupedData,
    });

    return groupedData;
  } catch (error) {
    logger.error(error);
    throw new createHttpError.InternalServerError(
      "The server encountered an error while parsing the results.",
    );
  }
};
