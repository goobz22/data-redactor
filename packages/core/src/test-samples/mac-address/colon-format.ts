import { TestSample } from '../../types'

export const macAddressColonFormat: TestSample = {
  id: 'mac-address-colon-format',
  name: 'MAC Address with Colons',
  content: `Network Interface:
eth0: 00:1B:44:11:3A:B8
wlan0: A4:5E:60:E2:91:3F
eth1: 08:00:27:12:34:56

Router MAC: 00:11:22:33:44:55
Device: FF:FF:FF:FF:FF:FF (broadcast)`,
  expectedMatches: [
    {
      value: '00:1B:44:11:3A:B8',
      shouldMatch: true,
      startIndex: 27,
      endIndex: 44,
      reason: 'Standard MAC with colons',
    },
    {
      value: 'A4:5E:60:E2:91:3F',
      shouldMatch: true,
      startIndex: 53,
      endIndex: 70,
      reason: 'MAC with uppercase letters',
    },
    {
      value: '08:00:27:12:34:56',
      shouldMatch: true,
      startIndex: 79,
      endIndex: 96,
      reason: 'VirtualBox MAC prefix',
    },
    {
      value: '00:11:22:33:44:55',
      shouldMatch: true,
      startIndex: 110,
      endIndex: 127,
      reason: 'Sequential MAC',
    },
    {
      value: 'FF:FF:FF:FF:FF:FF',
      shouldMatch: true,
      startIndex: 137,
      endIndex: 154,
      reason: 'Broadcast MAC address',
    },
  ],
  category: 'network',
}
