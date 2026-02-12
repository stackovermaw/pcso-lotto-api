import { Router } from "express";
import * as v from "valibot";

import { resultsController } from "./index";
import {
  isAFutureDate,
  isWithinMonthDays,
  isWithinValidDate,
} from "./utils/date";
import { DATE_REGEX, validate } from "./utils/validate";

export const resultsRouter = Router();

/**
 * @swagger
 * /api/results/today:
 *   get:
 *     tags:
 *      - Results
 *     description: Get results for today
 *     responses:
 *       200:
 *         description: Returns today's results.
 *
 */
resultsRouter.get("/today", resultsController.getResultsToday);

/**
 * @swagger
 * /api/results/{date}:
 *   get:
 *     tags:
 *      - Results
 *     description: Get results by date
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: april-6-2025
 *         description: The date for which results are requested
 *     responses:
 *       200:
 *         description: Returns results for the specified date.
 *       400:
 *         description: Bad Request - Invalid date format or date out of range.
 */
resultsRouter.get(
  "/:date",
  validate(
    v.object({
      date: v.pipe(
        v.string(),
        v.regex(
          DATE_REGEX,
          "Date must be in the format 'month-day-year', e.g., 'april-6-2025'",
        ),
        v.check(
          isWithinMonthDays,
          "Date is not within the valid number of days for the month",
        ),
        v.check(
          isWithinValidDate,
          "Date must be on or after June 3, 2024, the earliest parsable results date",
        ),
        v.check(
          isAFutureDate,
          "Date cannot be in the future, we aren't time travelers!",
        ),
      ),
    }),
    "params",
  ),
  resultsController.getResultsByDate,
);
