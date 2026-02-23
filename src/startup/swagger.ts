import type { Express } from "express";
import swaggerUi from "swagger-ui-express";

import { openapiSpecsV1 } from "../api/v1/docs/results-openapi-specs";
import { openapiSpecsV2 } from "../api/v2/docs/results-openapi-specs";

export const swaggerSetup = (app: Express) => {
  app.use(
    "/api/v1/docs",
    swaggerUi.serveFiles(openapiSpecsV1),
    swaggerUi.setup(openapiSpecsV1),
  );

  app.use(
    "/api/v2/docs",
    swaggerUi.serveFiles(openapiSpecsV2),
    swaggerUi.setup(openapiSpecsV2),
  );
};
