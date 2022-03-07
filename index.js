import { parse } from './lib/parse/index.js'
import { uaVendorsList } from './lib/uaVendorsList/index.js'

/**
 * Known vendor names in level of priority
 */
const vendors = [
  'Chrome',
  'Google Chrome',
  'Microsoft Edge',
  'Chromium'
]

export class ClientHints {
  /**
   * @param {Headers|object} headers
   */
  constructor (headers) {
    const entries = Symbol.iterator in headers
      ? Array.from(headers)
      : Object.entries(headers)

    this.entries = entries.map(
      ([key, value]) => [key.toLowerCase(), value]
    )
  }

  /**
   * @param {string} header name
   * @returns {string} comma separted list of header values
   */
  get (name) {
    return this.entries.filter(
      ([key]) => key === name
    ).map(
      ([key, value]) => value
    ).join(', ')
  }

  /**
   * @returns {boolean}
   */
  get mobile () {
    return this.get('sec-ch-mobile')?.includes('?1')
  }

  get uaVendorsList () {
    if (!this._uaVendorsList) {
      const header = this.get('sec-ch-ua-full-version-list') || this.get('sec-ch-ua')
      if (header) {
        this._uaVendorsList = uaVendorsList(header)
      } else {
        this._uaVendorsList = []
      }
    }
    return this._uaVendorsList
  }

  /**
   * @returns {string}
   */
  get vendorName () {
    const names = this.uaVendorsList.map(({ name }) => name)
    return vendors.find(
      vendor => names.includes(vendor)
    )
  }

  /**
   * @returns {string}
   */
  get vendorVersion () {
    const header = this.get('sec-ch-ua-full-version')
    if (header) {
      return parse(header)
    }
    const entry = this.uaVendorsList.find(({ name }) => name === this.vendorName)
    return entry?.v || entry?.version || ''
  }

  /**
   * @returns {string}
   */
  get platform () {
    return parse(this.get('sec-ch-ha-platform'))
  }

  /**
   * @returns {string}
   */
  get platformVersion () {
    return parse(this.get('sec-ch-ha-platform-version'))
  }

  /**
   * @returns {string}
   */
  get fetchSite () {
    return parse(this.get('sec-fetch-site'))
  }

  /**
   * @returns {string}
   */
  get fetchMode () {
    return parse(this.get('sec-fetch-mode'))
  }

  /**
   * @returns {string}
   */
  get fetchDestination () {
    return parse(this.get('sec-fetch-dest'))
  }

  /**
   * @returns {string}
   */
  get fetchUser () {
    return this.get('sec-fetch-user')?.includes('?1')
  }

  /**
   * @returns {string}
   */
  get arch () {
    return parse(this.get('sec-ch-ua-arch'))
  }

  /**
   * @returns {string}
   */
  get model () {
    return parse(this.get('sec-ch-ua-model'))
  }

  /**
   * @returns {string}
   */
  get deviceMemory () {
    return parse(this.get('device-memory'))
  }

  /**
   * @returns {string}
   */
  get devicePixelRatio () {
    return parse(this.get('dpr'))
  }

  /**
   * @returns {string}
   */
  get dpr () {
    return parse(this.get('dpr'))
  }

  /**
   * @returns {string}
   */
  get effectiveConnectionType () {
    return parse(this.get('ect'))
  }

  /**
   * @returns {string}
   */
  get ect () {
    return parse(this.get('ect'))
  }

  /**
   * @returns {string}
   */
  get downlink () {
    return parse(this.get('downlink'))
  }

  /**
   * @returns {string}
   */
  get width () {
    return parse(this.get('width'))
  }

  /**
   * @returns {string}
   */
  get viewportWidth () {
    return parse(this.get('viewport-width'))
  }
}
