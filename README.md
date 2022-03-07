```js
import { ClientHints } from 'client-hints'
import { userAgentParser } from 'some-user-agent-parser-library'

app.get('/api-endpoint', (req, res) => {
  const hints = new ClientHints(req.headers)

  const isMobile = hints.mobile ?? userAgentParser(req.get('user-agent'))
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
import { hints } from 'client-hints'

const hint = new hints(req.headers)

logger.info(`Page view on URL ${req.url} from ${[ hint.mobile, hint.vendorName, hint.vendorVersion ].join(' ')}`)
```

# Client hints

| Feature | Header | Meaning | Adoption level
| - | - | - | -
| Unused | UA | … | Deprecated
| `vendorName` | Sec-CH-UA / Sec-CH-UA-Full-Version-List | User Agent vendor version list | Experimental
| `vendorVersion` | Sec-CH-UA-Full-Version | User agent vendor version | Experimental
| `mobile` {Boolean} | Sec-CH-UA-Mobile | Boolean: Is this a mobile device | Experimental
| `platform` | Sec-CH-UA-Platform | Operating system name | Experimental
| `platformVersion` | Sec-CH-UA-Platform-Version | Operating system version | Experimental
| `arch` | Sec-CH-UA-Arch | CPU architecture | Experimental
| `model` | Sec-CH-UA-Model | Device model | Experimental
| `fetchMode` | Sec-Fetch-Mode | Navigation type |
| `fetchDestination` | Sec-Fetch-Dest | Resource type |
| `fetchUser` {Boolean} | Sec-Fetch-User | Was the request triggered by user action |
| `fetchSite` {Boolean} | Sec-Fetch-Site | Relationship to origin |
| `dpr`, `devicePixelRatio` | Content-DPR | Image device to pixel ratio | Experimental
| `deviceMemory` | Device-Memory |  Appr. available RAM | Experimental
| `devicePixelRatio`, `dpr` | DPR | Device pixel ratio | Deprecated
| `effectiveConnectionType`, `ect` | ECT | Network profile (G) | Experimental
| `downlink` | Downlink | Network speed (Mbps) | Experimental
| `viewport-width` | Viewport-Width | Layout viewport width | Deprecated
| `width` | Width | Resource desired width | Deprecated

## Client Hints Intruction Response Header
Set the value of `Accept-CH` header to include the headers you want the browse to send.
```
Accept-CH: Sec-CH-UA-Mobile,Sec-CH-UA-Full-Version,Sec-CH-UA-Full-Version-List,Sec-CH-UA-Model,Sec-CH-UA-Platform,Sec-CH-UA-Platform-Version,ECT
```
