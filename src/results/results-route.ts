import { type NextFunction, Router } from "express";
import * as v from "valibot";

import { resultsController } from "./index";

const _validateBody =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const _out = v.parse(schema, req.body);
  };

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
