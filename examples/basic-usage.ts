import { DataRedactor } from '@data-redactor/core';

// Example 1: Basic usage with default configuration
const redactor = new DataRedactor();

const text = `
Support ticket from john.doe@example.com
Customer's IP: 192.168.1.100
MAC Address: 00:1B:44:11:3A:B7
Phone: 555-123-4567
`;

const result = redactor.redact(text);
console.log('Redacted Text:', result.redactedText);
console.log('Mapping:', result.mapping);

// Example 2: Custom configuration
const customRedactor = new DataRedactor({
  patterns: {
    ipAddress: { enabled: true, strategy: 'formatPreserving' },
    email: { enabled: true, strategy: 'token' },
    phone: { enabled: false, strategy: 'mask' },
  },
});

const result2 = customRedactor.redact(text);
console.log('\nCustom Config Result:', result2.redactedText);

// Example 3: Loading from file
// const fileRedactor = new DataRedactor('./config-examples/basic.json');
// const result3 = fileRedactor.redact(text);
// console.log('\nFile Config Result:', result3.redactedText);

// Example 4: Custom entities
const entityRedactor = new DataRedactor({
  customEntities: {
    companyNames: ['Acme Corp', 'Contoso'],
  },
  patterns: {
    ipAddress: { enabled: true, strategy: 'token' },
  },
});

const textWithCompany = 'Acme Corp reported an issue from 10.0.0.1';
const result4 = entityRedactor.redact(textWithCompany);
console.log('\nEntity Redaction:', result4.redactedText);
console.log('Mapping:', result4.mapping);
