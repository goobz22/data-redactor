import { TestSample } from '../../types'

export const ipv6FalsePositives: TestSample = {
  id: 'ipv6-false-positives',
  name: 'Hex Codes vs IPv6',
  content: `Color code: #2001db (not IPv6)
Hash: deadbeef1234567890abcdef12345678 (not IPv6)
MAC address: 2001:0db8:85a3:0000:0000 (incomplete IPv6)

Valid IPv6:
Address: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Compressed: fe80::1`,
  expectedMatches: [
    {
      value: '#2001db',
      shouldMatch: false,
      startIndex: 12,
      endIndex: 19,
      reason: 'Hex color code',
    },
    {
      value: 'deadbeef1234567890abcdef12345678',
      shouldMatch: false,
      startIndex: 37,
      endIndex: 69,
      reason: 'Long hex hash',
    },
    {
      value: '2001:0db8:85a3:0000:0000',
      shouldMatch: false,
      startIndex: 95,
      endIndex: 119,
      reason: 'Incomplete IPv6 (only 5 groups)',
    },
    {
      value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      shouldMatch: true,
      startIndex: 146,
      endIndex: 185,
      reason: 'Valid full IPv6',
    },
    {
      value: 'fe80::1',
      shouldMatch: true,
      startIndex: 199,
      endIndex: 206,
      reason: 'Valid compressed IPv6',
    },
  ],
  category: 'network',
}
