import type { ChalkInstance } from "chalk"
import { defaultLevels } from "./default";

export { default as ConsoleReporter } from "./reporter/console"

export type LevelDesc = {
  display: string;
  style: ChalkInstance,
};

export type LevelStyles<L = Levels> = { [K in keyof L]: { display: string; render: (display: string) => string; } };

export type Levels = Record<string, number>;

export type Logger<L> = {
  namespaced(name: string): Logger<L>;
} & { [K in keyof L]: (message: string) => void };

export type CreateLoggerOptions<L extends Levels = typeof defaultLevels> = {
  namespaces?: Namespace[];
  levels?: L;
  reporter: Reporter;
};

export type Namespace = string[];

export function createLogger<L extends Levels = typeof defaultLevels>({
  reporter,
  namespaces = [],
  levels = defaultLevels as any,
}: CreateLoggerOptions<L>): Logger<L> {
  for (const namespace of namespaces) {
    reporter.announceNamespace(namespace);
  }
  function createInstance(namespace: Namespace) {
    const logger = {} as Logger<L>;
    logger.namespaced = function (name: string) {
      return createInstance([ ...namespace, name ]);
    }
    for (const levelTag of Object.keys(levels)) {
      // @ts-ignore We need to assign to the generic here
      logger[levelTag] = (message: string) => reporter.report(levelTag, message, namespace);
    }
    return logger;
  }
  return createInstance([]);
}

export interface Reporter {
  announceNamespace(names: Namespace): void;
  report(level: string, message: string, namespaces: string[]): void;
}

