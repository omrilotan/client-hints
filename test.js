/* eslint-env mocha */
/* global Headers */

import { ClientHints } from './index.js'
import { strict as assert } from 'assert'

describe('client-hints', () => {
  describe('Sec-CH-UA-Mobile', () => {
    it('parse from Headers', () => {
      const headers = new Headers()
      headers.set('sec-ch-mobile', '?1')
      const hints = new ClientHints(headers)
      assert.equal(hints.mobile, true)
    })
    it('parse from heaaders object', () => {
      const headers = { 'sec-ch-mobile': '?1' }
      const hints = new ClientHints(headers)
      assert.equal(hints.mobile, true)
    })
  })
  describe('Sec-CH-UA, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Full-Version', () => {
    it('get vendor from user agent', () => {
      const headers = new Headers({
        'Sec-CH-UA': '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"'
      })
      const hints = new ClientHints(headers)
      assert.equal(hints.vendorName, 'Microsoft Edge')
    })
    it('get vendor from list', () => {
      const headers = new Headers({
        'Sec-CH-UA-Full-Version-List': '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"'
      })
      const hints = new ClientHints(headers)
      assert.equal(hints.vendorName, 'Google Chrome')
    })
    it('prefer vendor list', () => {
      const headers = new Headers({
        'Sec-CH-UA': '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
        'Sec-CH-UA-Full-Version': '"100.0.4758.109"',
        'Sec-CH-UA-Full-Version-List': '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"'
      })
      const hints = new ClientHints(headers)
      assert.equal(hints.vendorName, 'Google Chrome')
    })
    it('get version', () => {
      const headers = new Headers({
        'Sec-CH-UA-Full-Version': '"100.0.4758.109"',
        'Sec-CH-UA-Full-Version-List': '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"'
      })
      const hints = new ClientHints(headers)
      assert.equal(hints.vendorVersion, '100.0.4758.109')
    })
    it('get version from ch header', () => {
      const headers = new Headers({
        'Sec-CH-UA': '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"'
      })
      const hints = new ClientHints(headers)
      assert.equal(hints.vendorVersion, '100.0.4758.109')
    })
  })
  describe('Sec-CH-HA-Platform, Sec-CH-HA-Platform-Version', () => {
    it('get platform and version', () => {
      const headers = new Headers({
        'Sec-CH-HA-Platform': '"macOS"',
        'Sec-CH-HA-Platform-Version': '"12.1.0"'
      })
      const hints = new ClientHints(headers)
      assert.equal(hints.platform, 'macOS')
      assert.equal(hints.platformVersion, '12.1.0')
    })
  })
})
