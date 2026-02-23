import type { Express } from "express";
import { pinoHttp } from "pino-http";

import { redisClient } from "../api/lib/redisClient";
import { errorHandler } from "../api/middleware/error";
import { logger } from "../logger";

export const appSetup = (app: Express) => {
  const PORT = process.env.PORT || 4000;

  app.use(pinoHttp({ logger })).use(errorHandler);

  redisClient.connect().then((_) => logger.info("Redis client connected"));

  app.listen(Number(PORT), "0.0.0.0", () => {
    logger.info(`Server is listening on 0.0.0.0:${PORT}`);
  });
};
