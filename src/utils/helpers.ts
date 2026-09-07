let counter = 0;

export const uid = (): string => `msg_${Date.now()}_${++counter}`;

export const classNames = (...args: (string | false | null | undefined)[]): string =>
  args.filter(Boolean).join(' ');

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** True for a `FileList`, without assuming the DOM type exists (SSR). */
export const isFileList = (v: unknown): v is FileList =>
  typeof FileList !== 'undefined' && v instanceof FileList;

/** True for a `File`, without assuming the DOM type exists (SSR). */
export const isFile = (v: unknown): v is File =>
  typeof File !== 'undefined' && v instanceof File;

/** Every `File` in a form value, whether it arrived as a `FileList`, a single
 *  `File`, or an array of them. Empty for any other value. */
export const filesFromValue = (value: unknown): File[] => {
  if (isFileList(value)) return Array.from(value);
  if (isFile(value)) return [value];
  if (Array.isArray(value) && value.some(isFile)) return value.filter(isFile);
  return [];
};

/**
 * Human-readable text for a collected form value.
 *
 * `String(value)` is not enough: a `FileList` stringifies to
 * `"[object FileList]"`, arrays lose their option labels, and booleans read as
 * `"true"`. `optionMap` maps stored values back to their option labels.
 */
export const formatFieldValue = (
  value: unknown,
  optionMap?: Map<string, string>,
): string => {
  const files = filesFromValue(value);
  if (files.length > 0) {
    return files.length === 1
      ? files[0].name
      : `${files.length} files (${files.map((f) => f.name).join(', ')})`;
  }

  if (Array.isArray(value)) {
    return value
      .map((v) => optionMap?.get(String(v)) ?? String(v))
      .filter((v) => v !== '')
      .join(', ');
  }

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value instanceof Date) return value.toLocaleString();

  const raw = String(value);
  return optionMap?.get(raw) ?? raw;
};

/**
 * Shorten a file name from the middle, keeping the extension visible.
 * `truncateMiddle('a-very-long-scan.pdf', 20)` → `'a-very-lo….pdf'`
 */
export const truncateMiddle = (text: string, max = 32): string => {
  if (text.length <= max) return text;
  const dot = text.lastIndexOf('.');
  const ext = dot > 0 && text.length - dot <= 8 ? text.slice(dot) : '';
  const head = Math.max(1, max - ext.length - 1);
  return `${text.slice(0, head)}…${ext}`;
};
