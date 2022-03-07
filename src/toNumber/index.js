const NULLABLES = [
  null,
  undefined,
  ''
]

/**
 * Convert numeric to numbers and others to undefined
 * @param {any} input
 * @returns {number}
 */
export function toNumber (input) {
  if (NULLABLES.includes(input)) {
    return undefined
  }
  const result = Number(input)
  if (Number.isNaN(result)) {
    return undefined
  }
  return result
}
