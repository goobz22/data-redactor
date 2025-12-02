import { TestSample } from '../../types'

export const ticketHashFormat: TestSample = {
  id: 'ticket-ticket-hash',
  name: 'Ticket # Format',
  content: `Please reference Ticket #12345
Following up on Ticket #67890
Support Ticket #11111 has been resolved

Issue number: Ticket #99999
See Ticket #54321 for details`,
  expectedMatches: [
    {
      value: 'Ticket #12345',
      shouldMatch: true,
      startIndex: 19,
      endIndex: 32,
      reason: 'Ticket with hash number',
    },
    {
      value: 'Ticket #67890',
      shouldMatch: true,
      startIndex: 49,
      endIndex: 62,
      reason: 'Follow-up ticket with hash',
    },
    {
      value: 'Ticket #11111',
      shouldMatch: true,
      startIndex: 71,
      endIndex: 84,
      reason: 'Resolved ticket with hash',
    },
    {
      value: 'Ticket #99999',
      shouldMatch: true,
      startIndex: 117,
      endIndex: 130,
      reason: 'Issue ticket with hash',
    },
    {
      value: 'Ticket #54321',
      shouldMatch: true,
      startIndex: 136,
      endIndex: 149,
      reason: 'Reference ticket with hash',
    },
  ],
  category: 'support-ticket',
}
