import { TestSample } from '../../types'

export const hostnameURLs: TestSample = {
  id: 'hostname-urls',
  name: 'Hostnames in URL Context',
  content: `Visit https://www.example.com for more info
API call to http://api.service.net/v1/users
Documentation: https://docs.company.org/guide

Internal: http://admin.internal.local:8080
Secure: https://secure.payment.company.co.uk/checkout`,
  expectedMatches: [
    {
      value: 'www.example.com',
      shouldMatch: true,
      startIndex: 14,
      endIndex: 29,
      reason: 'Hostname in HTTPS URL',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 61,
      endIndex: 76,
      reason: 'Hostname in API URL',
    },
    {
      value: 'docs.company.org',
      shouldMatch: true,
      startIndex: 109,
      endIndex: 125,
      reason: 'Documentation hostname',
    },
    {
      value: 'admin.internal.local',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 169,
      reason: 'Internal hostname with port',
    },
    {
      value: 'secure.payment.company.co.uk',
      shouldMatch: true,
      startIndex: 189,
      endIndex: 217,
      reason: 'Secure payment hostname',
    },
  ],
  category: 'logs',
}
