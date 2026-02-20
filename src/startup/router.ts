import type { Express } from "express";
import { resultsRouterV1 } from "../api/v1/results/results-route";
import { resultsRouterV2 } from "../api/v2/results/results-route";

export const routerSetup = (app: Express) => {
  app.use("/api/health", (_, res) =>
    res.status(200).send("Nothing exploded yet"),
  );
  app.use("/api/results/today", (_, res) =>
    res.status(301).redirect("/api/v1/results"),
  );
  app.use("/api/v1/results", resultsRouterV1);
  app.use("/api/v2/results", resultsRouterV2);
};
