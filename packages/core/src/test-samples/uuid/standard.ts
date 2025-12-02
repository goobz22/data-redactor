import { TestSample } from '../../types'

export const uuidStandard: TestSample = {
  id: 'uuid-standard',
  name: 'Standard UUID Format',
  content: `User ID: 550e8400-e29b-41d4-a716-446655440000
Session: 6ba7b810-9dad-11d1-80b4-00c04fd430c8
Request ID: 7c9e6679-7425-40de-944b-e07fc1f90ae7

Transaction: 3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f
Entity: 8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d`,
  expectedMatches: [
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 9,
      endIndex: 45,
      reason: 'Standard UUID v4',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 55,
      endIndex: 91,
      reason: 'UUID v1 format',
    },
    {
      value: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      shouldMatch: true,
      startIndex: 104,
      endIndex: 140,
      reason: 'Request tracking UUID',
    },
    {
      value: '3f4e5d6c-7b8a-9c0d-1e2f-3a4b5c6d7e8f',
      shouldMatch: true,
      startIndex: 155,
      endIndex: 191,
      reason: 'Transaction UUID',
    },
    {
      value: '8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d',
      shouldMatch: true,
      startIndex: 201,
      endIndex: 237,
      reason: 'Entity UUID',
    },
  ],
  category: 'logs',
}
