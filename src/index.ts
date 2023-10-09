import { parse } from "./parse";
import { toNumber } from "./toNumber";
import { uaVendorsList } from "./uaVendorsList";

/**
 * Known vendor names in level of priority
 */
const vendors = ["Chrome", "Google Chrome", "Microsoft Edge", "Chromium"];

const HEADERS = {
  CONTENT_DPR: "content-dpr",
  DEVICE_MEMORY: "device-memory",
  DOWNLINK: "downlink",
  DPR: "dpr",
  ECT: "ect",
  FETCH_DEST: "sec-fetch-dest",
  FETCH_MODE: "sec-fetch-mode",
  FETCH_SITE: "sec-fetch-site",
  FETCH_USER: "sec-fetch-user",
  MOBILE: "sec-ch-mobile",
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

interface Headers {
  entries(): Iterable<[string, string]>;
}

export class ClientHints {
  entries: [string, string][];
  constructor(headers: Headers | object) {
    const entries =
      Symbol.iterator in headers
        ? Array.from(
            (headers as Headers).entries() as Iterable<[string, string]>,
          )
        : Object.entries(headers);

    this.entries = entries.map(([key, value]) => [key.toLowerCase(), value]);
  }

  #store = new Map();

  /**
   * @param name: header name
   * @returns comma separted list of header values
   */
  #get(name: string): string {
    return this.entries
      .filter(([key]) => key === name)
      .map(([, value]) => value)
      .join(", ");
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

  get mobile(): boolean {
    return this.#get(HEADERS.MOBILE)?.includes("?1");
  }

  get vendorName(): string {
    const names = this.#uaVendorsList.map(({ name }) => name);
    return vendors.find((vendor) => names.includes(vendor));
  }

  get vendorVersion(): string {
    const header = this.#get(HEADERS.USER_AGENT_VERSION);
    if (header) {
      return parse(header);
    }
    const entry = this.#uaVendorsList.find(
      ({ name }) => name === this.vendorName,
    );
    return entry?.v || entry?.version || "";
  }

  get platform(): string {
    return parse(this.#get(HEADERS.USER_AGENT_PLATFORM));
  }

  get platformVersion(): string {
    return parse(this.#get(HEADERS.USER_AGENT_PLATFORM_VERSION));
  }

  get fetchSite(): string {
    return parse(this.#get(HEADERS.FETCH_SITE));
  }

  get fetchMode(): string {
    return parse(this.#get(HEADERS.FETCH_MODE));
  }

  get fetchDest(): string {
    return parse(this.#get(HEADERS.FETCH_DEST));
  }

  get fetchDestination(): string {
    return parse(this.#get(HEADERS.FETCH_DEST));
  }

  get fetchUser(): boolean {
    return this.#get(HEADERS.FETCH_USER)?.includes("?1");
  }

  get arch(): string {
    return parse(this.#get(HEADERS.USER_AGENT_ARCH));
  }

  get architecture(): string {
    return parse(this.#get(HEADERS.USER_AGENT_ARCH));
  }

  get model(): string {
    return parse(this.#get(HEADERS.USER_AGENT_MODEL));
  }

  get deviceMemory(): number {
    return toNumber(parse(this.#get(HEADERS.DEVICE_MEMORY)));
  }

  get contentDevicePixelRatio(): number {
    return toNumber(parse(this.#get(HEADERS.CONTENT_DPR)));
  }

  get contentDpr(): number {
    return toNumber(parse(this.#get(HEADERS.CONTENT_DPR)));
  }

  get devicePixelRatio(): number {
    return toNumber(parse(this.#get(HEADERS.DPR)));
  }

  get dpr(): number {
    return toNumber(parse(this.#get(HEADERS.DPR)));
  }

  get effectiveConnectionType(): string {
    return parse(this.#get(HEADERS.ECT));
  }

  get ect(): string {
    return parse(this.#get(HEADERS.ECT));
  }

  get downlink(): number {
    return toNumber(parse(this.#get(HEADERS.DOWNLINK)));
  }

  get width(): number {
    return toNumber(parse(this.#get(HEADERS.WIDTH)));
  }

  get viewportWidth(): number {
    return toNumber(parse(this.#get(HEADERS.VIEWPORT_WIDTH)));
  }

  get purpose(): string {
    return parse(this.#get(HEADERS.PURPOSE));
  }
}
