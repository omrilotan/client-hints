/* eslint-env mocha */

import { strict as assert } from 'assert'
import { uaVendorsList } from './index.js'

describe('uaVendorsList', () => {
  it('get a list from UA full versions list: Chrome', () => {
    const userAgentString = '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"'
    assert.deepEqual(uaVendorsList(userAgentString), [
      { name: 'Not A;Brand', v: '99.0.0.0' },
      { name: 'Chromium', v: '100.0.4758.109' },
      { name: 'Google Chrome', v: '100.0.4758.109' }
    ])
  })
  it('get a list from UA full versions list: Edge', () => {
    const userAgentString = '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"'
    assert.deepEqual(uaVendorsList(userAgentString), [
      { name: 'Not A;Brand', v: '99' },
      { name: 'Chromium', v: '98' },
      { name: 'Microsoft Edge', v: '98' }
    ])
  })
  it('get a list from UA full versions list: GREASEing', () => {
    const userAgentString = '" Not A, Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"'
    assert.deepEqual(uaVendorsList(userAgentString), [
      { name: 'Not A, Brand', v: '99' },
      { name: 'Chromium', v: '98' },
      { name: 'Microsoft Edge', v: '98' }
    ])
  })
})
