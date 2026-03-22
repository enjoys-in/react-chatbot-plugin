let counter = 0;

export const uid = (): string => `msg_${Date.now()}_${++counter}`;

export const classNames = (...args: (string | false | null | undefined)[]): string =>
  args.filter(Boolean).join(' ');

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
