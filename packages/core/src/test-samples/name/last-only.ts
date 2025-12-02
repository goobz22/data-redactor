import { TestSample } from '../../types'

export const nameLastOnly: TestSample = {
  id: 'name-last-only',
  name: 'Last Names Only',
  content: `Mr. Smith will handle your case.
Contact Ms. Johnson for assistance.
Dr. Williams is available today.

Account managed by Anderson.
Report submitted by Davis.`,
  expectedMatches: [
    {
      value: 'Smith',
      shouldMatch: true,
      startIndex: 4,
      endIndex: 9,
      reason: 'Last name with title',
    },
    {
      value: 'Johnson',
      shouldMatch: true,
      startIndex: 44,
      endIndex: 51,
      reason: 'Last name with Ms.',
    },
    {
      value: 'Williams',
      shouldMatch: true,
      startIndex: 73,
      endIndex: 81,
      reason: 'Last name with Dr.',
    },
    {
      value: 'Anderson',
      shouldMatch: true,
      startIndex: 121,
      endIndex: 129,
      reason: 'Last name without title',
    },
    {
      value: 'Davis',
      shouldMatch: true,
      startIndex: 151,
      endIndex: 156,
      reason: 'Last name in context',
    },
  ],
  category: 'support-ticket',
}
