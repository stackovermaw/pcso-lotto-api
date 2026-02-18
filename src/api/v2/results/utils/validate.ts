import type { NextFunction, Request, Response } from "express";
import * as v from "valibot";

export const DATE_REGEX =
  /^(january|february|march|april|may|june|july|august|september|october|november|december)-(?:[1-9]|[12][0-9]|3[01])-\d{4}$/;

export const validate =
  <TOutput>(
    schema: v.BaseSchema<unknown, TOutput, v.BaseIssue<unknown>>,
    target: "body" | "params" | "query",
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[target];

    const results = v.safeParse(schema, data);

    if (!results.success) {
      const issues = results.issues.map((i) => i.message);
      return res.status(400).json({
        message: "Validation Failed",
        issues,
      });
    }

    req[target] = results.output;

    next();
  };
