/* eslint-disable @typescript-eslint/no-explicit-any */

export function getModifiedFields<T extends Record<string, any>>(
  original: T,
  updated: T,
): Partial<T> {
  const result: Partial<T> = {};

  for (const key in updated) {
    const origValue = original[key];
    const newValue = updated[key];

    if (Array.isArray(origValue) && Array.isArray(newValue)) {
      if (JSON.stringify(origValue) !== JSON.stringify(newValue)) {
        result[key] = newValue;
      }
    } else if (
      (origValue as any) instanceof Date &&
      (newValue as any) instanceof Date &&
      (origValue as Date).getTime() !== (newValue as Date).getTime()
    ) {
      result[key] = newValue;
    } else if (origValue !== newValue) {
      result[key] = newValue;
    }
  }

  return result;
}
