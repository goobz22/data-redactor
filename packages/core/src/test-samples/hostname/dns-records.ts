import { TestSample } from '../../types'

export const hostnameDNSRecords: TestSample = {
  id: 'hostname-dns-records',
  name: 'DNS Record Output',
  content: `DNS Query Results:
mail.example.com.      300 IN A     192.0.2.1
www.company.org.       3600 IN A    198.51.100.1
api.service.net.       1800 IN CNAME lb.service.net.

MX Records:
example.com.           3600 IN MX   10 mail.example.com.`,
  expectedMatches: [
    {
      value: 'mail.example.com',
      shouldMatch: true,
      startIndex: 19,
      endIndex: 35,
      reason: 'Mail server in DNS A record',
    },
    {
      value: '192.0.2.1',
      shouldMatch: true,
      startIndex: 52,
      endIndex: 61,
      reason: 'IP address in A record',
    },
    {
      value: 'www.company.org',
      shouldMatch: true,
      startIndex: 62,
      endIndex: 77,
      reason: 'Web server in DNS A record',
    },
    {
      value: '198.51.100.1',
      shouldMatch: true,
      startIndex: 96,
      endIndex: 108,
      reason: 'IP in A record',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 124,
      reason: 'API hostname in CNAME',
    },
    {
      value: 'lb.service.net',
      shouldMatch: true,
      startIndex: 141,
      endIndex: 155,
      reason: 'Load balancer CNAME target',
    },
    {
      value: 'example.com',
      shouldMatch: true,
      startIndex: 173,
      endIndex: 184,
      reason: 'Domain in MX record',
    },
    {
      value: 'mail.example.com',
      shouldMatch: true,
      startIndex: 206,
      endIndex: 222,
      reason: 'Mail server in MX record',
    },
  ],
  category: 'network',
}
