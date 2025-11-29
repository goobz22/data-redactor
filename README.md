# Data Redactor

A powerful, client-side data redaction tool for securing sensitive information before sending to AI systems or external services. Proving that AI can be used securely with proper input sanitization.

## Live Demo

**[https://data-redactor-ui.vercel.app/](https://data-redactor-ui.vercel.app/)**

## Overview

Data Redactor is a monorepo containing two packages:

| Package | Description | Published |
|---------|-------------|-----------|
| `data-redactor-core` | Core redaction engine | [npm](https://www.npmjs.com/package/data-redactor-core) v1.0.4 |
| `@data-redactor/ui` | Next.js web interface | [Vercel](https://data-redactor-ui.vercel.app/) |

All redaction happens **100% client-side** - no data is ever sent to a server.

## Features

### Redaction Strategies

| Strategy | Description | Example |
|----------|-------------|---------|
| **Token** | Replace with typed placeholders | `john@email.com` → `[EMAIL_1]` |
| **Mask** | Replace with mask character, preserve structure | `john@email.com` → `****@*****.***` |
| **Format-Preserving** | Replace with realistic fake data | `john@email.com` → `user42@example.net` |

### Built-in Pattern Detection

| Category | Patterns |
|----------|----------|
| **Network** | IPv4 (with CIDR), IPv6, MAC Address, Hostname/FQDN |
| **Personal** | Email, Phone (incl. vanity), SSN, Names (8,849+ name database) |
| **Financial** | Credit Card (13-19 digits), Credit Card Last 4 |
| **Business** | Ticket/Case Numbers |

### Extensibility

- **Custom Patterns** - Define your own regex patterns with configurable strategies
- **Custom Entities** - Whitelist specific values (company names, project names, etc.)

### Engine Features

- Deterministic redaction (same input → same output within session)
- Overlap detection and resolution
- Configurable token format per pattern type
- Configurable mask character
- Import/Export JSON configurations

## Packages

### data-redactor-core

The core TypeScript redaction engine. Zero browser dependencies - works in Node.js and browser environments.

**Key exports:**
- `DataRedactor` - Main redaction class
- `ConfigLoader` - Configuration loading and validation
- `DEFAULT_CONFIG` - Default configuration with all patterns enabled
- Pattern classes: `IPv4Pattern`, `EmailPattern`, `NamePattern`, etc.
- Strategy classes: `TokenStrategy`, `MaskStrategy`, `FormatPreservingStrategy`

### @data-redactor/ui

Next.js 16 web application with three main views:

1. **Simple Config** - Toggle patterns on/off, select strategies per pattern
2. **JSON Editor** - Full configuration editing with validation
3. **Output Format** - Interactive per-pattern testing with live preview of all strategies

## Installation

```bash
# Install the core package
npm install data-redactor-core

# Or use bun
bun add data-redactor-core
```

## Usage

### Basic Example

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
        regex: 'CASE-\\\\d{6}',
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

## Development

```bash
bun install        # Install dependencies
bun run dev        # Run UI dev server
bun run build      # Build everything
bun run build:core # Build core only
```

## Project Structure

```
data-redactor/
├── package.json        # Single config for everything
├── tsconfig.json       # TypeScript config
├── next.config.ts      # Next.js config
├── packages/
│   ├── core/src/       # Redaction engine source
│   └── ui/app/         # Next.js UI source
├── config-examples/
└── examples/
```

## Tech Stack

*Latest versions as of 11/29/2025*

| Category | Package | Version |
|----------|---------|---------|
| **Runtime** | Bun | 1.3+ |
| **Framework** | Next.js | ^16 |
| **UI** | React | ^19 |
| **Build** | tsup | ^8 |
| **Language** | TypeScript | ^5 |
| **Name Data** | common-last-names | ^1 |
| | datasets-male-first-names-en | ^1 |
| | datasets-female-first-names-en | ^1 |
| **Deploy** | Vercel | - |

## License

MIT

## Author

**Matthew Goluba** - [@goobz22](https://github.com/goobz22)

## Contributing

Contributions welcome! See [open issues](https://github.com/goobz22/data-redactor/issues) for planned features.
