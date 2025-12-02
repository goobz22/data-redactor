import { TestSample } from '../../types'

export const uuidAPIResponses: TestSample = {
  id: 'uuid-api-responses',
  name: 'UUIDs in API Responses',
  content: `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "session_token": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "created_at": "2024-11-28T10:30:15Z"
}`,
  expectedMatches: [
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 11,
      endIndex: 47,
      reason: 'ID field UUID',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 64,
      endIndex: 100,
      reason: 'User ID UUID in JSON',
    },
    {
      value: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      shouldMatch: true,
      startIndex: 122,
      endIndex: 158,
      reason: 'Session token UUID',
    },
  ],
  category: 'logs',
}
