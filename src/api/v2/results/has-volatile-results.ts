import type { ExtractedResults } from "../../results/results-types";

const volatileValues = ["Stand by…", "*"];

type Traversable = string | Record<string, string> | ExtractedResults;

export function hasVolatileValues(value: Traversable): boolean {
  if (typeof value === "string") {
    return volatileValues.includes(value);
  }

  if (typeof value === "object" && value !== null) {
    for (const v of Object.values(value)) {
      if (hasVolatileValues(v as Traversable)) return true;
    }
  }

  return false;
}
