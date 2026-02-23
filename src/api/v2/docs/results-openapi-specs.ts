import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PCSO Lotto API V2",
      version: "2.0.0",
    },
  },
  apis: ["./src/api/v2/results/results-route.ts"],
};

export const openapiSpecsV2 = swaggerJsDoc(options);
