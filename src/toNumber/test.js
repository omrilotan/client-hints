/* eslint-env mocha */

import { toNumber } from './index.js'
import { strict as assert } from 'assert'

describe('toNumber', () => {
  [
    ['1', 1],
    ['1.1', 1.1],
    ['a', undefined],
    ['', undefined],
    [null, undefined],
    [NaN, undefined],
    [Infinity, Infinity],
    ['-Infinity', -Infinity]
  ].forEach(([input, expected]) => {
    it(`convert ${input} to ${expected}`, () => {
      assert.equal(toNumber(input), expected)
    })
  })
})
