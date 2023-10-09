/**
 * Try to parse as JSON but return original argument if it fails
 */
export function parse(input: any): any {
  try {
    return JSON.parse(input)?.trim();
  } catch (error) {
    return input;
  }
}
