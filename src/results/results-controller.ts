import type { Request, Response } from "express";

import {
  LOCALE,
  LOCALE_OPTIONS,
  RESULTS_BY_DATE_URL,
  RESULTS_TODAY_URL,
} from "./_constants";
import { parseResults } from "./results-service";

export const getResultsToday = async (_req: Request, res: Response) => {
  const data = await parseResults({
    url: RESULTS_TODAY_URL,
  });
  res.status(200).send({
    date: new Date().toLocaleDateString(LOCALE, LOCALE_OPTIONS),
    ...data,
  });
};

export const getResultsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;

  const url = RESULTS_BY_DATE_URL + date;

  const data = await parseResults({
    url,
    filterDate: date,
  });

  res.status(200).send({
    date: new Date(date).toLocaleDateString(LOCALE, LOCALE_OPTIONS),
    ...data,
  });
};
