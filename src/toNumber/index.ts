const NULLABLES = [null, undefined, ""];

/**
 * Convert numeric to numbers and others to undefined
 */
export function toNumber(input: any): number {
  if (NULLABLES.includes(input)) {
    return undefined;
  }
  const result = Number(input);
  if (Number.isNaN(result)) {
    return undefined;
  }
  return result;
}
