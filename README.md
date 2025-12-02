# Data Redactor

A powerful, client-side data redaction tool for securing sensitive information before sending to AI systems or external services. Proving that AI can be used securely with proper input sanitization.

## Live Demo

**[https://data-redactor-ui.vercel.app/](https://data-redactor-ui.vercel.app/)**

## Overview

Data Redactor is a monorepo containing three packages:

| Package | Description | Published |
|---------|-------------|-----------|
| `data-redactor-core` | Core redaction engine | [npm](https://www.npmjs.com/package/data-redactor-core) v1.0.8 |
| `ui` | Vanilla JS web interface | [Vercel](https://data-redactor-ui.vercel.app/) |
| `api` | REST API for community patterns | Vercel Serverless / Self-hosted |

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

### Pattern Builder (New in v1.0.5)

Visual tool to create custom regex patterns from sample data:

- **Mark Selection** - Highlight text in your sample to mark what should be matched
- **Multi-Sample Support** - Add multiple samples to refine pattern accuracy
- **Auto-Generation** - Automatically generates optimized regex from marked text
- **Pattern Explanation** - Human-readable breakdown of what the pattern matches
- **Live Testing** - Test generated patterns against sample data in real-time
- **One-Click Add** - Add patterns directly to your configuration

### Pattern Testing & Validation (New in v1.0.9)

Comprehensive testing system to ensure pattern accuracy and quality:

- **Test Samples** - 60 curated test samples (5 per pattern × 12 patterns)
- **Quality Scoring** - 0-100 quality scores based on test coverage, accuracy, and edge case handling
- **Automated Testing** - Run patterns against test samples to identify false positives and false negatives
- **Pattern Fixing** - Load failed tests into Pattern Builder to fix issues
- **Edge Case Reporting** - Report pattern issues directly from Pattern Detection tab
- **Pre-load System** - Pre-fill Pattern Builder with problematic samples for easy fixing
- **Before/After Comparison** - See quality score improvements when saving improved patterns
- **Test Metadata View** - View all test samples and quality scores from JSON Editor

**Quality Score Breakdown:**
- 🟢 **80-100**: High quality - Pattern works reliably across all test cases
- 🟡 **60-79**: Medium quality - Some issues detected, review recommended
- 🔴 **0-59**: Low quality - Significant issues, pattern needs improvement

### Community Patterns (New in v1.0.5)

Browse, share, and vote on community-contributed regex patterns:

- **Pattern Library** - Discover patterns submitted by other users
- **Voting System** - Upvote/downvote patterns to help surface the best ones
- **Category Filtering** - Filter by identifier, financial, healthcare, infrastructure, personal
- **One-Click Use** - Add community patterns to your configuration instantly
- **Submit Your Own** - Share useful patterns with the community

### Presets

Pre-configured pattern sets for common use cases:

| Preset | Description |
|--------|-------------|
| `strict-ai` | Maximum redaction for AI/LLM inputs |
| `minimal` | Light redaction, preserves readability |
| `logs` | Optimized for log file sanitization |
| `financial` | Focus on financial data (accounts, cards) |
| `healthcare` | HIPAA-focused (MRN, NPI, patient info) |

### Extensibility

- **Custom Patterns** - Define your own regex patterns with configurable strategies
- **Custom Entities** - Whitelist specific values (company names, project names, etc.)
- **Regex Builder** - Programmatic pattern generation from samples

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
- `getPreset()` / `hasPreset()` - Preset configuration helpers
- `generateFromSample()` / `refineFromSamples()` - Regex builder utilities
- **Testing & Validation (v1.0.9):**
  - `PatternTestEngine` - Execute patterns against test samples
  - `calculateQualityScore()` - Calculate 0-100 quality scores
  - `getTestSample()` / `getTestSamplesForPattern()` - Access 60 curated test samples
  - `ALL_TEST_SAMPLES` - All test samples by ID
- Pattern classes: `IPv4Pattern`, `EmailPattern`, `NamePattern`, etc.
- Strategy classes: `TokenStrategy`, `MaskStrategy`, `FormatPreservingStrategy`

### UI

Vanilla JavaScript web application (no framework dependencies) with four main tabs:

1. **Pattern Detection** - Toggle patterns on/off, select strategies per pattern, report issues
2. **JSON Editor** - Full configuration editing with validation, view test metadata
3. **Output Format** - Interactive per-pattern testing with live preview of all strategies
4. **Pattern Validation** (New in v1.0.9) - Four sub-tabs:
   - **Builder** - Visual tool to create/fix custom regex patterns from sample data
   - **Test Samples** - Run patterns against 60 curated test samples, view quality scores
   - **Community** - Browse and use community-contributed patterns
   - **Edge Cases** - View and vote on reported pattern issues

**UI Features:**
- Mobile-responsive design with optimized touch targets
- Collapsible accordion sections for better organization
- Dark mode support
- Keyboard shortcuts for common actions
- Pattern testing with quality scoring (v1.0.9)
- Issue reporting workflow (v1.0.9)
- Pre-load system for fixing failed patterns (v1.0.9)

### API Server

Bun-powered REST API for community patterns, edge cases, and feedback:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/redact` | POST | Redact text (server-side option) |
| `/api/presets` | GET | List available presets |
| **Community Patterns** |
| `/api/patterns` | GET | List community patterns |
| `/api/patterns` | POST | Submit a new pattern |
| `/api/patterns/:id` | GET | Get pattern details |
| `/api/patterns/:id/vote` | POST | Vote on a pattern |
| `/api/patterns/:id/use` | POST | Mark pattern as used |
| **Edge Cases (v1.0.9)** |
| `/api/patterns/:name/edge-cases` | GET | List edge cases for a pattern |
| `/api/patterns/:name/edge-cases` | POST | Submit edge case report |
| `/api/edge-cases/:id` | GET | Get edge case details |
| `/api/edge-cases/:id/vote` | POST | Vote on edge case |
| `/api/edge-cases/:id` | PATCH | Update edge case status |
| `/api/edge-cases/:id` | DELETE | Delete edge case |
| **Sample Submissions (v1.0.9)** |
| `/api/patterns/:name/sample-submissions` | GET | List submitted samples |
| `/api/patterns/:name/sample-submissions` | POST | Submit test sample |
| **Feedback** |
| `/api/feedback` | GET/POST | Feedback collection |

**Database:** MongoDB Atlas - works both locally and on Vercel. Set `MONGODB_URI` environment variable.

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

### Using Presets

```typescript
import { DataRedactor, getPreset } from 'data-redactor-core';

// Use a preset configuration
const redactor = new DataRedactor(getPreset('strict-ai'));

// Or for healthcare compliance
const hipaaRedactor = new DataRedactor(getPreset('healthcare'));
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

### Regex Builder (Programmatic)

```typescript
import { generateFromSample, refineFromSamples } from 'data-redactor-core';

// Generate pattern from a single sample
const result = generateFromSample('ABC-12345', {
  wordBoundaries: true,
  caseInsensitive: false
});

console.log(result.regex);
// "[A-Z]{3}-\\d{5}"

// Refine with multiple samples
const refined = refineFromSamples(
  ['ABC-12345', 'XYZ-67890', 'DEF-11111'],
  { wordBoundaries: true }
);
```

### Pattern Testing & Quality Scoring (New in v1.0.9)

```typescript
import {
  PatternTestEngine,
  calculateQualityScore,
  getTestSamplesForPattern
} from 'data-redactor-core';

// Get test samples for a pattern
const testSamples = getTestSamplesForPattern('ipv4');
console.log(testSamples.length); // 5 test samples

// Test a pattern against samples
const patternConfig = {
  enabled: true,
  strategy: 'token',
  regex: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b'
};

const results = testSamples.map(sample =>
  PatternTestEngine.executeTest('ipv4', patternConfig, sample)
);

// Calculate quality score
const qualityScore = calculateQualityScore(results, 0);
console.log(qualityScore); // 0-100

// Check results
results.forEach(result => {
  console.log(`Sample: ${result.sampleId}`);
  console.log(`Passed: ${result.passed}`);
  console.log(`Accuracy: ${result.accuracy}%`);
  console.log(`False Positives: ${result.falsePositives}`);
  console.log(`False Negatives: ${result.falseNegatives}`);
});
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

## Deployment

### Option 1: Vercel (Recommended)

The project is configured to deploy both the UI and API to Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `MONGODB_URI` (your MongoDB Atlas connection string)
4. Deploy

Vercel will:
- Build the UI using `bun run build:ui`
- Deploy serverless API functions from the `/api` directory
- Serve static files from `/dist`

### Option 2: Self-Hosted (Bun)

Run the full application with a single Bun server:

```bash
# Install dependencies
bun install

# Set environment variable
export MONGODB_URI="mongodb+srv://..."

# Build and start production server
bun start
```

This starts a single server on port 3000 serving both the UI and API.

## Development

```bash
bun install        # Install dependencies (also builds core)
bun dev            # Run both UI and API dev servers
bun dev:ui         # Run UI dev server with hot reload
bun dev:api        # Run API server only
bun start          # Build and run production server
bun build          # Build everything (core + UI)
bun build:core     # Build core library only
bun build:ui       # Build UI for static deployment
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
bun format         # Run Prettier
```

## Project Structure

```
data-redactor/
├── package.json        # Root package config
├── tsconfig.json       # TypeScript config
├── build-ui.js         # UI bundler script (Bun.build)
├── dev.ts              # Combined dev server runner
├── vercel.json         # Vercel deployment config
├── dist/               # Built UI (static files for deployment)
├── packages/
│   ├── core/src/       # Redaction engine source (TypeScript)
│   │   ├── index.ts    # Main exports
│   │   ├── engine.ts   # Core redaction logic
│   │   ├── config.ts   # Configuration handling
│   │   ├── presets.ts  # Preset configurations
│   │   ├── patterns/   # Pattern implementations
│   │   ├── regex-builder/  # Pattern generation from samples
│   │   └── scenarios/  # Context-aware redaction scenarios
│   ├── ui/             # Vanilla JS UI source
│   │   ├── index.html
│   │   ├── main.js
│   │   └── styles.css
│   └── api/            # REST API server (self-hosted)
│       ├── server.ts   # Bun server entry
│       ├── routes/     # API route handlers
│       └── db/         # MongoDB database client
├── api/                # Vercel serverless functions
│   ├── health.ts
│   ├── presets.ts
│   ├── feedback.ts
│   ├── patterns/
│   └── lib/db.ts       # Shared MongoDB client
├── config-examples/
└── examples/
    └── tampermonkey-redactor.js  # Browser userscript example
```

## Tech Stack

*Latest versions as of 11/29/2025*

| Category | Package | Version |
|----------|---------|---------|
| **Runtime** | Bun | 1.3+ |
| **UI** | Vanilla JavaScript | ES2022 |
| **Build** | tsup (core), Bun.build (UI) | ^8 |
| **Language** | TypeScript (core) | ^5 |
| **Database** | MongoDB Atlas | ^7 |
| **Name Data** | common-last-names | ^1 |
| | datasets-male-first-names-en | ^1 |
| | datasets-female-first-names-en | ^1 |
| **Deploy** | Vercel (UI + Serverless API) | - |

## License

MIT

## Author

**Matthew Goluba** - [@goobz22](https://github.com/goobz22)

## Contributing

Contributions welcome! See [open issues](https://github.com/goobz22/data-redactor/issues) for planned features.

### Ways to Contribute

- **Submit Patterns** - Use the Pattern Builder to create and submit useful patterns
- **Vote on Patterns** - Help surface the best community patterns
- **Report Issues** - Found a bug or false positive? Open an issue
- **Feature Requests** - Ideas for new patterns or features? We'd love to hear them
