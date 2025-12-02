import { TestSample } from '../../types'

export const ipv6Standard: TestSample = {
  id: 'ipv6-standard',
  name: 'Standard IPv6 Addresses',
  content: `Server: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
Client: 2001:0db8:0001:0000:0000:0ab9:C0A8:0102
Gateway: fe80:0000:0000:0000:0202:b3ff:fe1e:8329

DNS: 2606:4700:4700:0000:0000:0000:0000:1111
CDN: 2400:cb00:2048:0001:0000:0000:6ca2:c344`,
  expectedMatches: [
    {
      value: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
      shouldMatch: true,
      startIndex: 8,
      endIndex: 47,
      reason: 'Full IPv6 address',
    },
    {
      value: '2001:0db8:0001:0000:0000:0ab9:C0A8:0102',
      shouldMatch: true,
      startIndex: 56,
      endIndex: 95,
      reason: 'IPv6 with uppercase hex',
    },
    {
      value: 'fe80:0000:0000:0000:0202:b3ff:fe1e:8329',
      shouldMatch: true,
      startIndex: 105,
      endIndex: 144,
      reason: 'Link-local IPv6 address',
    },
    {
      value: '2606:4700:4700:0000:0000:0000:0000:1111',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 190,
      reason: 'Cloudflare DNS IPv6',
    },
    {
      value: '2400:cb00:2048:0001:0000:0000:6ca2:c344',
      shouldMatch: true,
      startIndex: 197,
      endIndex: 236,
      reason: 'CDN IPv6 address',
    },
  ],
  category: 'network',
}
