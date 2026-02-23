import type { Request, Response } from "express";
import createHttpError from "http-errors";

import { logger } from "../../../logger";
import { MONTHS, RESULTS_BY_DATE_URL } from "../../results/_constants";
import { Month } from "../../results/results-enum";
import { formatDate } from "../../v2/results/utils/date";
import { getDays } from "./get-days";
import type { Game } from "./results-interfaces";
import { extractGameResultsLegacy } from "./results-parser";

export const getResultsTodayByGameId = async (req: Request, res: Response) => {
  const now = new Date();
  const date = formatDate(now);

  const responseData: Record<string, Game[]> = await extractGameResultsLegacy({
    url: RESULTS_BY_DATE_URL,
    date,
  });

  const gameId = req.params.gameId as string;

  const game = responseData[gameId];

  if (!game) {
    logger.error(`Invalid game ID: ${gameId}`);

    throw new createHttpError.NotFound(
      `The game with ID < ${gameId} > could not be found. This may be because there was no draw for it today, it has yet to occur, or the game ID was misspelled.`,
    );
  }

  res.status(200).send({
    gameId,
    results: responseData[gameId],
  });
};

export const getResultsByDateAndByGameId = async (
  req: Request,
  res: Response,
) => {
  const date = req.params.date;
  checkDate(date);

  const responseData: Record<string, Game[]> = await extractGameResultsLegacy({
    url: RESULTS_BY_DATE_URL,
    date,
  });

  const gameId = req.params.gameId as string;
  const game = responseData[gameId];

  if (!game) {
    logger.error(`Invalid game ID: ${gameId}`);

    throw new createHttpError.NotFound(
      `The game with ID < ${gameId} > could not be found. This may be because there was no draw for it today, it has yet to occur, or the game ID was misspelled.`,
    );
  }

  res.status(200).send({
    gameId,
    results: responseData[gameId],
  });
};

const checkDate = (date: string) => {
  // ? 3-9 letters month
  // ? 1-2 digits days
  // ? 4 digits year
  const dateRegex = /\w{3,9}-\d{1,2}-\d{4}/g;
  const earliestMonthIndex = 7;
  const earliestDay = 26;
  const earliestYear = 2020;
  const earliestDate = new Date(earliestYear, earliestMonthIndex, earliestDay);
  const now = new Date();

  if (!date.match(dateRegex)) {
    throw new createHttpError.BadRequest(
      "Please adhere to the proper format. See more at https://github.com/Jiseeeh/pcso-lotto-api?tab=readme-ov-file#get-results-by-date",
    );
  }

  const [month, day, year] = date.split("-");
  const givenMonth = month.toLowerCase() as Month;
  const givenMonthIndex = MONTHS.indexOf(givenMonth);

  // ? double check date
  // ? start of records from site =  aug 26, 2020 - present
  if (!MONTHS.includes(givenMonth)) {
    throw new createHttpError.BadRequest("Please send a valid month.");
  }

  const monthDays = getDays(parseInt(year, 10), givenMonthIndex);

  if (parseInt(day, 10) > monthDays || parseInt(day, 10) <= 0) {
    throw new createHttpError.BadRequest(
      `${month.charAt(0).toUpperCase()}${month
        .slice(1, month.length)
        .toLowerCase()} has only ${monthDays} days.`,
    );
  }

  const givenDate = new Date(
    parseInt(year, 10),
    givenMonthIndex,
    parseInt(day, 10),
  );

  if (givenDate < earliestDate) {
    throw new createHttpError.BadRequest(
      `Dates earlier than ${Month.AUGUST}, ${earliestDay} ${earliestYear} is not supported.`,
    );
  }

  if (givenDate > now) {
    throw new createHttpError.BadRequest(
      "Whoa there, time traveler! We don't have results from the future yet. Try a date that's not ahead of today.",
    );
  }
};

export const getResultsToday = async (_: Request, res: Response) => {
  const now = new Date();
  const date = formatDate(now);

  const responseData = await extractGameResultsLegacy({
    url: RESULTS_BY_DATE_URL,
    date,
  });

  res.status(200).send(responseData);
};

export const getResultsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;

  checkDate(date);

  const responseData = await extractGameResultsLegacy({
    url: RESULTS_BY_DATE_URL,
    date,
  });

  res.status(200).send(responseData);
};
