import { TestSample } from '../../types'

export const macAddressLowercase: TestSample = {
  id: 'mac-address-lowercase',
  name: 'Lowercase MAC Addresses',
  content: `Linux output:
eth0: 00:1b:44:11:3a:b8
wlan0: a4:5e:60:e2:91:3f
docker0: 08:00:27:12:34:56

Mixed case for comparison:
Interface: 00:1B:44:11:3A:B8
Device: A4:5e:60:E2:91:3f`,
  expectedMatches: [
    {
      value: '00:1b:44:11:3a:b8',
      shouldMatch: true,
      startIndex: 21,
      endIndex: 38,
      reason: 'Lowercase MAC address',
    },
    {
      value: 'a4:5e:60:e2:91:3f',
      shouldMatch: true,
      startIndex: 47,
      endIndex: 64,
      reason: 'All lowercase letters',
    },
    {
      value: '08:00:27:12:34:56',
      shouldMatch: true,
      startIndex: 76,
      endIndex: 93,
      reason: 'Numeric and lowercase',
    },
    {
      value: '00:1B:44:11:3A:B8',
      shouldMatch: true,
      startIndex: 130,
      endIndex: 147,
      reason: 'Uppercase MAC for comparison',
    },
    {
      value: 'A4:5e:60:E2:91:3f',
      shouldMatch: true,
      startIndex: 157,
      endIndex: 174,
      reason: 'Mixed case MAC',
    },
  ],
  category: 'network',
}
