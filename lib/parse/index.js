/**
 * Try to parse as JSON but return original argument if it fails
 * @param {any} input
 * @returns {any}
 */
export function parse (input) {
  try {
    return JSON.parse(input)
  } catch (error) {
    return input
  }
}
