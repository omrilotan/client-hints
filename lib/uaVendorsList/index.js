import { parse } from '../parse/index.js'

/**
 * Make an array of each two cells of an array
 * @param {array} array
 * @returns {array[]}
 */
const pairs = array => array.reduce(
  (accumulator, value, index, array) => index % 2 === 0
    ? [...accumulator, array.slice(index, index + 2)]
    : accumulator,
  []
)

/**
 * Replace tokens by index
 * @param {string}
 * @param {array}
 * @returns {string}
 */
const extractTokens = (string, tokens) => string.replace(
  /__TOKEN\[(\d*)]__/g,
  (input, match) => match ? tokens[match] : input
)

/**
 * Get all indexes of a substring within a string
 * @param {string} string
 * @param {string} substring
 * @returns {number[]}
 */
function getIndexes (string, substring) {
  const indexes = []
  let index = -1
  while (true) {
    index = string.indexOf(substring, index + 1)
    if (index === -1) {
      break
    } else {
      indexes.push(index)
    }
  }
  return indexes
}

/**
 * Break comma separated string into an array
 * @param {string}
 * @returns {string[]}
 */
function getEntries (string) {
  const tokens = pairs(getIndexes(string, '"')).map(
    ([start, end]) => string.slice(start, end + 1)
  ).map(
    (token, index) => {
      string = string.replace(token, `__TOKEN[${index}]__`)
      return token
    }
  )

  return string.split(',').map(
    cell => extractTokens(cell, tokens).trim()
  )
}

/**
 * Extract user agent list from user agent header
 * @param {string} string
 * @returns {object}
 */
export const uaVendorsList = string => getEntries(string).map(
  entry => {
    const tokens = pairs(getIndexes(entry, '"')).map(
      ([start, end]) => entry.substring(start, end + 1)
    ).map(
      (token, index) => {
        entry = entry.replace(token, `__TOKEN[${index}]__`)
        return parse(token)
      }
    )

    return Object.fromEntries(
      entry.split(';').map(
        cell => {
          const parts = cell.split('=')
          return parts.length > 1
            ? [extractTokens(parts[0], tokens), extractTokens(parts[1], tokens)]
            : ['name', extractTokens(parts[0], tokens)]
        }
      )
    )
  }
)
