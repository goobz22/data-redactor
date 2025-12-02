import { TestSample } from '../../types'

export const ipv6NetworkConfig: TestSample = {
  id: 'ipv6-network-config',
  name: 'IPv6 in Network Configuration',
  content: `# IPv6 Configuration
interface eth0
  inet6 add 2001:0db8:85a3::8a2e:0370:7334/64
  gateway fe80::1

# DNS Servers
nameserver 2606:4700:4700::1111
nameserver 2606:4700:4700::1001`,
  expectedMatches: [
    {
      value: '2001:0db8:85a3::8a2e:0370:7334',
      shouldMatch: true,
      startIndex: 59,
      endIndex: 88,
      reason: 'IPv6 address in config',
    },
    {
      value: 'fe80::1',
      shouldMatch: true,
      startIndex: 103,
      endIndex: 110,
      reason: 'Gateway IPv6',
    },
    {
      value: '2606:4700:4700::1111',
      shouldMatch: true,
      startIndex: 139,
      endIndex: 159,
      reason: 'DNS server IPv6',
    },
    {
      value: '2606:4700:4700::1001',
      shouldMatch: true,
      startIndex: 172,
      endIndex: 192,
      reason: 'Secondary DNS IPv6',
    },
  ],
  category: 'config',
}
