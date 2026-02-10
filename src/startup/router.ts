import type { Express } from "express";

import { resultsRouter } from "../results/results-route";

export const routerSetup = (app: Express) => {
  app.use("/api/results", resultsRouter);
};
