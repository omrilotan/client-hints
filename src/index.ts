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
  GPC: "sec-gpc",
  MOBILE: "sec-ch-ua-mobile",
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

  toJSON(): Record<string, string | number | boolean> {
    return Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter((name) => name !== "constructor")
      .reduce(
        (acc, name) =>
          this[name] !== "" ? Object.assign(acc, { [name]: this[name] }) : acc,
        {},
      );
  }

  get mobile(): boolean | undefined {
    const value = this.#get(HEADERS.MOBILE);
    return value ? value.includes("?1") : undefined;
  }

  get vendorName(): string | undefined {
    const names = this.#uaVendorsList.map(({ name }) => name);
    return vendors.find((vendor) => names.includes(vendor));
  }

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

  get platform(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_PLATFORM));
  }

  get platformVersion(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_PLATFORM_VERSION));
  }

  get fetchSite(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_SITE));
  }

  get fetchMode(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_MODE));
  }

  get fetchDest(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_DEST));
  }

  get fetchDestination(): string | undefined {
    return parse(this.#get(HEADERS.FETCH_DEST));
  }

  get fetchUser(): boolean | undefined {
    const value = this.#get(HEADERS.FETCH_USER);
    return value ? value.includes("?1") : undefined;
  }

  get arch(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_ARCH));
  }

  get architecture(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_ARCH));
  }

  get model(): string | undefined {
    return parse(this.#get(HEADERS.USER_AGENT_MODEL));
  }

  get deviceMemory(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DEVICE_MEMORY)));
  }

  get contentDevicePixelRatio(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.CONTENT_DPR)));
  }

  get contentDpr(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.CONTENT_DPR)));
  }

  get devicePixelRatio(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DPR)));
  }

  get dpr(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DPR)));
  }

  get effectiveConnectionType(): string | undefined {
    return parse(this.#get(HEADERS.ECT));
  }

  get ect(): string | undefined {
    return parse(this.#get(HEADERS.ECT));
  }

  get downlink(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.DOWNLINK)));
  }

  get width(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.WIDTH)));
  }

  get viewportWidth(): number | undefined {
    return toNumber(parse(this.#get(HEADERS.VIEWPORT_WIDTH)));
  }

  get purpose(): string | undefined {
    return parse(this.#get(HEADERS.PURPOSE));
  }

  get gpc(): boolean | undefined {
    const value = this.#get(HEADERS.GPC);
    return value ? value === "1" : undefined;
  }
}
