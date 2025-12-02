import { TestSample } from '../../types'

export const nameSupportTickets: TestSample = {
  id: 'name-support-tickets',
  name: 'Names in Support Tickets',
  content: `Ticket #12345
Customer: John Doe
Email: john.doe@example.com
Issue: Billing question

Ticket #67890
Customer: Jane Smith
Phone: (555) 123-4567
Issue: Technical support request`,
  expectedMatches: [
    {
      value: 'Ticket #12345',
      shouldMatch: true,
      startIndex: 0,
      endIndex: 13,
      reason: 'Ticket number',
    },
    {
      value: 'John Doe',
      shouldMatch: true,
      startIndex: 25,
      endIndex: 33,
      reason: 'Customer name',
    },
    {
      value: 'john.doe@example.com',
      shouldMatch: true,
      startIndex: 42,
      endIndex: 62,
      reason: 'Customer email',
    },
    {
      value: 'Ticket #67890',
      shouldMatch: true,
      startIndex: 83,
      endIndex: 96,
      reason: 'Ticket number',
    },
    {
      value: 'Jane Smith',
      shouldMatch: true,
      startIndex: 108,
      endIndex: 118,
      reason: 'Customer name',
    },
    {
      value: '(555) 123-4567',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 141,
      reason: 'Customer phone',
    },
  ],
  category: 'support-ticket',
}
