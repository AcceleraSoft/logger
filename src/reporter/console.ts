import chalk from "chalk";
import { hash } from "../util";
import type { Levels, LevelStyles, Namespace, Reporter } from "..";
import { defaultLevels } from "../default";

const defaultLevelStyles = {
  'error': {
    display: 'ERROR',
    render: chalk.red,
  },
  'warn': {
    display: 'WARNING',
    render: chalk.yellow,
  },
  'info': {
    display: 'INFO',
    render: chalk.blue,
  },
  'verbose': {
    display: 'VERBOSE',
    render: chalk.magenta,
  },
  'debug': {
    display: 'DEBUG',
    render: chalk.gray,
  },
} satisfies LevelStyles;

export default class ConsoleReporter<L extends Levels = typeof defaultLevels> implements Reporter {

  private maxNamespaceChars = 0;
  private maxLevelChars = 0;

  public constructor(
    private styles: LevelStyles<L> = defaultLevelStyles as any,
  ) {
    this.maxLevelChars = Math.max(...Object.values(defaultLevelStyles).map(s => s.display.length));
  }

  public announceNamespace(namespace: string[]) {
    const charCount = this.namespaceToPlainText(namespace).length;
    if (charCount > this.maxNamespaceChars) {
      this.maxNamespaceChars = charCount;
    }
  }

  /**
   * Render a namespace to plaintext without any styles applied to it.
   */
  private namespaceToPlainText(namespace: Namespace): string {
    return namespace.join('.');
  }

  /**
   * Render a level tag to plaintext without any styles applied to it.
   */
  private levelTagToPlainText(levelTag: string) {
    return this.styles[levelTag]!.display;
  }

  public report(levelTag: string, message: string, namespace: Namespace): void {

    const style = this.styles[levelTag]!;

    let out = '';

    // Start of prefix
    out += '[';

    out += chalk.dim((new Date().toISOString()));

    // Write namespace
    if (namespace.length > 0) {
      out += ' ';
      this.announceNamespace(namespace);
      const namespaceStr = this.namespaceToPlainText(namespace);
      const [r,g,b] = toRGB(hash(namespaceStr));
      out += chalk.rgb(r,g,b)(namespaceStr);
      out += ' '.repeat(this.maxNamespaceChars - namespaceStr.length);
    } else if (this.maxNamespaceChars > 0) {
      out += ' ';
      out += ' '.repeat(this.maxNamespaceChars);
    }

    // Render the log level tag
    out += ' ';
    out += style.render(this.levelTagToPlainText(levelTag));
    out += ' '.repeat((this.maxLevelChars - style.display.length))

    // Finish prefix
    out += '] ';

    out += message.trimEnd();

    // Output the resulting log message
    console.log(out);
  }

}

function toRGB(c: number): [r: number, g: number, b: number] {
  return [ c & 255, (c >> 8) & 255, (c >> 16) & 255 ]
}
