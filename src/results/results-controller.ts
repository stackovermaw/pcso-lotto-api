import type { Request, Response } from "express";

import { LOCALE, LOCALE_OPTIONS, RESULTS_TODAY_URL } from "./_constants";
import { parseResults } from "./results-service";

export const getResultsToday = async (_request: Request, res: Response) => {
  const data = await parseResults({
    url: RESULTS_TODAY_URL,
  });
  res.status(200).send({
    date: new Date().toLocaleDateString(LOCALE, LOCALE_OPTIONS),
    ...data,
  });
};
