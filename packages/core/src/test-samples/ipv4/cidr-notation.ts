import { TestSample } from '../../types'

export const ipv4CidrNotation: TestSample = {
  id: 'ipv4-cidr-notation',
  name: 'Network Configuration with CIDR',
  content: `# Network Configuration
subnet = 10.0.0.0/24
gateway = 10.0.0.1
dns_primary = 8.8.8.8
dns_secondary = 8.8.4.4

# VPN Settings
vpn_network = 192.168.100.0/24
vpn_gateway = 192.168.100.1

# Docker Networks
bridge_network = 172.17.0.0/16
container_ip = 172.17.0.2`,
  expectedMatches: [
    {
      value: '10.0.0.0',
      shouldMatch: true,
      startIndex: 33,
      endIndex: 41,
      reason: 'Network address in CIDR notation',
    },
    {
      value: '10.0.0.1',
      shouldMatch: true,
      startIndex: 55,
      endIndex: 63,
      reason: 'Gateway IP',
    },
    {
      value: '8.8.8.8',
      shouldMatch: true,
      startIndex: 81,
      endIndex: 88,
      reason: 'DNS server IP',
    },
    {
      value: '8.8.4.4',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 116,
      reason: 'DNS server IP',
    },
    {
      value: '192.168.100.0',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 162,
      reason: 'VPN network address',
    },
    {
      value: '192.168.100.1',
      shouldMatch: true,
      startIndex: 180,
      endIndex: 193,
      reason: 'VPN gateway',
    },
    {
      value: '172.17.0.0',
      shouldMatch: true,
      startIndex: 232,
      endIndex: 242,
      reason: 'Docker bridge network',
    },
    {
      value: '172.17.0.2',
      shouldMatch: true,
      startIndex: 263,
      endIndex: 273,
      reason: 'Container IP',
    },
  ],
  category: 'config',
}
