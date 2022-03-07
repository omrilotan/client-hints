# client-hints
🕵️‍♂️ Parse client hints headers

Use client hints, where available

```js
import { ClientHints } from 'client-hints'
import { userAgentParser } from 'some-user-agent-parser-library'

app.get('/api-endpoint', (req, res) => {
  const hints = new ClientHints(req.headers)

  const isMobile = hints.mobile ?? (userAgentParser(req.get('user-agent')).device?.type === 'mobile')
  //                   ↑ cheap           ↑ more expensive

  res.send( isMobile ? 'Mobile' : 'Desktop' )
})
```

# Available detections
All detections return `undefined` if the relevant header is not available.

- mobile: `true`, `false`, `undefined`
- vendorName: `'Google Chrome'`, `undefined`
- vendorVersion: `'100.0.4758.109'`, `undefined`

```js
import { ClientHints } from 'client-hints'

const hints = new ClientHints(req.headers)

logger.info(`Page view on URL ${req.url} from ${[ hints.mobile, hints.vendorName, hints.vendorVersion ].join(' ')}`)
```

# Client hints

| Feature | Type | Header | Meaning | Adoption level
| - | - | - | - | -
| `vendorName` | _string_ | _string_ | Sec-CH-UA / Sec-CH-UA-Full-Version-List | User Agent vendor version list | Experimental
| `vendorVersion` | _string_ | Sec-CH-UA-Full-Version | User agent vendor version | Experimental
| `mobile` | _boolean_ | Sec-CH-UA-Mobile | Boolean: Is this a mobile device | Experimental
| `platform` | _string_ | Sec-CH-UA-Platform | Operating system name | Experimental
| `platformVersion` | _string_ | Sec-CH-UA-Platform-Version | Operating system version | Experimental
| `arch` | _string_ | Sec-CH-UA-Arch | CPU architecture | Experimental
| `model` | _string_ | Sec-CH-UA-Model | Device model | Experimental
| `fetchMode` | _string_ | Sec-Fetch-Mode | Navigation type |
| `fetchDest`, `fetchDestination` | _string_ | Sec-Fetch-Dest | Resource type |
| `fetchUser` | _boolean_ | Sec-Fetch-User | Was the request triggered by user action |
| `fetchSite` | _string_ | Sec-Fetch-Site | Relationship to origin |
| `dpr`, `devicePixelRatio` | _string_ | Content-DPR | Image device to pixel ratio | Experimental
| `deviceMemory` | _number_ | Device-Memory |  Appr. available RAM | Experimental
| `dpr`, `devicePixelRatio` | _number_ | DPR | Device pixel ratio | Deprecated
| `contentDpr`, `contentDevicePixelRatio` | _number_ | Content-DPR | Image device pixel ratio | Deprecated
| `ect`, `effectiveConnectionType` | _string_ | ECT | Network profile (G) | Experimental
| `downlink` | _number_ | Downlink | Network speed (Mbps) | Experimental
| `viewportWidth` | _number_ | Viewport-Width | Layout viewport width | Deprecated
| `width` | _number_ | Width | Resource desired width | Deprecated

## Client Hints Intruction Response Header
Set the value of `Accept-CH` header to include the headers you want the browse to send.
```
Accept-CH: Sec-CH-UA-Mobile,Sec-CH-UA-Full-Version,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version,ECT
```
