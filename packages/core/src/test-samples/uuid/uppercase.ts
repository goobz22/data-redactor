import { TestSample } from '../../types'

export const uuidUppercase: TestSample = {
  id: 'uuid-uppercase',
  name: 'Uppercase UUID Variants',
  content: `ID: 550E8400-E29B-41D4-A716-446655440000
Ref: 6BA7B810-9DAD-11D1-80B4-00C04FD430C8
Mixed case: 7c9E6679-7425-40DE-944b-e07FC1f90ae7

Lowercase for comparison:
ID: 550e8400-e29b-41d4-a716-446655440000`,
  expectedMatches: [
    {
      value: '550E8400-E29B-41D4-A716-446655440000',
      shouldMatch: true,
      startIndex: 4,
      endIndex: 40,
      reason: 'Uppercase UUID',
    },
    {
      value: '6BA7B810-9DAD-11D1-80B4-00C04FD430C8',
      shouldMatch: true,
      startIndex: 46,
      endIndex: 82,
      reason: 'All uppercase UUID',
    },
    {
      value: '7c9E6679-7425-40DE-944b-e07FC1f90ae7',
      shouldMatch: true,
      startIndex: 95,
      endIndex: 131,
      reason: 'Mixed case UUID',
    },
    {
      value: '550e8400-e29b-41d4-a716-446655440000',
      shouldMatch: true,
      startIndex: 161,
      endIndex: 197,
      reason: 'Lowercase UUID',
    },
  ],
  category: 'logs',
}
