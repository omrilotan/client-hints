import { parse } from './parse/index.js'
import { uaVendorsList } from './uaVendorsList/index.js'
import { toNumber } from './toNumber/index.js'

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

  #store = new Map()

  /**
   * @param {string} header name
   * @returns {string} comma separted list of header values
   */
  #get (name) {
    return this.entries.filter(
      ([key]) => key === name
    ).map(
      ([, value]) => value
    ).join(', ')
  }

  get #uaVendorsList () {
    if (!this.#store.has('uaVendorsList')) {
      const header = this.#get('sec-ch-ua-full-version-list') || this.#get('sec-ch-ua')
      if (header) {
        this.#store.set('uaVendorsList', uaVendorsList(header))
      } else {
        this.#store.set('uaVendorsList', [])
      }
    }
    return this.#store.get('uaVendorsList')
  }

  /**
   * @returns {boolean}
   */
  get mobile () {
    return this.#get('sec-ch-mobile')?.includes('?1')
  }

  /**
   * @returns {string}
   */
  get vendorName () {
    const names = this.#uaVendorsList.map(({ name }) => name)
    return vendors.find(
      vendor => names.includes(vendor)
    )
  }

  /**
   * @returns {string}
   */
  get vendorVersion () {
    const header = this.#get('sec-ch-ua-full-version')
    if (header) {
      return parse(header)
    }
    const entry = this.#uaVendorsList.find(({ name }) => name === this.vendorName)
    return entry?.v || entry?.version || ''
  }

  /**
   * @returns {string}
   */
  get platform () {
    return parse(this.#get('sec-ch-ua-platform'))
  }

  /**
   * @returns {string}
   */
  get platformVersion () {
    return parse(this.#get('sec-ch-ua-platform-version'))
  }

  /**
   * @returns {string}
   */
  get fetchSite () {
    return parse(this.#get('sec-fetch-site'))
  }

  /**
   * @returns {string}
   */
  get fetchMode () {
    return parse(this.#get('sec-fetch-mode'))
  }

  /**
   * @returns {string}
   */
   get fetchDest () {
    return parse(this.#get('sec-fetch-dest'))
  }

  /**
   * @returns {string}
   */
  get fetchDestination () {
    return parse(this.#get('sec-fetch-dest'))
  }

  /**
   * @returns {boolean}
   */
  get fetchUser () {
    return this.#get('sec-fetch-user')?.includes('?1')
  }

  /**
   * @returns {string}
   */
  get arch () {
    return parse(this.#get('sec-ch-ua-arch'))
  }

  /**
   * @returns {string}
   */
  get model () {
    return parse(this.#get('sec-ch-ua-model'))
  }

  /**
   * @returns {number}
   */
  get deviceMemory () {
    return toNumber(parse(this.#get('device-memory')))
  }

  /**
   * @returns {number}
   */
  get contentDevicePixelRatio () {
    return toNumber(parse(this.#get('content-dpr')))
  }

  /**
   * @returns {number}
   */
   get contentDpr () {
    return toNumber(parse(this.#get('content-dpr')))
  }

  /**
   * @returns {number}
   */
  get devicePixelRatio () {
    return toNumber(parse(this.#get('dpr')))
  }

  /**
   * @returns {number}
   */
  get dpr () {
    return toNumber(parse(this.#get('dpr')))
  }

  /**
   * @returns {string}
   */
  get effectiveConnectionType () {
    return parse(this.#get('ect'))
  }

  /**
   * @returns {string}
   */
  get ect () {
    return parse(this.#get('ect'))
  }

  /**
   * @returns {number}
   */
  get downlink () {
    return toNumber(parse(this.#get('downlink')))
  }

  /**
   * @returns {number}
   */
  get width () {
    return toNumber(parse(this.#get('width')))
  }

  /**
   * @returns {number}
   */
  get viewportWidth () {
    return toNumber(parse(this.#get('viewport-width')))
  }
}
