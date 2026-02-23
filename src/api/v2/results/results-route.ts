import { Router } from "express";
import * as v from "valibot";

import * as resultsController from "./results-controller";
import {
  isAFutureDate,
  isWithinMonthDays,
  isWithinValidDate,
} from "./utils/date";
import { DATE_REGEX, validate } from "./utils/validate";

export const resultsRouterV2 = Router();

/**
 * @swagger
 * /api/v2/results/today:
 *   get:
 *     tags:
 *      - Results
 *     description: Get results for today
 *     responses:
 *       200:
 *         description: Returns today's results.
 *
 */
resultsRouterV2.get("/today", resultsController.getResultsToday);

/**
 * @swagger
 * /api/v2/results/{date}:
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
 *           pattern: '^[a-z]+-\d{1,2}-\d{4}$'
 *           example: april-6-2025
 *         description: |
 *           The date for which results are requested, in the format `month-day-year` (e.g. `april-6-2025`).
 *
 *           Constraints:
 *           - Must match the format `month-day-year` (e.g. `april-6-2025`)
 *           - Day must be valid for the given month
 *           - Must be on or after `june-3-2024` (earliest parsable results date)
 *           - Cannot be a future date
 *     responses:
 *       200:
 *         description: Returns results for the specified date.
 *       400:
 *         description: |
 *           Bad Request. Possible reasons:
 *           - Date is not in the format `month-day-year` (e.g. `april-6-2025`)
 *           - Day is not valid for the given month
 *           - Date is before `june-3-2024`, the earliest parsable results date
 *           - Date is in the future
 */
resultsRouterV2.get(
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
