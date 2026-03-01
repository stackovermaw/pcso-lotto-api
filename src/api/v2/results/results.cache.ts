import { logger } from "../../../logger";
import { redisClient } from "../../lib/redisClient";
import type { ExtractedResults } from "../../results/results-types";

export const cacheData = async (data: ExtractedResults) => {
  const isToday =
    new Date(data.date).toDateString() === new Date().toDateString();

  if (isToday) {
    logger.info(
      `Caching results for date using V2 ${data.date} with key ${isToday ? "results:today" : `results:date-${data.date}`}`,
    );
    await redisClient.set("results:today", JSON.stringify(data), {
      EX: 60,
    });

    return;
  }

  await redisClient.set(`results:date-${data.date}`, JSON.stringify(data), {
    EX: 60 * 60 * 24 * 7, // cache for a week
  });
};

export const getCachedData = async (date: string) => {
  const isToday = new Date(date).toDateString() === new Date().toDateString();
  const key = isToday ? "results:today" : `results:date-${date}`;

  logger.info(`Checking cache for key ${key}`);

  const cachedData = await redisClient.get(key);

  if (cachedData) {
    logger.info(`Cache hit for key ${key}`);
    return JSON.parse(cachedData) as ExtractedResults;
  }

  logger.info(`Cache miss for key ${key}`);
  return null;
};
