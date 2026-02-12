import type { Express } from "express";
import { serve, setup } from "swagger-ui-express";

import { openapiSpecs } from "../lib/swaggerInit";

export const swaggerSetup = (app: Express) => {
  app.use("/api/docs", serve, setup(openapiSpecs));
};
