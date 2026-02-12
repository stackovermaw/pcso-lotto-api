import cors from "cors";
import express, { type Express } from "express";

export const securitySetup = (app: Express) =>
  app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }));
