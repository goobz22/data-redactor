import { TestSample } from '../../types'

export const ipv6Mixed: TestSample = {
  id: 'ipv6-mixed',
  name: 'IPv4-Mapped IPv6 Addresses',
  content: `IPv4-mapped: ::ffff:192.0.2.1
Alternative: 0000:0000:0000:0000:0000:ffff:192.0.2.128
Hybrid: ::ffff:c000:0201

Pure IPv6: 2001:db8::1
Pure IPv4: 192.168.1.1`,
  expectedMatches: [
    {
      value: '::ffff:192.0.2.1',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 29,
      reason: 'IPv4-mapped IPv6',
    },
    {
      value: '192.0.2.1',
      shouldMatch: true,
      startIndex: 20,
      endIndex: 29,
      reason: 'IPv4 part of mapped address',
    },
    {
      value: '0000:0000:0000:0000:0000:ffff:192.0.2.128',
      shouldMatch: true,
      startIndex: 44,
      endIndex: 85,
      reason: 'Full form IPv4-mapped',
    },
    {
      value: '192.0.2.128',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 85,
      reason: 'IPv4 in full form',
    },
    {
      value: '::ffff:c000:0201',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 111,
      reason: 'IPv4-mapped in hex',
    },
    {
      value: '2001:db8::1',
      shouldMatch: true,
      startIndex: 125,
      endIndex: 136,
      reason: 'Pure IPv6',
    },
    {
      value: '192.168.1.1',
      shouldMatch: true,
      startIndex: 150,
      endIndex: 161,
      reason: 'Pure IPv4',
    },
  ],
  category: 'network',
}
