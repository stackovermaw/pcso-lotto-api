import type { NextFunction, Request, Response } from "express";
import type { HttpError } from "http-errors";

import { logger } from "../../logger";

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.error(err);

  res.status(err.statusCode || 500).send(err);
};
