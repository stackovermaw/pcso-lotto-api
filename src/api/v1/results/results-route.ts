import type { NextFunction, Request, Response } from "express";
import { Router } from "express";

import * as resultsController from "./results-controller";

export const resultsRouterV1 = Router();

// TODO: remove when express gets updated to 5+
function asyncWrapper(cb: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error: any) {
      next(error);
    }
  };
}

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
resultsRouterV1.get("/today", asyncWrapper(resultsController.getResultsToday));

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
 *           example: february-14-2025
 *         description: The date for which results are requested
 *     responses:
 *       200:
 *         description: Returns results for the specified date.
 *       400:
 *         description: Returns when you sent an invalid date
 */
resultsRouterV1.get("/:date", asyncWrapper(resultsController.getResultsByDate));

/**
 * @swagger
 * /api/results/today/{gameId}:
 *   get:
 *     tags:
 *      - Results
 *     description: Get today's results by game ID
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["6-58-ultra-lotto", "6-55-grand-lotto", "6-49-super-lotto", "6-45-mega-lotto", "6-42-lotto", "6d-lotto", "4d-lotto", "2d-lotto", "stl-swer3", "swertres", "ez2", "stl-pares", "stl-swer2", "stl-swer4", "grand-lotto-6-55", "mega-lotto-6-45", "lotto-6-42", "ultra-lotto-6-58", "super-lotto-6-49"]
 *           example: 2d-lotto
 *         description: The game ID for which results are requested, note that some are for older dates only, see more at https://github.com/Jiseeeh/pcso-lotto-api?tab=readme-ov-file#all-possible-values-of-gameid
 *     responses:
 *       200:
 *         description: Returns today's results for a specific game.
 *       404:
 *         description: Returns when the gameId was misspelled or invalid.
 */
resultsRouterV1.get(
  "/today/:gameId",
  asyncWrapper(resultsController.getResultsTodayByGameId),
);

/**
 * @swagger
 * /api/results/{date}/{gameId}:
 *   get:
 *     tags:
 *      - Results
 *     description: Get results by date and game ID
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           example: february-14-2025
 *         description: The date for which results are requested
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["6-58-ultra-lotto", "6-55-grand-lotto", "6-49-super-lotto", "6-45-mega-lotto", "6-42-lotto", "6d-lotto", "4d-lotto", "2d-lotto", "stl-swer3", "swertres", "ez2", "stl-pares", "stl-swer2", "stl-swer4", "grand-lotto-6-55", "mega-lotto-6-45", "lotto-6-42", "ultra-lotto-6-58", "super-lotto-6-49"]
 *           example: 2d-lotto
 *         description: The game ID for which results are requested
 *     responses:
 *       200:
 *         description: Returns results for a specific date and game ID.
 *       400:
 *         description: Returns when you sent an invalid date
 *       404:
 *         description: Returns when the gameId was misspelled or invalid.
 */
resultsRouterV1.get(
  "/:date/:gameId",
  asyncWrapper(resultsController.getResultsByDateAndByGameId),
);
