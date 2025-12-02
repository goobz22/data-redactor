import { TestSample } from '../../types'

export const uuidFalsePositives: TestSample = {
  id: 'uuid-false-positives',
  name: 'Similar Patterns vs UUIDs',
  content: `Not UUID: 12345678-1234-1234-1234-123456789012 (too short segments)
Not UUID: gggggggg-hhhh-iiii-jjjj-kkkkkkkkkkkk (invalid hex)
Invalid: 550e8400-e29b-41d4-a716 (incomplete)

Valid UUIDs:
ID: 550e8400-e29b-41d4-a716-446655440000
Ref: 6ba7b810-9dad-11d1-80b4-00c04fd430c8`,
  expectedMatches: [
    {
      value: '12345678-1234-1234-1234-123456789012',
      shouldMatch: false,
      startIndex: 10,
      endIndex: 46,
      reason: 'Wrong format - all digits',
    },
    {
      value: 'gggggggg-hhhh-iiii-jjjj-kkkkkkkkkkkk',
      shouldMatch: false,
      startIndex: 78,
      endIndex: 114,
      reason: 'Invalid hex characters',
    },
    {
      value: '550e8400-e29b-41d4-a716',
      shouldMatch: false,
      startIndex: 151,
      endIndex: 175,
      reason: 'Incomplete UUID',
    },
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 198,
      endIndex: 234,
      reason: 'Valid UUID',
    },
    {
      value: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      shouldMatch: true,
      startIndex: 241,
      endIndex: 277,
      reason: 'Valid UUID',
    },
  ],
  category: 'logs',
}
