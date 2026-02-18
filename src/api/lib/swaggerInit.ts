import swaggerJsDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PCSO Lotto API",
      version: "1.0.0",
    },
  },
  apis: ["./src/results/results-route.ts"],
};

export const openapiSpecs = swaggerJsDoc(options);
