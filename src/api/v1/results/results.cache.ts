import { logger } from "../../../logger";
import { redisClient } from "../../lib/redisClient";
import {
  LOCALE,
  LOCALE_OPTIONS,
  MS_IN_A_SECOND,
  MS_IN_AN_HOUR,
} from "../../results/_constants";

const RESET_HOURS = [10, 14, 15, 17, 19, 20, 21];

export const cacheData = async ({
  data,
}: {
  data: Record<string, unknown>;
}) => {
  const phTime = new Date().toLocaleString(LOCALE, LOCALE_OPTIONS);

  const phTimeParts = phTime.split(",");
  const phTimeDate = phTimeParts[0].split("/");
  const phTimeNowParts = phTimeParts[1].split(":");

  const monthNow = parseInt(phTimeDate[0], 10) - 1;
  const dateNow = parseInt(phTimeDate[1], 10);
  const yearNow = parseInt(phTimeDate[2], 10);

  const hourNow = parseInt(phTimeNowParts[0], 10);
  const minNow = parseInt(phTimeNowParts[1], 10);
  const secondsNow = parseInt(phTimeNowParts[2], 10);

  let expireHour = RESET_HOURS.find((hour) => hourNow < hour);
  let expireDate = dateNow;
  let expireMinutes = 30;

  if (hourNow >= 21 && hourNow <= 23) {
    expireHour = RESET_HOURS[0];
    // ? next day
    expireDate++;
  } else if (hourNow > 10) {
    expireMinutes = 0;
  }

  const timeNow = new Date(
    yearNow,
    monthNow,
    dateNow,
    hourNow,
    minNow,
    secondsNow,
  );
  const expiryDate = new Date(
    yearNow,
    monthNow,
    expireDate,
    expireHour,
    expireMinutes,
  );
  const expireSeconds = Math.abs(timeNow.valueOf() - expiryDate.valueOf());

  if (
    // ? The earliest draw time is 10:30, reflect time is about 5 minutes
    // ? I made it +10 to make it safe
    (hourNow === 10 && minNow >= 40) ||
    // ? Draws at 9 PM are delayed in reflecting as they are shown on TV
    (hourNow === 21 && minNow >= 30) ||
    // ? For exact minutes, e.g. 14:00, 17:00
    // ? Results reflect in about 5 minutes after draw time, I made it 10 minutes to make it safe.
    minNow >= 10
  ) {
    const expireTimeInSeconds = Math.round(expireSeconds / MS_IN_A_SECOND);

    await redisClient.set("resultsCache", JSON.stringify(data), {
      EX: expireTimeInSeconds,
    });

    logger.info(
      `Results cached for ${Math.round(
        expireSeconds / MS_IN_AN_HOUR,
      )} hour(s), will expire on ${expiryDate.toLocaleString("en-PH")}`,
    );
  } else {
    logger.info(`Full fetch, minutes now: ${minNow}`);
  }
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
