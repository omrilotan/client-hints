import { ClientHints } from ".";
import assert from "node:assert/strict";

describe("client-hints", () => {
  describe("Sec-CH-UA-Mobile", () => {
    it("parse from Headers", () => {
      const headers = new Headers();
      headers.set("sec-ch-ua-mobile", "?1");
      const hints = new ClientHints(headers);
      assert.equal(hints.mobile, true);
    });
    it("parse from heaaders object", () => {
      const headers = { "sec-ch-ua-mobile": "?1" };
      const hints = new ClientHints(headers);
      assert.equal(hints.mobile, true);
    });
    it("returns undefined when relevant header is missing", () => {
      const headers = {};
      const hints = new ClientHints(headers);
      assert.equal(hints.mobile, undefined);
      assert.equal(hints.platform, undefined);
      assert.equal(hints.vendorName, undefined);
      assert.equal(hints.platformVersion, undefined);
    });
  });
  describe("Sec-CH-UA, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Full-Version", () => {
    it("get vendor from user agent", () => {
      const headers = new Headers({
        "Sec-CH-UA":
          '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
      });
      const hints = new ClientHints(headers);
      assert.equal(hints.vendorName, "Microsoft Edge");
    });
    it("get vendor from list", () => {
      const headers = new Headers({
        "Sec-CH-UA-Full-Version-List":
          '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"',
      });
      const hints = new ClientHints(headers);
      assert.equal(hints.vendorName, "Google Chrome");
    });
    it("prefer vendor list", () => {
      const headers = new Headers({
        "Sec-CH-UA":
          '" Not A;Brand";v="99", "Chromium";v="98", "Microsoft Edge";v="98"',
        "Sec-CH-UA-Full-Version": '"100.0.4758.109"',
        "Sec-CH-UA-Full-Version-List":
          '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"',
      });
      const hints = new ClientHints(headers);
      assert.equal(hints.vendorName, "Google Chrome");
    });
    it("get version", () => {
      const headers = new Headers({
        "Sec-CH-UA-Full-Version": '"100.0.4758.109"',
        "Sec-CH-UA-Full-Version-List":
          '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"',
      });
      const hints = new ClientHints(headers);
      assert.equal(hints.vendorVersion, "100.0.4758.109");
    });
    it("get version from ch header", () => {
      const headers = new Headers({
        "Sec-CH-UA":
          '" Not A;Brand";v="99.0.0.0", "Chromium";v="100.0.4758.109", "Google Chrome";v="100.0.4758.109"',
      });
      const hints = new ClientHints(headers);
      assert.equal(hints.vendorVersion, "100.0.4758.109");
    });
  });
  describe("Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version", () => {
    it("get platform and version", () => {
      const headers = new Headers({
        "Sec-CH-UA-Platform": '"macOS"',
        "Sec-CH-UA-Platform-Version": '"12.1.0"',
      });
      const hints = new ClientHints(headers);
      assert.equal(hints.platform, "macOS");
      assert.equal(hints.platformVersion, "12.1.0");
    });
  });
  describe("general", () => {
    [
      ["arch", "Sec-CH-UA-Arch", '"x64"', "x64"],
      ["fetchDest", "Sec-Fetch-Dest", "document", "document"],
      ["fetchDestination", "Sec-Fetch-Dest", "document", "document"],
      ["fetchMode", "Sec-Fetch-Mode", "navigate", "navigate"],
      ["fetchSite", "Sec-Fetch-Site", "same-origin", "same-origin"],
      ["fetchUser", "Sec-Fetch-User", "?1", true],
      ["downlink", "Downlink", "1.7", 1.7],
      ["platform", "Sec-CH-UA-Platform", '"macOS"', "macOS"],
      ["platformVersion", "Sec-CH-UA-Platform-Version", '"12.1.0"', "12.1.0"],
      ["purpose", "Sec-Purpose", "prefetch", "prefetch"],
    ].forEach(
      ([feature, header, value, expected]: [string, string, string, any]) => {
        it([feature, header].join(": "), () => {
          const headers = new Headers({
            [header]: value,
          });
          const hints = new ClientHints(headers);
          assert.equal(hints[feature], expected);
        });
      },
    );
    it("accepts request object", () => {
      const request = new Request("https://example.com", {
        headers: {
          "Sec-CH-UA-Platform": "macOS",
        },
      });
      const hints = new ClientHints(request);
      assert.equal(hints.platform, "macOS");
    });
    it("pases to JSON", () => {
      const headers = new Headers({
        "sec-ch-ua":
          '"Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"',
        "sec-ch-ua-full-version": '"117.0.5938.132"',
        "sec-ch-ua-full-version-list":
          '"Google Chrome";v="117.0.5938.132", "Not;A=Brand";v="8.0.0.0", "Chromium";v="117.0.5938.132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-model": '""',
        "sec-ch-ua-platform": '"macOS"',
        "sec-ch-ua-platform-version": '"12.5.1"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
      });
      const hints = new ClientHints(headers);
      expect(JSON.stringify(hints, null, 2)).toMatchSnapshot();
    });
  });
});
