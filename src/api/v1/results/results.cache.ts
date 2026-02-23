import { logger } from "../../../logger";
import { redisClient } from "../../lib/redisClient";
import { MS_IN_A_SECOND, MS_IN_AN_HOUR } from "../../results/_constants";

export const cacheData = async ({
  data,
  expireSeconds,
  expiryDate,
}: {
  data: any;
  expireSeconds: number;
  expiryDate: Date;
}) => {
  const expireTimeInSeconds = Math.round(expireSeconds / MS_IN_A_SECOND);

  await redisClient.set("resultsCache", JSON.stringify(data), {
    EX: expireTimeInSeconds,
  });

  logger.info(
    `Results cached for ${Math.round(
      expireSeconds / MS_IN_AN_HOUR,
    )} hour(s), will expire on ${expiryDate.toLocaleString("en-PH")}`,
  );
};
export const getCachedData = async () => {
  const cachedData = await redisClient.get("resultsCache");
  if (cachedData) {
    logger.info("Cache hit: Returning cached results.");
    return JSON.parse(cachedData);
  } else {
    logger.info("Cache miss: No cached results found.");
    return null;
  }
};
