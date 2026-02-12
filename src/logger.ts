import pino from "pino";

export const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-http-print",
        options: {
          all: true,
          translateTime: true,
        },
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
      },
    ],
  },
});
