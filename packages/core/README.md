# data-redactor-core

A powerful, client-side data redaction engine for securing sensitive information before sending to AI systems or external services.

## 🚀 Live Demo

Try it out: **[https://data-redactor-ui.vercel.app/](https://data-redactor-ui.vercel.app/)**

## Installation

```bash
npm install data-redactor-core
```

Or with bun:
```bash
bun add data-redactor-core
```

## Features

- **100% Client-Side** - All processing happens in your browser. No data sent to servers.
- **Multiple Redaction Strategies**:
  - **Token** - Replace with customizable tokens like `[EMAIL_1]`, `[IP_1]`
  - **Mask** - Replace with asterisks while preserving structure `***@***.com`
  - **Format-Preserving** - Replace with realistic fake data (maintains data type format)
- **Comprehensive Pattern Detection**:
  - **IPv4 Addresses** - Detects standard and CIDR notation (`192.168.1.1`, `10.0.0.0/24`)
  - **IPv6 Addresses** - Full support including compression (`::1`, `2001:0db8:85a3::8a2e:0370:7334`)
  - **MAC Addresses** - All formats (`:`, `-`, `.` separators)
  - **Email Addresses** - Standard email detection
  - **Phone Numbers** - Multiple formats including vanity numbers
  - **Social Security Numbers** - `###-##-####` format
  - **Credit Cards** - 13-19 digit cards with Luhn validation
  - **Credit Card Last 4** - Patterns like "ending in 1234" or "****1234"
  - **Hostnames & Domains** - FQDN detection
  - **Ticket Numbers** - Case/ticket ID patterns
  - **Names** - 8849+ name database (first and last names)
  - **Custom Patterns** - Define your own regex patterns
  - **Custom Entities** - Whitelist specific values to redact (company names, project names, etc.)

## Quick Start

```typescript
import { DataRedactor } from 'data-redactor-core';

const redactor = new DataRedactor();

const text = "Contact john.doe@email.com at 555-123-4567";
const result = redactor.redact(text);

console.log(result.redactedText);
// "Contact [EMAIL_1] at [PHONE_1]"

console.log(result.mapping);
// { "john.doe@email.com": "[EMAIL_1]", "555-123-4567": "[PHONE_1]" }
```

## Usage Examples

### Custom Configuration

```typescript
import { DataRedactor } from 'data-redactor-core';

const config = {
  patterns: {
    email: { enabled: true, strategy: 'mask' },
    phone: { enabled: true, strategy: 'token' },
    ipv4: { enabled: false }
  },
  formatOptions: {
    tokenFormat: '[{TYPE}_{INDEX}]',
    maskChar: '*',
    preserveStructure: true
  }
};

const redactor = new DataRedactor(config);
```

### Custom Patterns

```typescript
const config = {
  patterns: {
    custom: [
      {
        name: 'caseId',
        regex: 'CASE-\\d{6}',
        strategy: 'token',
        flags: 'gi'
      }
    ]
  }
};

const redactor = new DataRedactor(config);
const text = "Please reference CASE-123456 in your response";
const result = redactor.redact(text);
// "Please reference [CASEID_1] in your response"
```

### Custom Entities

Redact specific values like company names, project names, or customer names:

```typescript
const config = {
  customEntities: {
    companyNames: ["Acme Corp", "Globex Corporation"],
    projectNames: ["Project Phoenix", "Operation Sunrise"],
    customerNames: ["John Smith", "Jane Doe"]
  }
};

const redactor = new DataRedactor(config);
const text = "Acme Corp is working on Project Phoenix with John Smith";
const result = redactor.redact(text);
// "[COMPANYNAMES_1] is working on [PROJECTNAMES_1] with [CUSTOMERNAMES_1]"
```

### Customizing Token Format

```typescript
const config = {
  formatOptions: {
    tokenFormat: '<{TYPE}:{INDEX}>',  // Default: '[{TYPE}_{INDEX}]'
    maskChar: '#',                      // Default: '*'
    preserveStructure: true             // Default: true
  },
  patterns: {
    email: { enabled: true, strategy: 'token' },
    phone: { enabled: true, strategy: 'mask' }
  }
};

const redactor = new DataRedactor(config);
const text = "Email: test@example.com Phone: 555-1234";
const result = redactor.redact(text);
// "Email: <EMAIL:1> Phone: ###-####"
```

### Loading Configuration from File (Node.js)

```typescript
import { DataRedactor, ConfigLoader } from 'data-redactor-core';

// Load from JSON file
const config = ConfigLoader.loadFromFile('./my-config.json');
const redactor = new DataRedactor(config);

// Or get default config
const defaultConfig = ConfigLoader.getDefault();

// Validate config
const validation = ConfigLoader.validateConfig(config);
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
}
```

## Repository

For full documentation, examples, and source code, visit: [https://github.com/goobz22/data-redactor](https://github.com/goobz22/data-redactor)

## License

MIT

## Author

**Matthew Goluba**
- Email: mkgoluba@outlook.com
- GitHub: [@goobz22](https://github.com/goobz22)

---

Demonstrating that AI can be used securely with proper data protection!
