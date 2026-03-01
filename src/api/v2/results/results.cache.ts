import { logger } from "../../../logger";
import { redisClient } from "../../lib/redisClient";
import type { ExtractedResults } from "../../results/results-types";
import { isToday as isDateToday } from "./utils/date";

export const cacheData = async (data: ExtractedResults) => {
  const isToday = isDateToday(data.date);

  if (isToday) {
    logger.info(
      `[V2] Caching results for date using V2 ${data.date} with key ${isToday ? "results:today" : `results:date-${data.date}`}`,
    );
    await redisClient.set("results:today", JSON.stringify(data), {
      EX: 60,
    });

    return;
  }

  await redisClient.set(`results:date-${data.date}`, JSON.stringify(data));
};

export const getCachedData = async (
  date: string,
): Promise<ExtractedResults | null> => {
  const isToday = isDateToday(date);
  const key = isToday ? "results:today" : `results:date-${date}`;

  const cachedData = await redisClient.get(key);
  if (cachedData) {
    logger.info(`[V2] Cache hit for key ${key}`);
    return JSON.parse(cachedData) as ExtractedResults;
  }

  logger.info(`[V2] Cache miss for key ${key}`);
  return null;
};

export const acquireLock = async (date: string): Promise<boolean> => {
  const isToday = isDateToday(date);
  const key = isToday ? "results:today-lock" : `results:date-${date}-lock`;

  const lockAcquired = await redisClient.set(key, "lock", {
    NX: true,
    EX: 10,
  });

  if (lockAcquired) {
    logger.info(`[V2] Lock acquired for key ${key}`);
    return true;
  }

  logger.info(`[V2] Lock already held for key ${key}`);
  return false;
};
