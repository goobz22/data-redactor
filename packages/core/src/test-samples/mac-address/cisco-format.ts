import { TestSample } from '../../types'

export const macAddressCiscoFormat: TestSample = {
  id: 'mac-address-cisco-format',
  name: 'Cisco MAC Address Format',
  content: `Cisco device output:
MAC Address: 001B.4411.3AB8
Switch port: A45E.60E2.913F
Router: 0800.2712.3456

Interface GigabitEthernet0/1: 0011.2233.4455
VLAN 10: FFFF.FFFF.FFFF`,
  expectedMatches: [
    {
      value: '001B.4411.3AB8',
      shouldMatch: true,
      startIndex: 34,
      endIndex: 48,
      reason: 'Cisco format with dots (4-4-4)',
    },
    {
      value: 'A45E.60E2.913F',
      shouldMatch: true,
      startIndex: 62,
      endIndex: 76,
      reason: 'Cisco format uppercase',
    },
    {
      value: '0800.2712.3456',
      shouldMatch: true,
      startIndex: 86,
      endIndex: 100,
      reason: 'Router MAC in Cisco format',
    },
    {
      value: '0011.2233.4455',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 147,
      reason: 'Interface MAC',
    },
    {
      value: 'FFFF.FFFF.FFFF',
      shouldMatch: true,
      startIndex: 157,
      endIndex: 171,
      reason: 'Broadcast in Cisco format',
    },
  ],
  category: 'network',
}
