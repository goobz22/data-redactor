import { TestSample } from '../../types'

export const hostnameSubdomains: TestSample = {
  id: 'hostname-subdomains',
  name: 'Multi-level Subdomains',
  content: `API staging: api.staging.internal.company.net
Production DB: db.prod.us-east-1.cloud.example.com
Dev environment: app.dev.local.test.org

Microservice: user-service.v2.api.company.io
CDN: static.cdn.global.example.com`,
  expectedMatches: [
    {
      value: 'api.staging.internal.company.net',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 46,
      reason: 'Multi-level staging hostname',
    },
    {
      value: 'db.prod.us-east-1.cloud.example.com',
      shouldMatch: true,
      startIndex: 63,
      endIndex: 99,
      reason: 'Cloud database with region',
    },
    {
      value: 'app.dev.local.test.org',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 139,
      reason: 'Development environment',
    },
    {
      value: 'user-service.v2.api.company.io',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 186,
      reason: 'Versioned microservice hostname',
    },
    {
      value: 'static.cdn.global.example.com',
      shouldMatch: true,
      startIndex: 192,
      endIndex: 221,
      reason: 'CDN hostname',
    },
  ],
  category: 'network',
}
