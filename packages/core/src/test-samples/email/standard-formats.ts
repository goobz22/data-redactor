import { TestSample } from '../../types'

export const emailStandardFormats: TestSample = {
  id: 'email-standard-formats',
  name: 'Standard Email Formats',
  content: `From: john.doe@example.com
To: jane_smith@company.co.uk
CC: support@helpdesk.io, admin@system.net

Customer email: customer123@shop-online.com
Reply to: noreply@notifications.service.gov

Technical contact: tech.support@sub.domain.example.org`,
  expectedMatches: [
    {
      value: 'john.doe@example.com',
      shouldMatch: true,
      startIndex: 6,
      endIndex: 27,
      reason: 'Standard email with dot in local part',
    },
    {
      value: 'jane_smith@company.co.uk',
      shouldMatch: true,
      startIndex: 32,
      endIndex: 57,
      reason: 'Email with underscore and .co.uk TLD',
    },
    {
      value: 'support@helpdesk.io',
      shouldMatch: true,
      startIndex: 62,
      endIndex: 82,
      reason: 'Simple email with .io TLD',
    },
    {
      value: 'admin@system.net',
      shouldMatch: true,
      startIndex: 84,
      endIndex: 100,
      reason: 'Simple email with .net TLD',
    },
    {
      value: 'customer123@shop-online.com',
      shouldMatch: true,
      startIndex: 118,
      endIndex: 145,
      reason: 'Email with numbers and hyphen in domain',
    },
    {
      value: 'noreply@notifications.service.gov',
      shouldMatch: true,
      startIndex: 157,
      endIndex: 191,
      reason: 'Email with .gov TLD and subdomain',
    },
    {
      value: 'tech.support@sub.domain.example.org',
      shouldMatch: true,
      startIndex: 213,
      endIndex: 249,
      reason: 'Email with dots in local part and multiple subdomains',
    },
  ],
  category: 'support-ticket',
}
