import { TestSample } from '../../types'

export const ipv6Compressed: TestSample = {
  id: 'ipv6-compressed',
  name: 'Compressed IPv6 Addresses',
  content: `Localhost: ::1
Loopback: 0000:0000:0000:0000:0000:0000:0000:0001
Link-local: fe80::1
Unspecified: ::

Compressed: 2001:db8::1
Full form: 2001:0db8:0000:0000:0000:0000:0000:0001`,
  expectedMatches: [
    {
      value: '::1',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 14,
      reason: 'Localhost IPv6 compressed',
    },
    {
      value: '0000:0000:0000:0000:0000:0000:0000:0001',
      shouldMatch: true,
      startIndex: 26,
      endIndex: 65,
      reason: 'Localhost full form',
    },
    {
      value: 'fe80::1',
      shouldMatch: true,
      startIndex: 79,
      endIndex: 86,
      reason: 'Link-local compressed',
    },
    {
      value: '::',
      shouldMatch: true,
      startIndex: 101,
      endIndex: 103,
      reason: 'Unspecified address',
    },
    {
      value: '2001:db8::1',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 128,
      reason: 'Compressed IPv6',
    },
    {
      value: '2001:0db8:0000:0000:0000:0000:0000:0001',
      shouldMatch: true,
      startIndex: 141,
      endIndex: 180,
      reason: 'Expanded form',
    },
  ],
  category: 'network',
}
