import { TestSample } from '../../types'

export const macAddressDashFormat: TestSample = {
  id: 'mac-address-dash-format',
  name: 'MAC Address with Dashes',
  content: `Windows format:
Network adapter: 00-1B-44-11-3A-B8
WiFi card: A4-5E-60-E2-91-3F
Ethernet: 08-00-27-12-34-56

Physical Address: 00-11-22-33-44-55
Default gateway MAC: FF-FF-FF-FF-FF-FF`,
  expectedMatches: [
    {
      value: '00-1B-44-11-3A-B8',
      shouldMatch: true,
      startIndex: 34,
      endIndex: 51,
      reason: 'Windows-style MAC with dashes',
    },
    {
      value: 'A4-5E-60-E2-91-3F',
      shouldMatch: true,
      startIndex: 64,
      endIndex: 81,
      reason: 'MAC with uppercase and dashes',
    },
    {
      value: '08-00-27-12-34-56',
      shouldMatch: true,
      startIndex: 93,
      endIndex: 110,
      reason: 'VirtualBox MAC with dashes',
    },
    {
      value: '00-11-22-33-44-55',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 147,
      reason: 'Physical address format',
    },
    {
      value: 'FF-FF-FF-FF-FF-FF',
      shouldMatch: true,
      startIndex: 170,
      endIndex: 187,
      reason: 'Broadcast MAC with dashes',
    },
  ],
  category: 'network',
}
