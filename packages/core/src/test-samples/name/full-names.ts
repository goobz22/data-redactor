import { TestSample } from '../../types'

export const nameFullNames: TestSample = {
  id: 'name-full-names',
  name: 'Full Names',
  content: `Customer: John Doe
Agent: Jane Smith
Manager: Michael Johnson

Contact information:
Name: Sarah Williams
Account holder: Robert Brown`,
  expectedMatches: [
    {
      value: 'John Doe',
      shouldMatch: true,
      startIndex: 10,
      endIndex: 18,
      reason: 'Full name - first and last',
    },
    {
      value: 'Jane Smith',
      shouldMatch: true,
      startIndex: 27,
      endIndex: 37,
      reason: 'Agent full name',
    },
    {
      value: 'Michael Johnson',
      shouldMatch: true,
      startIndex: 48,
      endIndex: 63,
      reason: 'Manager full name',
    },
    {
      value: 'Sarah Williams',
      shouldMatch: true,
      startIndex: 92,
      endIndex: 106,
      reason: 'Customer full name',
    },
    {
      value: 'Robert Brown',
      shouldMatch: true,
      startIndex: 124,
      endIndex: 136,
      reason: 'Account holder name',
    },
  ],
  category: 'support-ticket',
}
