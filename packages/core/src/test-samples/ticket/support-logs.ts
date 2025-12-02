import { TestSample } from '../../types'

export const ticketSupportLogs: TestSample = {
  id: 'ticket-support-logs',
  name: 'Ticket Numbers in Support Logs',
  content: `[2024-11-28 10:30:15] Ticket #12345 created by customer
[2024-11-28 10:45:22] CASE-67890 assigned to agent Smith
[2024-11-28 11:00:10] PROJ-1111 updated with new comment
[2024-11-28 11:15:45] Ticket #99999 marked as resolved
[2024-11-28 11:30:00] WEBAPP-5555 moved to in-progress`,
  expectedMatches: [
    {
      value: 'Ticket #12345',
      shouldMatch: true,
      startIndex: 22,
      endIndex: 35,
      reason: 'Ticket created in log',
    },
    {
      value: 'CASE-67890',
      shouldMatch: true,
      startIndex: 76,
      endIndex: 86,
      reason: 'CASE assigned in log',
    },
    {
      value: 'PROJ-1111',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 136,
      reason: 'Project ticket updated',
    },
    {
      value: 'Ticket #99999',
      shouldMatch: true,
      startIndex: 177,
      endIndex: 190,
      reason: 'Ticket resolved in log',
    },
    {
      value: 'WEBAPP-5555',
      shouldMatch: true,
      startIndex: 230,
      endIndex: 241,
      reason: 'Webapp ticket status change',
    },
  ],
  category: 'logs',
}
