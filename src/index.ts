import { parse } from "./parse";
import { toNumber } from "./toNumber";
import { uaVendorsList } from "./uaVendorsList";

/**
 * Known vendor names in level of priority
 * Used to prioritize Chromium based browsers the name even though the name "Chromium" may appear first in the list
 */
const vendors: string[] = [
  "Chrome",
  "Google Chrome",
  "Microsoft Edge",
  "Brave",
  "HeadlessChrome",
  "YaBrowser",
];

const HEADERS: Record<string, string> = {
  BITNESS: "sec-ch-ua-bitness",
  CONTENT_DPR: "content-dpr",
  DEVICE_MEMORY: "device-memory",
  DOWNLINK: "downlink",
  DPR: "dpr",
  ECT: "ect",
  FETCH_DEST: "sec-fetch-dest",
  FETCH_MODE: "sec-fetch-mode",
  FETCH_SITE: "sec-fetch-site",
  FETCH_USER: "sec-fetch-user",
  GPC: "sec-gpc",
  MOBILE: "sec-ch-ua-mobile",
  PREFERS_COLOR_SCHEME: "sec-ch-prefers-color-scheme",
  PREFERS_REDUCED_MOTION: "sec-ch-prefers-reduced-motion",
  PREFERS_REDUCED_TRANSPARENCY: "sec-ch-prefers-reduced-transparency",
  PURPOSE: "sec-purpose",
  USER_AGENT_ARCH: "sec-ch-ua-arch",
  USER_AGENT_MODEL: "sec-ch-ua-model",
  USER_AGENT_PLATFORM_VERSION: "sec-ch-ua-platform-version",
  USER_AGENT_PLATFORM: "sec-ch-ua-platform",
  USER_AGENT_VERSION_LIST: "sec-ch-ua-full-version-list",
  USER_AGENT_VERSION: "sec-ch-ua-full-version",
  USER_AGENT: "sec-ch-ua",
  VIEWPORT_WIDTH: "viewport-width",
  WIDTH: "width",
};

/**
 * Parse client hints headers and provide a convenient API to access device information and user preferences
 */
export class ClientHints {
  entries: [string, string][];
  constructor(input: Request | Headers | object) {
    const headers =
      input instanceof Request ? (input as Request).headers : input;
    const entries =
      headers instanceof Headers
        ? Array.from((headers as globalThis.Headers).entries())
        : Object.entries(headers);
    this.entries = entries.map(([key, value]) => [key.toLowerCase(), value]);
  }

  #store = new Map();

  /**
   * @param name: header name
   * @returns comma separted list of header values
   */
  #get(name: string): string | undefined {
    const list = this.entries
      .filter(([key]) => key === name)
      .map(([, value]) => value);
    return list.length ? list.join(", ") : undefined;
  }

  get #uaVendorsList(): { name: string; v?: string; version?: string }[] {
    if (!this.#store.has("uaVendorsList")) {
      const header =
        this.#get(HEADERS.USER_AGENT_VERSION_LIST) ||
        this.#get(HEADERS.USER_AGENT);
      if (header) {
        this.#store.set("uaVendorsList", uaVendorsList(header));
      } else {
        this.#store.set("uaVendorsList", []);
      }
    }
    return this.#store.get("uaVendorsList");
  }

  /**
   * Convert to a JSONable object. Also used in the implementation of JSON.stringify
   * @example
   * console.log(new ClientHints(request)) // {"mobile":true,"vendorName":"Chrome","vendorVersion":"91",...}
   */
  toJSON(): Record<string, string | number | boolean> {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter((name) => name !== "constructor")
      .reduce(
        (acc, name) =>
          this[name] !== "" ? Object.assign(acc, { [name]: this[name] }) : acc,
        {},
      );
  }

  /**
   * The browser is on a mobile device
   */
  get mobile(): boolean | undefined {
    const value = this.#get(HEADERS.MOBILE);
    return value ? value.includes("?1") : undefined;
  }

  /**
   * Browser brand name
   */
  get vendorName(): string | undefined {
    const names = this.#uaVendorsList
      .map(({ name }) => name)
      .filter((name) => !/^[\W]*not/i.test(name));
    return vendors.find((vendor) => names.includes(vendor)) ?? names.at(0);
  }

  /**
   * Browser version
   */
  get vendorVersion(): string | undefined {
    const header = this.#get(HEADERS.USER_AGENT_VERSION);
    if (header) {
      return parse(header);
    }
    const entry = this.#uaVendorsList.find(
      ({ name }) => name === this.vendorName,
    );
    return entry?.v || entry?.version || undefined;
  }

  /**
   * Operating system name
   */
  get platform(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_PLATFORM));
  }

  /**
   * Operating system version
   */
  get platformVersion(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_PLATFORM_VERSION));
  }

  /**
   * Relationship to origin
   */
  get fetchSite(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_SITE));
  }

  /**
   * Navigation type (navigate, nested-navigate, same-origin, cross-origin, ...)
   */
  get fetchMode(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_MODE));
  }

  /**
   * Resource type (document, iframe, script, image, ...)
   */
  get fetchDest(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_DEST));
  }

  /**
   * Resource type (document, iframe, script, image, ...)
   */
  get fetchDestination(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_DEST));
  }

  /**
   * User activation
   */
  get fetchUser(): boolean | undefined {
    const value = this.#get(HEADERS.FETCH_USER);
    return value ? value.includes("?1") : undefined;
  }

  /**
   * CPU architecture (ARM, x86)
   */
  get arch(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_ARCH));
  }

  /**
   * CPU architecture (ARM, x86)
   */
  get architecture(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_ARCH));
  }

  /**
   * CPU bitness (32, 64)
   */
  get bitness(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.BITNESS)));
  }

  /**
   * Device model name
   */
  get model(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_MODEL));
  }

  /**
   * Device amount of RAM (approximate)
   */
  get deviceMemory(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DEVICE_MEMORY)));
  }

  /**
   * [Deprecated] Image density suitable for the screen
   */
  get contentDevicePixelRatio(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.CONTENT_DPR)));
  }

  /**
   * [Deprecated] Image density suitable for the screen
   */
  get contentDpr(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.CONTENT_DPR)));
  }

  /**
   * [Deprecated] Screen pixel density
   */
  get devicePixelRatio(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DPR)));
  }

  /**
   * [Deprecated] Screen pixel density
   */
  get dpr(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DPR)));
  }

  /**
   * Connection type name (slow-2g, 2g, 3g, 4g, ...)
   */
  get effectiveConnectionType(): string | undefined {
    return parse(this.#get(HEADERS.ECT));
  }

  /**
   * Connection type name (slow-2g, 2g, 3g, 4g, ...)
   */
  get ect(): string | undefined {
    return parse(this.#get(HEADERS.ECT));
  }

  /**
   * Approximate bandwidth of the connection
   */
  get downlink(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DOWNLINK)));
  }

  /**
   * [Deprecated] Screen width in pixels
   */
  get width(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.WIDTH)));
  }

  /**
   * [Deprecated] Viewport width in pixels
   */
  get viewportWidth(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.VIEWPORT_WIDTH)));
  }

  /**
   * Accesibility; Preferred color scheme (light, dark)
   */
  get prefersColorScheme(): "light" | "dark" | undefined {
    return parse(this.#get(HEADERS.PREFERS_COLOR_SCHEME));
  }

  /**
   * Accesibility; Preferred reduced motion setting
   */
  get prefersReducedMotion(): boolean | undefined {
    switch (this.#get(HEADERS.PREFERS_REDUCED_MOTION)) {
      case "no-preference":
        return false;
      case "reduce":
        return true;
      default:
        return undefined;
    }
  }

  /**
   * Accesibility; Preferred reduced transparency setting
   */
  get prefersReducedTransparency(): boolean | undefined {
    switch (this.#get(HEADERS.PREFERS_REDUCED_TRANSPARENCY)) {
      case "no-preference":
        return false;
      case "reduce":
        return true;
      default:
        return undefined;
    }
  }

  /**
   * Purpose of the request (prefetch, ...)
   */
  get purpose(): string | undefined {
    return parse(this.#get(HEADERS.PURPOSE));
  }

  /**
   * [Non-standard] Global privacy control (GPC) setting
   */
  get gpc(): boolean | undefined {
    const value = this.#get(HEADERS.GPC);
    return value ? value === "1" : undefined;
  }
}
