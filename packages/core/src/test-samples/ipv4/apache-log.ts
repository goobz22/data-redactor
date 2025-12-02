import { TestSample } from '../../types'

export const ipv4ApacheLog: TestSample = {
  id: 'ipv4-apache-log',
  name: 'Apache Access Log',
  content: `192.168.1.100 - - [28/Nov/2024:12:34:56 +0000] "GET /api/v1/users HTTP/1.1" 200 1234
10.0.0.45 - admin [28/Nov/2024:12:35:01 +0000] "POST /login HTTP/1.1" 302 0
172.16.254.1 - - [28/Nov/2024:12:35:12 +0000] "GET /static/app.js HTTP/1.1" 304 -
203.0.113.15 - user1 [28/Nov/2024:12:35:20 +0000] "GET /dashboard HTTP/1.1" 200 4567
198.51.100.88 - - [28/Nov/2024:12:35:45 +0000] "POST /api/v1/orders HTTP/1.1" 201 892`,
  expectedMatches: [
    {
      value: '192.168.1.100',
      shouldMatch: true,
      startIndex: 0,
      endIndex: 13,
      reason: 'Valid private IP (Class C)',
    },
    {
      value: '10.0.0.45',
      shouldMatch: true,
      startIndex: 91,
      endIndex: 100,
      reason: 'Valid private IP (Class A)',
    },
    {
      value: '172.16.254.1',
      shouldMatch: true,
      startIndex: 181,
      endIndex: 193,
      reason: 'Valid private IP (Class B)',
    },
    {
      value: '203.0.113.15',
      shouldMatch: true,
      startIndex: 281,
      endIndex: 293,
      reason: 'Valid public IP (TEST-NET-3)',
    },
    {
      value: '198.51.100.88',
      shouldMatch: true,
      startIndex: 380,
      endIndex: 393,
      reason: 'Valid public IP (TEST-NET-2)',
    },
  ],
  category: 'logs',
}
