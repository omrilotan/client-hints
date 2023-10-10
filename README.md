# client-hints [![](https://img.shields.io/npm/v/client-hints.svg?style=flat-square)](https://www.npmjs.com/package/client-hints)

🕵️‍♂️ Parse client hints headers

Use client hints, where available

```js
import { ClientHints } from "client-hints";
import { userAgentParser } from "some-user-agent-parser-library";

app.get("/api-endpoint", (req, res) => {
  const hints = new ClientHints(req);

  const isMobile =
    hints.mobile ?? // cheap
    userAgentParser(req.get("user-agent")).device?.type === "mobile"; // more expensive

  const browserName =
    hints.vendorName ?? // cheap
    userAgentParser(req.get("user-agent")).browser?.name; // more expensive

  console.log(JSON.stringify(hints, null, 2)); // Serialises all available hints

  res.send(`${isMobile ? "Mobile" : "Desktop"} browser: ${browserName}`);
});
```

## Available detections

All detections return `undefined` if the relevant header is not available.

| Feature                                 | Type      | Header                                  | Meaning                                  | Adoption level |
| --------------------------------------- | --------- | --------------------------------------- | ---------------------------------------- | -------------- |
| `arch`, `architecture`                  | _string_  | Sec-CH-UA-Arch                          | CPU architecture                         | Experimental   |
| `contentDpr`, `contentDevicePixelRatio` | _number_  | Content-DPR                             | Image device pixel ratio                 | Deprecated     |
| `deviceMemory`                          | _number_  | Device-Memory                           | Appr. available RAM                      | Experimental   |
| `downlink`                              | _number_  | Downlink                                | Network speed (Mbps)                     | Experimental   |
| `dpr`, `devicePixelRatio`               | _number_  | DPR                                     | Device pixel ratio                       | Deprecated     |
| `dpr`, `devicePixelRatio`               | _string_  | Content-DPR                             | Image device to pixel ratio              | Experimental   |
| `ect`, `effectiveConnectionType`        | _string_  | ECT                                     | Network profile (G)                      | Experimental   |
| `fetchDest`, `fetchDestination`         | _string_  | Sec-Fetch-Dest                          | Resource type                            |
| `fetchMode`                             | _string_  | Sec-Fetch-Mode                          | Navigation type                          |
| `fetchSite`                             | _string_  | Sec-Fetch-Site                          | Relationship to origin                   |
| `fetchUser`                             | _boolean_ | Sec-Fetch-User                          | Was the request triggered by user action |
| `mobile`                                | _boolean_ | Sec-CH-UA-Mobile                        | Boolean: Is this a mobile device         | Experimental   |
| `model`                                 | _string_  | Sec-CH-UA-Model                         | Device model                             | Experimental   |
| `platform`                              | _string_  | Sec-CH-UA-Platform                      | Operating system name                    | Experimental   |
| `platformVersion`                       | _string_  | Sec-CH-UA-Platform-Version              | Operating system version                 | Experimental   |
| `purpose`                               | _string_  | Sec-Purpose                             | Resource purpose (prefetch)              | Experimental   |
| `vendorName`                            | _string_  | Sec-CH-UA / Sec-CH-UA-Full-Version-List | User Agent vendor version list           | Experimental   |
| `vendorVersion`                         | _string_  | Sec-CH-UA-Full-Version                  | User agent vendor version                | Experimental   |
| `viewportWidth`                         | _number_  | Viewport-Width                          | Layout viewport width                    | Deprecated     |
| `width`                                 | _number_  | Width                                   | Resource desired width                   | Deprecated     |

## Client Hints Intruction Response Header

Set the value of `Accept-CH` header to include the headers you want the browse to send.

```plaintext
Accept-CH: Sec-CH-UA-Mobile,Sec-CH-UA-Full-Version,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version,ECT
```

Include all available hints:

```plaintext
Accept-CH: *
```
