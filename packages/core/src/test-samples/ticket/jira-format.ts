import { TestSample } from '../../types'

export const ticketJiraFormat: TestSample = {
  id: 'ticket-jira-format',
  name: 'JIRA Ticket Format',
  content: `Working on PROJ-1234 today
Bug fix in WEBAPP-5678
Feature request: API-9012

Dependencies: CORE-3456, AUTH-7890
Blocked by INFRA-1111`,
  expectedMatches: [
    {
      value: 'PROJ-1234',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 20,
      reason: 'JIRA project ticket',
    },
    {
      value: 'WEBAPP-5678',
      shouldMatch: true,
      startIndex: 39,
      endIndex: 50,
      reason: 'Web app JIRA ticket',
    },
    {
      value: 'API-9012',
      shouldMatch: true,
      startIndex: 70,
      endIndex: 78,
      reason: 'API feature JIRA ticket',
    },
    {
      value: 'CORE-3456',
      shouldMatch: true,
      startIndex: 94,
      endIndex: 103,
      reason: 'Core dependency ticket',
    },
    {
      value: 'AUTH-7890',
      shouldMatch: true,
      startIndex: 105,
      endIndex: 114,
      reason: 'Auth dependency ticket',
    },
    {
      value: 'INFRA-1111',
      shouldMatch: true,
      startIndex: 127,
      endIndex: 137,
      reason: 'Infrastructure blocker',
    },
  ],
  category: 'support-ticket',
}
