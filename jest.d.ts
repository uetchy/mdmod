declare function createRunner(
  basePath: string,
): (...flags: string[]) => Promise<string>;
declare function strip(str: string): string;
