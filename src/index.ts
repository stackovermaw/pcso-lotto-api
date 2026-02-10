import dotenv from "dotenv";
import type { Express } from "express";
import express from "express";

import { appSetup, routerSetup, securitySetup, swaggerSetup } from "./startup";

const app: Express = express();

dotenv.config();

securitySetup(app);
routerSetup(app);
swaggerSetup(app);
appSetup(app);
