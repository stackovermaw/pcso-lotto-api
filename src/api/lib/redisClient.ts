import { createClient } from "redis";

import { logger } from "../../logger";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => logger.fatal("Redis Client Error", err));

export { redisClient };
