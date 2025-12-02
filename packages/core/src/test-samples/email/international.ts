import { TestSample } from '../../types'

export const emailInternational: TestSample = {
  id: 'email-international',
  name: 'International Email Formats',
  content: `UK contact: support@company.co.uk
Australian: info@business.com.au
German office: kontakt@firma.de
French branch: contact@entreprise.fr
Canadian: service@organization.ca
Indian office: help@company.co.in

Multi-level domain: admin@subdomain.company.co.uk`,
  expectedMatches: [
    {
      value: 'support@company.co.uk',
      shouldMatch: true,
      startIndex: 12,
      endIndex: 34,
      reason: 'UK domain with .co.uk',
    },
    {
      value: 'info@business.com.au',
      shouldMatch: true,
      startIndex: 48,
      endIndex: 68,
      reason: 'Australian domain with .com.au',
    },
    {
      value: 'kontakt@firma.de',
      shouldMatch: true,
      startIndex: 84,
      endIndex: 100,
      reason: 'German domain with .de',
    },
    {
      value: 'contact@entreprise.fr',
      shouldMatch: true,
      startIndex: 116,
      endIndex: 137,
      reason: 'French domain with .fr',
    },
    {
      value: 'service@organization.ca',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 172,
      reason: 'Canadian domain with .ca',
    },
    {
      value: 'help@company.co.in',
      shouldMatch: true,
      startIndex: 188,
      endIndex: 206,
      reason: 'Indian domain with .co.in',
    },
    {
      value: 'admin@subdomain.company.co.uk',
      shouldMatch: true,
      startIndex: 230,
      endIndex: 260,
      reason: 'Multi-level UK domain',
    },
  ],
  category: 'support-ticket',
}
