import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PCSO Lotto API V1",
      version: "1.0.0",
    },
  },
  apis: ["./src/api/v1/results/results-route.ts"],
};

export const openapiSpecsV1 = swaggerJsDoc(options);
