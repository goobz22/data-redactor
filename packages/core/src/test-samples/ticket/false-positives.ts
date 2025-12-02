import { TestSample } from '../../types'

export const ticketFalsePositives: TestSample = {
  id: 'ticket-false-positives',
  name: 'Random Text vs Ticket Numbers',
  content: `Product code: SKU-12345 (not a ticket)
Tracking number: TRK-67890 (not a ticket)
Random text: ABC-XYZ-999 (not a ticket)

Valid tickets:
Issue: CASE-123456
Bug: PROJ-7890`,
  expectedMatches: [
    {
      value: 'SKU-12345',
      shouldMatch: false,
      startIndex: 14,
      endIndex: 23,
      reason: 'Product SKU, not a ticket',
    },
    {
      value: 'TRK-67890',
      shouldMatch: false,
      startIndex: 57,
      endIndex: 66,
      reason: 'Tracking number, not a ticket',
    },
    {
      value: 'ABC-XYZ-999',
      shouldMatch: false,
      startIndex: 95,
      endIndex: 106,
      reason: 'Random text pattern',
    },
    {
      value: 'CASE-123456',
      shouldMatch: true,
      startIndex: 142,
      endIndex: 153,
      reason: 'Valid CASE ticket',
    },
    {
      value: 'PROJ-7890',
      shouldMatch: true,
      startIndex: 160,
      endIndex: 169,
      reason: 'Valid PROJ ticket',
    },
  ],
  category: 'logs',
}
