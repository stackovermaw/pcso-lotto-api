import type { Request, Response } from "express";

import {
  LOCALE,
  LOCALE_OPTIONS,
  RESULTS_BY_DATE_URL,
  RESULTS_TODAY_URL,
} from "../../results/_constants";
import { getResults } from "../../results/results-service";

export const getResultsToday = async (_req: Request, res: Response) => {
  const data = await getResults({
    url: RESULTS_TODAY_URL,
    date: new Date().toLocaleDateString(LOCALE, LOCALE_OPTIONS),
  });

  res.status(200).send(data);
};

export const getResultsByDate = async (req: Request, res: Response) => {
  const { date } = req.params;

  const url = RESULTS_BY_DATE_URL + date;

  const data = await getResults({
    url,
    date,
  });

  res.status(200).send(data);
};
