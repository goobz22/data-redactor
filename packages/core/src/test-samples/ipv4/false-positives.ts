import { TestSample } from '../../types'

export const ipv4FalsePositives: TestSample = {
  id: 'ipv4-false-positives',
  name: 'Version Numbers (False Positives)',
  content: `Application version: 1.2.3.4
Docker image: myapp:2.5.10.3
Node.js version: 18.0.0.0
Invalid IP: 999.999.999.999
Edge case: 255.255.255.256
Also invalid: 300.168.1.1

Valid IPs that should match:
Server IP: 10.0.0.5
Load balancer: 172.31.45.67`,
  expectedMatches: [
    {
      value: '1.2.3.4',
      shouldMatch: false,
      startIndex: 22,
      endIndex: 29,
      reason: 'Application version, not an IP',
    },
    {
      value: '2.5.10.3',
      shouldMatch: false,
      startIndex: 48,
      endIndex: 56,
      reason: 'Docker image version tag',
    },
    {
      value: '18.0.0.0',
      shouldMatch: false,
      startIndex: 75,
      endIndex: 83,
      reason: 'Node.js version number',
    },
    {
      value: '999.999.999.999',
      shouldMatch: false,
      startIndex: 97,
      endIndex: 112,
      reason: 'Invalid IP - octets > 255',
    },
    {
      value: '255.255.255.256',
      shouldMatch: false,
      startIndex: 125,
      endIndex: 140,
      reason: 'Invalid IP - last octet > 255',
    },
    {
      value: '300.168.1.1',
      shouldMatch: false,
      startIndex: 156,
      endIndex: 167,
      reason: 'Invalid IP - first octet > 255',
    },
    {
      value: '10.0.0.5',
      shouldMatch: true,
      startIndex: 206,
      endIndex: 214,
      reason: 'Valid private IP',
    },
    {
      value: '172.31.45.67',
      shouldMatch: true,
      startIndex: 232,
      endIndex: 244,
      reason: 'Valid private IP',
    },
  ],
  category: 'code',
}
