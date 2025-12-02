import { TestSample } from '../../types'

export const ticketCaseFormat: TestSample = {
  id: 'ticket-case-format',
  name: 'CASE Ticket Numbers',
  content: `Support ticket: CASE-123456
Follow-up on CASE-789012
Related to case CASE-345678

Customer inquiry: CASE-901234
Resolved: CASE-567890`,
  expectedMatches: [
    {
      value: 'CASE-123456',
      shouldMatch: true,
      startIndex: 16,
      endIndex: 27,
      reason: 'Support ticket in CASE format',
    },
    {
      value: 'CASE-789012',
      shouldMatch: true,
      startIndex: 40,
      endIndex: 51,
      reason: 'Follow-up ticket',
    },
    {
      value: 'CASE-345678',
      shouldMatch: true,
      startIndex: 68,
      endIndex: 79,
      reason: 'Related ticket',
    },
    {
      value: 'CASE-901234',
      shouldMatch: true,
      startIndex: 100,
      endIndex: 111,
      reason: 'Customer inquiry ticket',
    },
    {
      value: 'CASE-567890',
      shouldMatch: true,
      startIndex: 123,
      endIndex: 134,
      reason: 'Resolved ticket',
    },
  ],
  category: 'support-ticket',
}
