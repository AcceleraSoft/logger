import type { Levels } from "./index.js";

export const defaultLevels = {
  debug: 0,
  verbose: 10,
  info: 50,
  warn: 60,
  error: 90,
  fatal: 100,
} satisfies Levels;

