import { TestSample } from '../../types'

export const nameFirstOnly: TestSample = {
  id: 'name-first-only',
  name: 'First Names Only',
  content: `Hi John, thanks for contacting us.
Hello Sarah, we received your request.
Dear Michael, your order is ready.

Customer John called about billing.
Agent Jane will assist you.`,
  expectedMatches: [
    {
      value: 'John',
      shouldMatch: true,
      startIndex: 3,
      endIndex: 7,
      reason: 'First name in greeting',
    },
    {
      value: 'Sarah',
      shouldMatch: true,
      startIndex: 40,
      endIndex: 45,
      reason: 'First name in hello',
    },
    {
      value: 'Michael',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 81,
      reason: 'First name in letter',
    },
    {
      value: 'John',
      shouldMatch: true,
      startIndex: 113,
      endIndex: 117,
      reason: 'First name in context',
    },
    {
      value: 'Jane',
      shouldMatch: true,
      startIndex: 149,
      endIndex: 153,
      reason: 'Agent first name',
    },
  ],
  category: 'support-ticket',
}
