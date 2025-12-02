import { TestSample } from '../../types'

export const uuidLogFiles: TestSample = {
  id: 'uuid-log-files',
  name: 'UUIDs in Application Logs',
  content: `[2024-11-28 10:30:15] INFO User login: user_id=550e8400-e29b-41d4-a716-446655440000
[2024-11-28 10:30:16] DEBUG Session created: session_id=6ba7b810-9dad-11d1-80b4-00c04fd430c8
[2024-11-28 10:30:17] INFO Request received: request_id=7c9e6679-7425-40de-944b-e07fc1f90ae7
[2024-11-28 10:30:18] ERROR Transaction failed: tx_id=3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f`,
  expectedMatches: [
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 47,
      endIndex: 83,
      reason: 'User ID UUID in log',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 142,
      endIndex: 178,
      reason: 'Session ID UUID',
    },
    {
      value: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      shouldMatch: true,
      startIndex: 238,
      endIndex: 274,
      reason: 'Request ID UUID',
    },
    {
      value: '3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f',
      shouldMatch: true,
      startIndex: 334,
      endIndex: 370,
      reason: 'Transaction ID UUID',
    },
  ],
  category: 'logs',
}
