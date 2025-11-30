var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// packages/core/src/config.ts
var DEFAULT_CONFIG = {
  formatOptions: {
    tokenFormat: "[{TYPE}_{INDEX}]",
    maskChar: "*",
    preserveStructure: true
  },
  patterns: {
    ipv4: {
      enabled: true,
      strategy: "token",
      regex: "(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?(?![0-9])"
    },
    ipv6: {
      enabled: true,
      strategy: "token",
      regex: "(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}"
    },
    macAddress: {
      enabled: true,
      strategy: "token",
      regex: "(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})"
    },
    email: {
      enabled: true,
      strategy: "token",
      regex: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"
    },
    phone: {
      enabled: true,
      strategy: "token",
      regex: "(?<![A-Za-z0-9])(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\(\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\)|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?[A-Za-z]{7}|\\d{3}[-\\.\\s]?[A-Za-z]{3}[-\\.\\s]?[A-Za-z]{4})(?![A-Za-z0-9])"
    },
    ssn: {
      enabled: true,
      strategy: "token",
      regex: "\\b\\d{3}-\\d{2}-\\d{4}\\b"
    },
    creditCard: {
      enabled: true,
      strategy: "token",
      regex: "(?<!\\d)(?:\\d{4}[-\\s]?){3,4}\\d{1,4}(?!\\d)|(?<!\\d)\\d{13,19}(?!\\d)"
    },
    creditCardLast4: {
      enabled: true,
      strategy: "token",
      regex: "(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)",
      flags: "i"
    },
    hostname: {
      enabled: true,
      strategy: "token",
      regex: "\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b"
    },
    ticketNumber: {
      enabled: true,
      strategy: "token",
      regex: "(?:ticket|case)\\s*[#:-]?\\s*\\d+",
      flags: "i"
    },
    name: {
      enabled: true,
      strategy: "token"
      // No default regex - built dynamically from name databases (8849 names)
      // Custom regex can be provided if needed
    },
    uuid: {
      enabled: true,
      strategy: "token",
      regex: "\\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\\b"
    },
    filePath: {
      enabled: true,
      strategy: "token",
      regex: '(?:[A-Za-z]:\\\\(?:[^\\\\\\/:*?"<>|\\r\\n]+\\\\)*[^\\\\\\/:*?"<>|\\r\\n]*)|(?:\\/(?:[^\\s\\/\\0]+\\/)+[^\\s\\/\\0]*|\\/[^\\s\\/\\0]+)'
    },
    custom: []
  },
  scenarios: {
    authHeader: { enabled: true, strategy: "token" },
    password: { enabled: true, strategy: "token" },
    apiKey: { enabled: true, strategy: "token" },
    connectionString: { enabled: true, strategy: "token" },
    privateKey: { enabled: true, strategy: "token" },
    awsCredentials: { enabled: true, strategy: "token" }
  },
  customEntities: {},
  testData: `Support Ticket #12345

Customer Information:
- Name: John Doe
- Email: john.doe@company.com
- Phone: 555-123-4567
- Alt Phone: (555) 987-6543
- Mobile: 1-555-SUPPORT
- SSN: 123-45-6789

Network Details:
- IPv4: 192.168.1.100
- IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- MAC Address: 00-1B-44-11-3A-B8
- Gateway: 10.0.0.1
- DNS Server: 8.8.8.8
- Hostname: mail.example.com

System Details:
- Request ID: 550e8400-e29b-41d4-a716-446655440000
- Session UUID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
- Config File: C:\\Users\\admin\\AppData\\config.json
- Log Path: /var/log/application/error.log
- Script: /home/user/scripts/deploy.sh

Credentials (Context-Aware):
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
- password = super_secret_123
- api_key: sk-1234567890abcdef
- DATABASE_URL: postgres://user:p@ssw0rd@localhost:5432/mydb
- AWS_SECRET_ACCESS_KEY = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

Payment Information:
- Primary Card: 4532-1234-5678-9010
- Backup Card: 5425233430109903
- Card ending in 9010
- AmEx: 378282246310005

Issue Description:
Customer contacted us from IP 203.0.113.45 regarding server api.internal.company.net connection issues.
Contact support@company.com or call 1-555-FLOWERS for assistance.`
};
var ConfigLoader = class {
  static loadFromFile(path) {
    if (typeof process !== "undefined" && process.versions && process.versions.node) {
      try {
        const fs = __require("fs");
        const content = fs.readFileSync(path, "utf-8");
        const config = JSON.parse(content);
        return this.mergeWithDefaults(config);
      } catch (error) {
        throw new Error(`Failed to load config from ${path}: ${error}`);
      }
    } else {
      throw new Error(
        "loadFromFile is only available in Node.js environments. Use loadFromObject instead."
      );
    }
  }
  static loadFromObject(config) {
    return this.mergeWithDefaults(config);
  }
  static getDefault() {
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }
  static mergeWithDefaults(config) {
    const merged = {
      patterns: {
        ...DEFAULT_CONFIG.patterns,
        ...config.patterns
      },
      customEntities: {
        ...DEFAULT_CONFIG.customEntities,
        ...config.customEntities
      }
    };
    return merged;
  }
  static validateConfig(config) {
    const errors = [];
    if (config.patterns) {
      const validStrategies = ["token", "mask", "formatPreserving"];
      Object.entries(config.patterns).forEach(([key, value]) => {
        if (key === "custom") {
          const customPatterns = value;
          customPatterns?.forEach((pattern, index) => {
            if (!pattern.name) {
              errors.push(`Custom pattern at index ${index} is missing 'name'`);
            }
            if (!pattern.regex) {
              errors.push(`Custom pattern '${pattern.name}' is missing 'regex'`);
            }
            if (!validStrategies.includes(pattern.strategy)) {
              errors.push(
                `Custom pattern '${pattern.name}' has invalid strategy: ${pattern.strategy}`
              );
            }
            try {
              new RegExp(pattern.regex, pattern.flags || "");
            } catch (e) {
              errors.push(
                `Custom pattern '${pattern.name}' has invalid regex: ${e}`
              );
            }
          });
        } else {
          const patternConfig = value;
          if (patternConfig && !validStrategies.includes(patternConfig.strategy)) {
            errors.push(
              `Pattern '${key}' has invalid strategy: ${patternConfig.strategy}`
            );
          }
        }
      });
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// packages/core/src/patterns/base.ts
var BasePattern = class {
  name;
  regex;
  strategy;
  enabled;
  constructor(name, regex, strategy = "token", enabled = true) {
    this.name = name;
    this.regex = regex;
    this.strategy = strategy;
    this.enabled = enabled;
  }
  test(text) {
    return this.regex.test(text);
  }
  findAll(text) {
    if (!this.enabled) return [];
    const matches = [];
    const regex = new RegExp(
      this.regex.source,
      "g" + this.regex.flags.replace("g", "")
    );
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
        type: this.name,
        strategy: this.strategy
      });
    }
    return matches;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
};

// packages/core/src/patterns/network.ts
var IPv4Pattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?(?![0-9])/;
    super("ipv4", regex, strategy, enabled);
  }
};
var IPv6Pattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}/;
    super("ipv6", regex, strategy, enabled);
  }
  // Override findAll to expand :: shorthand before validating
  findAll(text) {
    console.log(
      "[IPv6Pattern] findAll called with text:",
      text.substring(0, 200)
    );
    const matches = [];
    const regex = new RegExp(this.regex.source, "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const potential = match[0];
      console.log(
        "[IPv6Pattern] Found potential match:",
        potential,
        "at index:",
        match.index
      );
      const isValid = this.isValidIPv6(potential);
      console.log("[IPv6Pattern] isValid:", isValid, "for:", potential);
      if (isValid) {
        matches.push({
          value: potential,
          start: match.index,
          end: match.index + potential.length,
          type: this.name,
          strategy: this.strategy
        });
        console.log("[IPv6Pattern] Added valid match:", potential);
      } else {
        console.log("[IPv6Pattern] Rejected invalid match:", potential);
      }
    }
    console.log("[IPv6Pattern] Total valid matches:", matches.length);
    return matches;
  }
  isValidIPv6(addr) {
    console.log("[IPv6Pattern] Validating:", addr);
    const colonCount = (addr.match(/:/g) || []).length;
    console.log("[IPv6Pattern] Colon count:", colonCount);
    if (colonCount < 2) {
      console.log("[IPv6Pattern] Validation failed: too few colons");
      return false;
    }
    const doubleColonCount = (addr.match(/::/g) || []).length;
    console.log("[IPv6Pattern] Double colon count:", doubleColonCount);
    if (doubleColonCount > 1) {
      console.log("[IPv6Pattern] Validation failed: multiple ::");
      return false;
    }
    try {
      const expanded = this.expandIPv6(addr);
      console.log("[IPv6Pattern] Expanded to:", expanded);
      const groups = expanded.split(":");
      console.log("[IPv6Pattern] Groups:", groups, "count:", groups.length);
      if (groups.length !== 8) {
        console.log("[IPv6Pattern] Validation failed: not 8 groups");
        return false;
      }
      const allValid = groups.every((g) => /^[0-9a-fA-F]{1,4}$/.test(g));
      console.log("[IPv6Pattern] All groups valid hex:", allValid);
      return allValid;
    } catch (e) {
      console.log("[IPv6Pattern] Validation failed with error:", e);
      return false;
    }
  }
  expandIPv6(addr) {
    console.log("[IPv6Pattern] Expanding:", addr);
    if (!addr.includes("::")) {
      console.log("[IPv6Pattern] No :: found, returning as-is");
      return addr;
    }
    const sides = addr.split("::");
    console.log("[IPv6Pattern] Split on ::", sides);
    if (sides.length !== 2) {
      console.log("[IPv6Pattern] Invalid split length:", sides.length);
      return addr;
    }
    const left = sides[0] ? sides[0].split(":") : [];
    const right = sides[1] ? sides[1].split(":") : [];
    console.log("[IPv6Pattern] Left groups:", left, "Right groups:", right);
    const totalGroups = 8;
    const existingGroups = left.length + right.length;
    const zeroGroups = totalGroups - existingGroups;
    console.log(
      "[IPv6Pattern] Existing groups:",
      existingGroups,
      "Zero groups needed:",
      zeroGroups
    );
    const zeros = Array(zeroGroups).fill("0");
    const expanded = [...left, ...zeros, ...right];
    console.log("[IPv6Pattern] Expanded array:", expanded);
    const result = expanded.join(":");
    console.log("[IPv6Pattern] Final expanded result:", result);
    return result;
  }
};
var MACAddressPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/;
    super("macAddress", regex, strategy, enabled);
  }
};
var HostnamePattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/;
    super("hostname", regex, strategy, enabled);
  }
};

// packages/core/src/patterns/personal.ts
import maleNamesData from "datasets-male-first-names-en";
import femaleNamesData from "datasets-female-first-names-en";
import * as lastNamesModule from "common-last-names";
var maleNames = maleNamesData || [];
var femaleNames = femaleNamesData || [];
var lastNames = lastNamesModule.all || [];
var EmailPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    super("email", regex, strategy, enabled);
  }
};
var PhonePattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?<![A-Za-z0-9])(?:\+?1[-.\s]?)?(?:\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\)|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?[A-Za-z]{7}|\d{3}[-.\s]?[A-Za-z]{3}[-.\s]?[A-Za-z]{4})(?![A-Za-z0-9])/;
    super("phone", regex, strategy, enabled);
  }
};
var SSNPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b\d{3}-\d{2}-\d{4}\b/;
    super("ssn", regex, strategy, enabled);
  }
};
var NamePattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const allFirstNames = [...maleNames, ...femaleNames];
    const allNames = [...allFirstNames, ...lastNames];
    const escapedNames = allNames.map(
      (name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    escapedNames.sort((a, b) => b.length - a.length);
    const namesPattern = escapedNames.join("|");
    const regex = new RegExp(
      `\\b(?:${namesPattern})(?:\\s+(?:${namesPattern}))?\\b`,
      "i"
    );
    super("name", regex, strategy, enabled);
  }
};

// packages/core/src/patterns/financial.ts
var CreditCardPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?<!\d)(?:\d{4}[-\s]?){3,4}\d{1,4}(?!\d)|(?<!\d)\d{13,19}(?!\d)/;
    super("creditCard", regex, strategy, enabled);
  }
};
var CreditCardLast4Pattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:(?:card|payment|account)\s+)?(?:ending\s+in\s+|ends\s+in\s+|last\s+(?:4|four)(?:\s+digits)?[\s:]+)\d{4}(?!\d)|(?:\*{4,})\d{4}(?!\d)/i;
    super("creditCardLast4", regex, strategy, enabled);
  }
};

// packages/core/src/patterns/business.ts
var TicketNumberPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:ticket|case)\s*[#:-]?\s*\d+/i;
    super("ticketNumber", regex, strategy, enabled);
  }
};

// packages/core/src/patterns/system.ts
var UUIDPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;
    super("uuid", regex, strategy, enabled);
  }
};
var FilePathPattern = class extends BasePattern {
  constructor(strategy = "token", enabled = true) {
    const regex = /(?:[A-Za-z]:\\(?:[^\\\/:*?"<>|\r\n]+\\)*[^\\\/:*?"<>|\r\n]*)|(?:\/(?:[^\s\/\0]+\/)+[^\s\/\0]*|\/[^\s\/\0]+)/g;
    super("filePath", regex, strategy, enabled);
  }
};

// packages/core/src/strategies/base.ts
var RedactionContext = class {
  valueMap = /* @__PURE__ */ new Map();
  counters = /* @__PURE__ */ new Map();
  getOrCreateRedaction(value, type, strategy) {
    const key = `${type}:${value}`;
    if (this.valueMap.has(key)) {
      return this.valueMap.get(key);
    }
    const counter = (this.counters.get(type) || 0) + 1;
    this.counters.set(type, counter);
    const redacted = strategy.redact(value, type, counter);
    this.valueMap.set(key, redacted);
    return redacted;
  }
  getMapping() {
    const mapping = {};
    this.valueMap.forEach((redacted, key) => {
      const [, original] = key.split(":", 2);
      mapping[original] = redacted;
    });
    return mapping;
  }
  clear() {
    this.valueMap.clear();
    this.counters.clear();
  }
};

// packages/core/src/strategies/token.ts
var TokenStrategy = class {
  tokenFormat;
  constructor(formatOptions) {
    this.tokenFormat = formatOptions?.tokenFormat || "[{TYPE}_{INDEX}]";
  }
  redact(value, type, counter) {
    const typeUpper = type.toUpperCase().replace(/([A-Z])/g, "_$1").replace(/^_/, "");
    return this.tokenFormat.replace(/\{TYPE\}/g, typeUpper).replace(/\{INDEX\}/g, counter.toString());
  }
};

// packages/core/src/strategies/mask.ts
var MaskStrategy = class {
  maskChar;
  preserveStructure;
  constructor(formatOptions) {
    this.maskChar = formatOptions?.maskChar || "*";
    this.preserveStructure = formatOptions?.preserveStructure !== false;
  }
  redact(value, type, counter) {
    if (!this.preserveStructure) {
      return this.maskChar.repeat(value.length);
    }
    return value.replace(/[a-zA-Z0-9]/g, this.maskChar);
  }
};

// packages/core/src/strategies/formatPreserving.ts
var FormatPreservingStrategy = class {
  seed = 12345;
  constructor(formatOptions) {
  }
  redact(value, type, counter) {
    const hash = this.hashString(value + counter);
    switch (type) {
      case "ipv4":
        return this.generateIPv4(hash);
      case "macAddress":
        return this.generateMAC(hash, value);
      case "email":
        return this.generateEmail(hash);
      case "phone":
        return this.generatePhone(hash);
      case "ssn":
        return this.generateSSN(hash);
      case "creditCard":
        return this.generateCreditCard(hash);
      case "hostname":
        return this.generateHostname(hash);
      default:
        return `REDACTED_${counter}`;
    }
  }
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  seededRandom(seed) {
    const x = Math.sin(seed++) * 1e4;
    return x - Math.floor(x);
  }
  generateIPv4(seed) {
    const octets = [10];
    for (let i = 0; i < 3; i++) {
      octets.push(Math.floor(this.seededRandom(seed + i) * 256));
    }
    return octets.join(".");
  }
  generateMAC(seed, original) {
    let separator = ":";
    if (original.includes("-")) separator = "-";
    else if (original.includes(".")) separator = ".";
    const hex = "0123456789ABCDEF";
    const parts = [];
    if (separator === ".") {
      for (let i = 0; i < 3; i++) {
        let part = "";
        for (let j = 0; j < 4; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 4 + j) * 16)];
        }
        parts.push(part);
      }
      return parts.join(".");
    } else {
      for (let i = 0; i < 6; i++) {
        let part = "";
        for (let j = 0; j < 2; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 2 + j) * 16)];
        }
        parts.push(part);
      }
      return parts.join(separator);
    }
  }
  generateEmail(seed) {
    const userLength = 5 + Math.floor(this.seededRandom(seed) * 8);
    const user = this.generateRandomString(seed, userLength);
    const domains = ["example.com", "test.com", "sample.org", "demo.net"];
    const domain = domains[Math.floor(this.seededRandom(seed + 1e3) * domains.length)];
    return `${user}@${domain}`;
  }
  generatePhone(seed) {
    const area = 200 + Math.floor(this.seededRandom(seed) * 800);
    const exchange = 200 + Math.floor(this.seededRandom(seed + 1) * 800);
    const number = Math.floor(this.seededRandom(seed + 2) * 1e4);
    return `${area}-${exchange}-${number.toString().padStart(4, "0")}`;
  }
  generateSSN(seed) {
    const area = 100 + Math.floor(this.seededRandom(seed) * 900);
    const group = 10 + Math.floor(this.seededRandom(seed + 1) * 90);
    const serial = 1e3 + Math.floor(this.seededRandom(seed + 2) * 9e3);
    return `${area}-${group.toString().padStart(2, "0")}-${serial}`;
  }
  generateCreditCard(seed) {
    let card = "4";
    for (let i = 0; i < 15; i++) {
      card += Math.floor(this.seededRandom(seed + i) * 10);
    }
    return card.match(/.{1,4}/g)?.join(" ") || card;
  }
  generateHostname(seed) {
    const length = 5 + Math.floor(this.seededRandom(seed) * 8);
    const name = this.generateRandomString(seed, length);
    const tlds = ["com", "net", "org", "io"];
    const tld = tlds[Math.floor(this.seededRandom(seed + 1e3) * tlds.length)];
    return `${name}.${tld}`;
  }
  generateRandomString(seed, length) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(this.seededRandom(seed + i) * chars.length)];
    }
    return result;
  }
};

// packages/core/src/scenarios/base.ts
var BaseScenario = class {
  name;
  pattern;
  captureGroup;
  strategy;
  enabled;
  constructor(name, pattern, captureGroup = 1, strategy = "token", enabled = true) {
    this.name = name;
    this.pattern = pattern;
    this.captureGroup = captureGroup;
    this.strategy = strategy;
    this.enabled = enabled;
  }
  findAll(text) {
    if (!this.enabled) return [];
    const matches = [];
    const regex = new RegExp(
      this.pattern.source,
      "g" + this.pattern.flags.replace("g", "")
    );
    let match;
    while ((match = regex.exec(text)) !== null) {
      const capturedValue = match[this.captureGroup];
      if (capturedValue) {
        const fullMatch = match[0];
        const captureStart = match.index + fullMatch.indexOf(capturedValue);
        matches.push({
          value: capturedValue,
          start: captureStart,
          end: captureStart + capturedValue.length,
          type: this.name,
          strategy: this.strategy
        });
      }
    }
    return matches;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  setEnabled(enabled) {
    this.enabled = enabled;
  }
};
var AuthorizationHeaderScenario = class extends BaseScenario {
  constructor(strategy = "token", enabled = true) {
    super(
      "authHeader",
      /Authorization:\s*(?:Bearer|Basic)\s+([^\s\r\n]+)/gi,
      1,
      strategy,
      enabled
    );
  }
};
var PasswordScenario = class extends BaseScenario {
  constructor(strategy = "token", enabled = true) {
    super(
      "password",
      /(?:password|passwd|pwd)\s*[:=]\s*["']?([^\s"'\r\n,;]+)["']?/gi,
      1,
      strategy,
      enabled
    );
  }
};
var ApiKeyScenario = class extends BaseScenario {
  constructor(strategy = "token", enabled = true) {
    super(
      "apiKey",
      /(?:api[_-]?key|apikey|secret[_-]?key|access[_-]?key)\s*[:=]\s*["']?([^\s"'\r\n,;]+)["']?/gi,
      1,
      strategy,
      enabled
    );
  }
};
var ConnectionStringScenario = class extends BaseScenario {
  constructor(strategy = "token", enabled = true) {
    super(
      "connectionString",
      /(?:mongodb|postgres|mysql|redis|amqp):\/\/[^:]+:([^@]+)@/gi,
      1,
      strategy,
      enabled
    );
  }
};
var PrivateKeyScenario = class extends BaseScenario {
  constructor(strategy = "token", enabled = true) {
    super(
      "privateKey",
      /(-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |DSA )?PRIVATE KEY-----)/gi,
      1,
      strategy,
      enabled
    );
  }
};
var AWSCredentialsScenario = class extends BaseScenario {
  constructor(strategy = "token", enabled = true) {
    super(
      "awsCredentials",
      /(?:aws[_-]?(?:access[_-]?key[_-]?id|secret[_-]?access[_-]?key))\s*[:=]\s*["']?([A-Za-z0-9\/+=]+)["']?/gi,
      1,
      strategy,
      enabled
    );
  }
};

// packages/core/src/engine.ts
var DataRedactor = class {
  config;
  patterns = [];
  scenarios = [];
  context;
  strategies;
  constructor(config) {
    console.log("[DataRedactor] Constructor called - VERSION WITH LOGGING");
    if (typeof config === "string") {
      this.config = ConfigLoader.loadFromFile(config);
    } else if (config) {
      this.config = ConfigLoader.loadFromObject(config);
    } else {
      this.config = ConfigLoader.getDefault();
    }
    console.log("[DataRedactor] Config loaded:", this.config);
    const validation = ConfigLoader.validateConfig(this.config);
    if (!validation.valid) {
      throw new Error(`Invalid configuration: ${validation.errors.join(", ")}`);
    }
    const formatOptions = this.config.formatOptions;
    this.strategies = /* @__PURE__ */ new Map([
      ["token", new TokenStrategy(formatOptions)],
      ["mask", new MaskStrategy(formatOptions)],
      ["formatPreserving", new FormatPreservingStrategy(formatOptions)]
    ]);
    this.context = new RedactionContext();
    this.initializePatterns();
    this.initializeScenarios();
  }
  initializePatterns() {
    const { patterns } = this.config;
    if (!patterns) return;
    if (patterns.ipv4) {
      if (patterns.ipv4.regex) {
        const regex = new RegExp(patterns.ipv4.regex, patterns.ipv4.flags || "");
        this.patterns.push(
          new BasePattern(
            "ipv4",
            regex,
            patterns.ipv4.strategy,
            patterns.ipv4.enabled
          )
        );
      } else {
        this.patterns.push(
          new IPv4Pattern(patterns.ipv4.strategy, patterns.ipv4.enabled)
        );
      }
    }
    if (patterns.ipv6) {
      if (patterns.ipv6.regex) {
        const regex = new RegExp(patterns.ipv6.regex, patterns.ipv6.flags || "");
        this.patterns.push(
          new BasePattern(
            "ipv6",
            regex,
            patterns.ipv6.strategy,
            patterns.ipv6.enabled
          )
        );
      } else {
        this.patterns.push(
          new IPv6Pattern(patterns.ipv6.strategy, patterns.ipv6.enabled)
        );
      }
    }
    if (patterns.macAddress) {
      if (patterns.macAddress.regex) {
        const regex = new RegExp(
          patterns.macAddress.regex,
          patterns.macAddress.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "macAddress",
            regex,
            patterns.macAddress.strategy,
            patterns.macAddress.enabled
          )
        );
      } else {
        this.patterns.push(
          new MACAddressPattern(
            patterns.macAddress.strategy,
            patterns.macAddress.enabled
          )
        );
      }
    }
    if (patterns.email) {
      if (patterns.email.regex) {
        const regex = new RegExp(
          patterns.email.regex,
          patterns.email.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "email",
            regex,
            patterns.email.strategy,
            patterns.email.enabled
          )
        );
      } else {
        this.patterns.push(
          new EmailPattern(patterns.email.strategy, patterns.email.enabled)
        );
      }
    }
    if (patterns.phone) {
      if (patterns.phone.regex) {
        const regex = new RegExp(
          patterns.phone.regex,
          patterns.phone.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "phone",
            regex,
            patterns.phone.strategy,
            patterns.phone.enabled
          )
        );
      } else {
        this.patterns.push(
          new PhonePattern(patterns.phone.strategy, patterns.phone.enabled)
        );
      }
    }
    if (patterns.ssn) {
      if (patterns.ssn.regex) {
        const regex = new RegExp(patterns.ssn.regex, patterns.ssn.flags || "");
        this.patterns.push(
          new BasePattern(
            "ssn",
            regex,
            patterns.ssn.strategy,
            patterns.ssn.enabled
          )
        );
      } else {
        this.patterns.push(
          new SSNPattern(patterns.ssn.strategy, patterns.ssn.enabled)
        );
      }
    }
    if (patterns.creditCard) {
      if (patterns.creditCard.regex) {
        const regex = new RegExp(
          patterns.creditCard.regex,
          patterns.creditCard.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "creditCard",
            regex,
            patterns.creditCard.strategy,
            patterns.creditCard.enabled
          )
        );
      } else {
        this.patterns.push(
          new CreditCardPattern(
            patterns.creditCard.strategy,
            patterns.creditCard.enabled
          )
        );
      }
    }
    if (patterns.creditCardLast4) {
      if (patterns.creditCardLast4.regex) {
        const regex = new RegExp(
          patterns.creditCardLast4.regex,
          patterns.creditCardLast4.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "creditCardLast4",
            regex,
            patterns.creditCardLast4.strategy,
            patterns.creditCardLast4.enabled
          )
        );
      } else {
        this.patterns.push(
          new CreditCardLast4Pattern(
            patterns.creditCardLast4.strategy,
            patterns.creditCardLast4.enabled
          )
        );
      }
    }
    if (patterns.hostname) {
      if (patterns.hostname.regex) {
        const regex = new RegExp(
          patterns.hostname.regex,
          patterns.hostname.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "hostname",
            regex,
            patterns.hostname.strategy,
            patterns.hostname.enabled
          )
        );
      } else {
        this.patterns.push(
          new HostnamePattern(
            patterns.hostname.strategy,
            patterns.hostname.enabled
          )
        );
      }
    }
    if (patterns.ticketNumber) {
      if (patterns.ticketNumber.regex) {
        const regex = new RegExp(
          patterns.ticketNumber.regex,
          patterns.ticketNumber.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "ticketNumber",
            regex,
            patterns.ticketNumber.strategy,
            patterns.ticketNumber.enabled
          )
        );
      } else {
        this.patterns.push(
          new TicketNumberPattern(
            patterns.ticketNumber.strategy,
            patterns.ticketNumber.enabled
          )
        );
      }
    }
    if (patterns.name) {
      if (patterns.name.regex) {
        const regex = new RegExp(patterns.name.regex, patterns.name.flags || "");
        this.patterns.push(
          new BasePattern(
            "name",
            regex,
            patterns.name.strategy,
            patterns.name.enabled
          )
        );
      } else {
        this.patterns.push(
          new NamePattern(patterns.name.strategy, patterns.name.enabled)
        );
      }
    }
    if (patterns.uuid) {
      if (patterns.uuid.regex) {
        const regex = new RegExp(patterns.uuid.regex, patterns.uuid.flags || "");
        this.patterns.push(
          new BasePattern(
            "uuid",
            regex,
            patterns.uuid.strategy,
            patterns.uuid.enabled
          )
        );
      } else {
        this.patterns.push(
          new UUIDPattern(patterns.uuid.strategy, patterns.uuid.enabled)
        );
      }
    }
    if (patterns.filePath) {
      if (patterns.filePath.regex) {
        const regex = new RegExp(
          patterns.filePath.regex,
          patterns.filePath.flags || ""
        );
        this.patterns.push(
          new BasePattern(
            "filePath",
            regex,
            patterns.filePath.strategy,
            patterns.filePath.enabled
          )
        );
      } else {
        this.patterns.push(
          new FilePathPattern(
            patterns.filePath.strategy,
            patterns.filePath.enabled
          )
        );
      }
    }
    if (patterns.custom) {
      patterns.custom.forEach((customPattern) => {
        const regex = new RegExp(customPattern.regex, customPattern.flags || "");
        this.patterns.push(
          new BasePattern(
            customPattern.name,
            regex,
            customPattern.strategy,
            true
          )
        );
      });
    }
    if (this.config.customEntities) {
      Object.entries(this.config.customEntities).forEach(([type, values]) => {
        if (values && values.length > 0) {
          const escapedValues = values.map(
            (v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          );
          const regex = new RegExp(`\\b(${escapedValues.join("|")})\\b`, "gi");
          this.patterns.push(new BasePattern(type, regex, "token", true));
        }
      });
    }
  }
  initializeScenarios() {
    const { scenarios } = this.config;
    if (!scenarios) return;
    if (scenarios.authHeader) {
      this.scenarios.push(
        new AuthorizationHeaderScenario(
          scenarios.authHeader.strategy,
          scenarios.authHeader.enabled
        )
      );
    }
    if (scenarios.password) {
      this.scenarios.push(
        new PasswordScenario(
          scenarios.password.strategy,
          scenarios.password.enabled
        )
      );
    }
    if (scenarios.apiKey) {
      this.scenarios.push(
        new ApiKeyScenario(scenarios.apiKey.strategy, scenarios.apiKey.enabled)
      );
    }
    if (scenarios.connectionString) {
      this.scenarios.push(
        new ConnectionStringScenario(
          scenarios.connectionString.strategy,
          scenarios.connectionString.enabled
        )
      );
    }
    if (scenarios.privateKey) {
      this.scenarios.push(
        new PrivateKeyScenario(
          scenarios.privateKey.strategy,
          scenarios.privateKey.enabled
        )
      );
    }
    if (scenarios.awsCredentials) {
      this.scenarios.push(
        new AWSCredentialsScenario(
          scenarios.awsCredentials.strategy,
          scenarios.awsCredentials.enabled
        )
      );
    }
  }
  redact(text) {
    console.log(
      "[DataRedactor] redact() called with text:",
      text.substring(0, 200)
    );
    console.log("[DataRedactor] Number of patterns:", this.patterns.length);
    const allMatches = [];
    this.patterns.forEach((pattern) => {
      console.log(
        "[DataRedactor] Checking pattern:",
        pattern.name,
        "enabled:",
        pattern.enabled
      );
      if (pattern.enabled) {
        const matches = pattern.findAll(text);
        console.log(
          "[DataRedactor] Pattern",
          pattern.name,
          "found",
          matches.length,
          "matches"
        );
        allMatches.push(...matches);
      }
    });
    this.scenarios.forEach((scenario) => {
      if (scenario.enabled) {
        const matches = scenario.findAll(text);
        console.log(
          "[DataRedactor] Scenario",
          scenario.name,
          "found",
          matches.length,
          "matches"
        );
        allMatches.push(...matches);
      }
    });
    const nonOverlappingMatches = this.removeOverlaps(allMatches);
    nonOverlappingMatches.sort((a, b) => b.start - a.start);
    let redactedText = text;
    nonOverlappingMatches.forEach((match) => {
      const strategy = this.strategies.get(match.strategy);
      if (strategy) {
        const replacement = this.context.getOrCreateRedaction(
          match.value,
          match.type,
          strategy
        );
        redactedText = redactedText.substring(0, match.start) + replacement + redactedText.substring(match.end);
      }
    });
    return {
      redactedText,
      mapping: this.context.getMapping(),
      matches: nonOverlappingMatches.reverse()
      // Return in original order
    };
  }
  removeOverlaps(matches) {
    const result = [];
    const sorted = [...matches].sort((a, b) => a.start - b.start);
    sorted.forEach((match) => {
      const overlaps = result.some((existing) => {
        return match.start >= existing.start && match.start < existing.end || match.end > existing.start && match.end <= existing.end || match.start <= existing.start && match.end >= existing.end;
      });
      if (!overlaps) {
        result.push(match);
      }
    });
    return result;
  }
  reset() {
    this.context.clear();
  }
  getConfig() {
    return JSON.parse(JSON.stringify(this.config));
  }
  updateConfig(config) {
    this.config = ConfigLoader.loadFromObject({
      ...this.config,
      ...config
    });
    const formatOptions = this.config.formatOptions;
    this.strategies = /* @__PURE__ */ new Map([
      ["token", new TokenStrategy(formatOptions)],
      ["mask", new MaskStrategy(formatOptions)],
      ["formatPreserving", new FormatPreservingStrategy(formatOptions)]
    ]);
    this.patterns = [];
    this.scenarios = [];
    this.initializePatterns();
    this.initializeScenarios();
    this.reset();
  }
};

// packages/core/src/presets.ts
var PRESETS = {
  /**
   * Strict AI Compliance Preset
   * Maximum protection for data sent to AI/LLM systems
   * Enables all patterns and scenarios with token replacement
   */
  "strict-ai": {
    formatOptions: {
      tokenFormat: "[REDACTED_{TYPE}_{INDEX}]",
      maskChar: "*",
      preserveStructure: false
    },
    patterns: {
      // All PII
      email: { enabled: true, strategy: "token" },
      phone: { enabled: true, strategy: "token" },
      ssn: { enabled: true, strategy: "token" },
      name: { enabled: true, strategy: "token" },
      // All Financial
      creditCard: { enabled: true, strategy: "token" },
      creditCardLast4: { enabled: true, strategy: "token" },
      // All System
      uuid: { enabled: true, strategy: "token" },
      filePath: { enabled: true, strategy: "token" },
      ipv4: { enabled: true, strategy: "token" },
      ipv6: { enabled: true, strategy: "token" },
      macAddress: { enabled: true, strategy: "token" },
      hostname: { enabled: true, strategy: "token" },
      // Business
      ticketNumber: { enabled: true, strategy: "token" }
    },
    scenarios: {
      authHeader: { enabled: true, strategy: "token" },
      password: { enabled: true, strategy: "token" },
      apiKey: { enabled: true, strategy: "token" },
      connectionString: { enabled: true, strategy: "token" },
      privateKey: { enabled: true, strategy: "token" },
      awsCredentials: { enabled: true, strategy: "token" }
    }
  },
  /**
   * Minimal Preset
   * Basic PII protection - only email and phone
   */
  minimal: {
    formatOptions: {
      tokenFormat: "[{TYPE}_{INDEX}]",
      maskChar: "*",
      preserveStructure: true
    },
    patterns: {
      email: { enabled: true, strategy: "token" },
      phone: { enabled: true, strategy: "token" },
      ssn: { enabled: false, strategy: "token" },
      name: { enabled: false, strategy: "token" },
      creditCard: { enabled: false, strategy: "token" },
      creditCardLast4: { enabled: false, strategy: "token" },
      uuid: { enabled: false, strategy: "token" },
      filePath: { enabled: false, strategy: "token" },
      ipv4: { enabled: false, strategy: "token" },
      ipv6: { enabled: false, strategy: "token" },
      macAddress: { enabled: false, strategy: "token" },
      hostname: { enabled: false, strategy: "token" },
      ticketNumber: { enabled: false, strategy: "token" }
    },
    scenarios: {
      authHeader: { enabled: false, strategy: "token" },
      password: { enabled: false, strategy: "token" },
      apiKey: { enabled: false, strategy: "token" },
      connectionString: { enabled: false, strategy: "token" },
      privateKey: { enabled: false, strategy: "token" },
      awsCredentials: { enabled: false, strategy: "token" }
    }
  },
  /**
   * Logs Preset
   * Optimized for log file redaction
   * Uses format-preserving for IPs/hostnames to maintain log readability
   */
  logs: {
    formatOptions: {
      tokenFormat: "[{TYPE}_{INDEX}]",
      maskChar: "*",
      preserveStructure: true
    },
    patterns: {
      email: { enabled: true, strategy: "token" },
      phone: { enabled: false, strategy: "token" },
      ssn: { enabled: false, strategy: "token" },
      name: { enabled: false, strategy: "token" },
      creditCard: { enabled: false, strategy: "token" },
      creditCardLast4: { enabled: false, strategy: "token" },
      uuid: { enabled: true, strategy: "token" },
      filePath: { enabled: true, strategy: "token" },
      ipv4: { enabled: true, strategy: "formatPreserving" },
      ipv6: { enabled: true, strategy: "formatPreserving" },
      macAddress: { enabled: true, strategy: "formatPreserving" },
      hostname: { enabled: true, strategy: "formatPreserving" },
      ticketNumber: { enabled: true, strategy: "token" }
    },
    scenarios: {
      authHeader: { enabled: true, strategy: "token" },
      password: { enabled: true, strategy: "token" },
      apiKey: { enabled: true, strategy: "token" },
      connectionString: { enabled: true, strategy: "token" },
      privateKey: { enabled: true, strategy: "token" },
      awsCredentials: { enabled: true, strategy: "token" }
    }
  },
  /**
   * Financial Preset
   * Focus on financial data protection
   */
  financial: {
    formatOptions: {
      tokenFormat: "[{TYPE}_{INDEX}]",
      maskChar: "*",
      preserveStructure: true
    },
    patterns: {
      email: { enabled: true, strategy: "token" },
      phone: { enabled: true, strategy: "token" },
      ssn: { enabled: true, strategy: "token" },
      name: { enabled: true, strategy: "token" },
      creditCard: { enabled: true, strategy: "mask" },
      creditCardLast4: { enabled: true, strategy: "token" },
      uuid: { enabled: false, strategy: "token" },
      filePath: { enabled: false, strategy: "token" },
      ipv4: { enabled: false, strategy: "token" },
      ipv6: { enabled: false, strategy: "token" },
      macAddress: { enabled: false, strategy: "token" },
      hostname: { enabled: false, strategy: "token" },
      ticketNumber: { enabled: true, strategy: "token" }
    },
    scenarios: {
      authHeader: { enabled: false, strategy: "token" },
      password: { enabled: false, strategy: "token" },
      apiKey: { enabled: false, strategy: "token" },
      connectionString: { enabled: false, strategy: "token" },
      privateKey: { enabled: false, strategy: "token" },
      awsCredentials: { enabled: false, strategy: "token" }
    }
  },
  /**
   * Healthcare Preset
   * HIPAA-focused protection
   */
  healthcare: {
    formatOptions: {
      tokenFormat: "[PHI_{TYPE}_{INDEX}]",
      maskChar: "*",
      preserveStructure: false
    },
    patterns: {
      email: { enabled: true, strategy: "token" },
      phone: { enabled: true, strategy: "token" },
      ssn: { enabled: true, strategy: "token" },
      name: { enabled: true, strategy: "token" },
      creditCard: { enabled: true, strategy: "token" },
      creditCardLast4: { enabled: true, strategy: "token" },
      uuid: { enabled: true, strategy: "token" },
      filePath: { enabled: true, strategy: "token" },
      ipv4: { enabled: true, strategy: "token" },
      ipv6: { enabled: true, strategy: "token" },
      macAddress: { enabled: true, strategy: "token" },
      hostname: { enabled: true, strategy: "token" },
      ticketNumber: { enabled: true, strategy: "token" }
    },
    scenarios: {
      authHeader: { enabled: true, strategy: "token" },
      password: { enabled: true, strategy: "token" },
      apiKey: { enabled: true, strategy: "token" },
      connectionString: { enabled: true, strategy: "token" },
      privateKey: { enabled: true, strategy: "token" },
      awsCredentials: { enabled: true, strategy: "token" }
    }
  }
};
function getPreset(name) {
  const preset = PRESETS[name];
  return JSON.parse(JSON.stringify(preset));
}
function getPresetNames() {
  return Object.keys(PRESETS);
}
function hasPreset(name) {
  return name in PRESETS;
}

// packages/core/src/regex-builder/tokenizer.ts
var TokenType = /* @__PURE__ */ ((TokenType3) => {
  TokenType3["DIGIT"] = "DIGIT";
  TokenType3["LOWER"] = "LOWER";
  TokenType3["UPPER"] = "UPPER";
  TokenType3["HEX_LOWER"] = "HEX_LOWER";
  TokenType3["HEX_UPPER"] = "HEX_UPPER";
  TokenType3["WHITESPACE"] = "WHITESPACE";
  TokenType3["NEWLINE"] = "NEWLINE";
  TokenType3["SPECIAL"] = "SPECIAL";
  return TokenType3;
})(TokenType || {});
function classifyChar(char) {
  if (/\d/.test(char)) return "DIGIT" /* DIGIT */;
  if (/[a-f]/.test(char)) return "HEX_LOWER" /* HEX_LOWER */;
  if (/[A-F]/.test(char)) return "HEX_UPPER" /* HEX_UPPER */;
  if (/[a-z]/.test(char)) return "LOWER" /* LOWER */;
  if (/[A-Z]/.test(char)) return "UPPER" /* UPPER */;
  if (/[\r\n]/.test(char)) return "NEWLINE" /* NEWLINE */;
  if (/\s/.test(char)) return "WHITESPACE" /* WHITESPACE */;
  return "SPECIAL" /* SPECIAL */;
}
function canMerge(type1, type2) {
  if (type1 === type2) return true;
  if ((type1 === "DIGIT" /* DIGIT */ || type1 === "HEX_LOWER" /* HEX_LOWER */ || type1 === "HEX_UPPER" /* HEX_UPPER */) && (type2 === "DIGIT" /* DIGIT */ || type2 === "HEX_LOWER" /* HEX_LOWER */ || type2 === "HEX_UPPER" /* HEX_UPPER */)) {
    return true;
  }
  if (type1 === "HEX_LOWER" /* HEX_LOWER */ && type2 === "LOWER" /* LOWER */ || type1 === "LOWER" /* LOWER */ && type2 === "HEX_LOWER" /* HEX_LOWER */) {
    return true;
  }
  if (type1 === "HEX_UPPER" /* HEX_UPPER */ && type2 === "UPPER" /* UPPER */ || type1 === "UPPER" /* UPPER */ && type2 === "HEX_UPPER" /* HEX_UPPER */) {
    return true;
  }
  return false;
}
function getMergedType(type1, type2) {
  if (type1 === type2) return type1;
  const hexTypes = ["DIGIT" /* DIGIT */, "HEX_LOWER" /* HEX_LOWER */, "HEX_UPPER" /* HEX_UPPER */];
  if (hexTypes.includes(type1) && hexTypes.includes(type2)) {
    if (type1 === "HEX_LOWER" /* HEX_LOWER */ || type2 === "HEX_LOWER" /* HEX_LOWER */) {
      return "HEX_LOWER" /* HEX_LOWER */;
    }
    if (type1 === "HEX_UPPER" /* HEX_UPPER */ || type2 === "HEX_UPPER" /* HEX_UPPER */) {
      return "HEX_UPPER" /* HEX_UPPER */;
    }
    return "DIGIT" /* DIGIT */;
  }
  if ((type1 === "HEX_LOWER" /* HEX_LOWER */ || type1 === "LOWER" /* LOWER */) && (type2 === "HEX_LOWER" /* HEX_LOWER */ || type2 === "LOWER" /* LOWER */)) {
    return "LOWER" /* LOWER */;
  }
  if ((type1 === "HEX_UPPER" /* HEX_UPPER */ || type1 === "UPPER" /* UPPER */) && (type2 === "HEX_UPPER" /* HEX_UPPER */ || type2 === "UPPER" /* UPPER */)) {
    return "UPPER" /* UPPER */;
  }
  return type1;
}
function tokenize(input) {
  if (!input) return [];
  const tokens = [];
  let pos = 0;
  while (pos < input.length) {
    const char = input[pos];
    const charType = classifyChar(char);
    if (tokens.length > 0) {
      const lastToken = tokens[tokens.length - 1];
      if (charType !== "SPECIAL" /* SPECIAL */ && lastToken.type !== "SPECIAL" /* SPECIAL */) {
        if (canMerge(lastToken.type, charType)) {
          lastToken.value += char;
          lastToken.length++;
          lastToken.type = getMergedType(lastToken.type, charType);
          pos++;
          continue;
        }
      }
    }
    tokens.push({
      type: charType,
      value: char,
      position: pos,
      length: 1
    });
    pos++;
  }
  return tokens;
}

// packages/core/src/regex-builder/pattern-detector.ts
var KNOWN_PATTERNS = [
  {
    name: "UUID",
    type: "uuid",
    test: (tokens) => {
      if (tokens.length !== 9) return false;
      const lengths = [8, 1, 4, 1, 4, 1, 4, 1, 12];
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === "SPECIAL" /* SPECIAL */ && t.value === "-";
        return (t.type === "HEX_LOWER" /* HEX_LOWER */ || t.type === "HEX_UPPER" /* HEX_UPPER */ || t.type === "DIGIT" /* DIGIT */) && t.length === lengths[i];
      });
    },
    toRegex: () => "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
  },
  {
    name: "IPv4",
    type: "ipv4",
    test: (tokens) => {
      if (tokens.length !== 7) return false;
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === "SPECIAL" /* SPECIAL */ && t.value === ".";
        return t.type === "DIGIT" /* DIGIT */ && t.length >= 1 && t.length <= 3;
      });
    },
    toRegex: () => "(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"
  },
  {
    name: "MAC Address (colon)",
    type: "mac",
    test: (tokens) => {
      if (tokens.length !== 11) return false;
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === "SPECIAL" /* SPECIAL */ && t.value === ":";
        return (t.type === "HEX_LOWER" /* HEX_LOWER */ || t.type === "HEX_UPPER" /* HEX_UPPER */ || t.type === "DIGIT" /* DIGIT */) && t.length === 2;
      });
    },
    toRegex: () => "[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}"
  },
  {
    name: "MAC Address (dash)",
    type: "mac",
    test: (tokens) => {
      if (tokens.length !== 11) return false;
      return tokens.every((t, i) => {
        if (i % 2 === 1) return t.type === "SPECIAL" /* SPECIAL */ && t.value === "-";
        return (t.type === "HEX_LOWER" /* HEX_LOWER */ || t.type === "HEX_UPPER" /* HEX_UPPER */ || t.type === "DIGIT" /* DIGIT */) && t.length === 2;
      });
    },
    toRegex: () => "[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}-[0-9a-fA-F]{2}"
  }
];
function tokenToRegex(token) {
  const len = token.length;
  switch (token.type) {
    case "DIGIT" /* DIGIT */:
      return {
        regex: len === 1 ? "\\d" : `\\d{${len}}`,
        description: `${len} digit(s)`,
        type: "digit",
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    case "LOWER" /* LOWER */:
      return {
        regex: len === 1 ? "[a-z]" : `[a-z]{${len}}`,
        description: `${len} lowercase letter(s)`,
        type: "lower",
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    case "UPPER" /* UPPER */:
      return {
        regex: len === 1 ? "[A-Z]" : `[A-Z]{${len}}`,
        description: `${len} uppercase letter(s)`,
        type: "upper",
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    case "HEX_LOWER" /* HEX_LOWER */:
      return {
        regex: len === 1 ? "[0-9a-f]" : `[0-9a-f]{${len}}`,
        description: `${len} hex char(s) [0-9a-f]`,
        type: "hex",
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    case "HEX_UPPER" /* HEX_UPPER */:
      return {
        regex: len === 1 ? "[0-9A-F]" : `[0-9A-F]{${len}}`,
        description: `${len} hex char(s) [0-9A-F]`,
        type: "hex",
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    case "WHITESPACE" /* WHITESPACE */:
      return {
        regex: len === 1 ? "\\s" : `\\s{${len}}`,
        description: `${len} whitespace`,
        type: "whitespace",
        isVariable: true,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    case "NEWLINE" /* NEWLINE */:
      return {
        regex: "\\r?\\n",
        description: "newline",
        type: "whitespace",
        isVariable: false,
        minLength: 1,
        maxLength: 2,
        originalValue: token.value
      };
    case "SPECIAL" /* SPECIAL */:
      const escaped = token.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return {
        regex: escaped,
        description: `literal "${token.value}"`,
        type: "literal",
        isVariable: false,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
    default:
      return {
        regex: token.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        description: `literal "${token.value}"`,
        type: "unknown",
        isVariable: false,
        minLength: len,
        maxLength: len,
        originalValue: token.value
      };
  }
}
function detectPatterns(tokens) {
  for (const pattern of KNOWN_PATTERNS) {
    if (pattern.test(tokens)) {
      return [
        {
          regex: pattern.toRegex(tokens),
          description: pattern.name,
          type: pattern.type,
          isVariable: true,
          minLength: tokens.reduce((sum, t) => sum + t.length, 0),
          maxLength: tokens.reduce((sum, t) => sum + t.length, 0),
          originalValue: tokens.map((t) => t.value).join("")
        }
      ];
    }
  }
  return tokens.map(tokenToRegex);
}
function mergeAdjacentPatterns(segments) {
  if (segments.length <= 1) return segments;
  const merged = [];
  for (const segment of segments) {
    if (merged.length === 0) {
      merged.push({ ...segment });
      continue;
    }
    const last = merged[merged.length - 1];
    const alphaPattern = /^\[([a-zA-Z0-9-]+)\](?:\{(\d+)\})?$/;
    const digitPattern = /^\\d(?:\{(\d+)\})?$/;
    const lastMatch = last.regex.match(alphaPattern);
    const currMatch = segment.regex.match(alphaPattern);
    if (lastMatch && currMatch && lastMatch[1] === currMatch[1]) {
      const lastCount = lastMatch[2] ? parseInt(lastMatch[2]) : 1;
      const currCount = currMatch[2] ? parseInt(currMatch[2]) : 1;
      const total = lastCount + currCount;
      last.regex = `[${lastMatch[1]}]{${total}}`;
      last.maxLength = total;
      last.minLength = total;
      last.description = `${total} char(s) [${lastMatch[1]}]`;
      last.originalValue += segment.originalValue;
      continue;
    }
    const lastDigit = last.regex.match(digitPattern);
    const currDigit = segment.regex.match(digitPattern);
    if (lastDigit && currDigit) {
      const lastCount = lastDigit[1] ? parseInt(lastDigit[1]) : 1;
      const currCount = currDigit[1] ? parseInt(currDigit[1]) : 1;
      const total = lastCount + currCount;
      last.regex = `\\d{${total}}`;
      last.maxLength = total;
      last.minLength = total;
      last.description = `${total} digit(s)`;
      last.originalValue += segment.originalValue;
      continue;
    }
    merged.push({ ...segment });
  }
  return merged;
}

// packages/core/src/regex-builder/optimizer.ts
var OPTIMIZATIONS = [
  // Combine adjacent identical character classes
  {
    name: "Combine adjacent digits",
    pattern: /\\d\{(\d+)\}\\d\{(\d+)\}/g,
    replacement: (_, a, b) => `\\d{${parseInt(a) + parseInt(b)}}`
  },
  {
    name: "Combine single and counted digits",
    pattern: /\\d\\d\{(\d+)\}/g,
    replacement: (_, n) => `\\d{${parseInt(n) + 1}}`
  },
  {
    name: "Combine counted and single digits",
    pattern: /\\d\{(\d+)\}\\d(?!\{)/g,
    replacement: (_, n) => `\\d{${parseInt(n) + 1}}`
  },
  {
    name: "Combine two single digits",
    pattern: /\\d\\d(?!\{|\d)/g,
    replacement: "\\d{2}"
  },
  // Simplify single-count quantifiers
  {
    name: "Remove {1} quantifier",
    pattern: /\{1\}/g,
    replacement: ""
  },
  // Combine whitespace
  {
    name: "Combine adjacent whitespace",
    pattern: /\\s\{(\d+)\}\\s\{(\d+)\}/g,
    replacement: (_, a, b) => `\\s{${parseInt(a) + parseInt(b)}}`
  },
  // Simplify alternation with common prefix/suffix
  // This is more complex and would require AST parsing
  // Combine character class ranges
  {
    name: "Combine [a-z] classes",
    pattern: /\[a-z\]\{(\d+)\}\[a-z\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[a-z]{${parseInt(a) + parseInt(b)}}`
  },
  {
    name: "Combine [A-Z] classes",
    pattern: /\[A-Z\]\{(\d+)\}\[A-Z\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[A-Z]{${parseInt(a) + parseInt(b)}}`
  },
  {
    name: "Combine [0-9a-f] classes",
    pattern: /\[0-9a-f\]\{(\d+)\}\[0-9a-f\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[0-9a-f]{${parseInt(a) + parseInt(b)}}`
  },
  {
    name: "Combine [0-9A-F] classes",
    pattern: /\[0-9A-F\]\{(\d+)\}\[0-9A-F\]\{(\d+)\}/g,
    replacement: (_, a, b) => `[0-9A-F]{${parseInt(a) + parseInt(b)}}`
  }
];
function optimizeRegex(regex) {
  let optimized = regex;
  let changed = true;
  let iterations = 0;
  const maxIterations = 10;
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    for (const rule of OPTIMIZATIONS) {
      const before = optimized;
      optimized = optimized.replace(rule.pattern, rule.replacement);
      if (before !== optimized) {
        changed = true;
      }
    }
  }
  return optimized;
}
function buildRegex(segments) {
  const raw = segments.map((s) => s.regex).join("");
  return optimizeRegex(raw);
}
function addWordBoundaries(regex, addBoundaries = true) {
  if (!addBoundaries) return regex;
  const startsWithWord = /^(?:\\d|\\w|\[[a-zA-Z0-9]|[a-zA-Z0-9_])/.test(regex);
  const endsWithWord = /(?:\\d|\\w|[a-zA-Z0-9_]|\[[a-zA-Z0-9][^\]]*\]|\{[0-9]+\})$/.test(regex);
  let result = regex;
  if (startsWithWord) result = "\\b" + result;
  if (endsWithWord) result = result + "\\b";
  return result;
}
function validateRegex(regex, sample) {
  try {
    const re = new RegExp(regex);
    const matches = re.test(sample);
    return { valid: true, matches };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid regex",
      matches: false
    };
  }
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function analyzePattern(regex) {
  const warnings = [];
  if (regex.length < 3) {
    warnings.push("Pattern is very short and may match too broadly");
  }
  if (/^\.\*$|^\.\+$/.test(regex)) {
    warnings.push("Pattern matches any text - too broad");
  }
  if (/(?<!\\)[*+]/.test(regex) && !/\\b|^\^|\$$/.test(regex)) {
    warnings.push("Unbounded repetition without anchors may match too much");
  }
  if (/\.\*|\.\+/.test(regex)) {
    warnings.push("Using .* or .+ matches almost anything");
  }
  if (/^(?:\\d|\[[\w-]+\]|\\w|\\s)$/.test(regex)) {
    warnings.push("Pattern only matches single characters");
  }
  return warnings;
}

// packages/core/src/regex-builder/index.ts
function generateFromSample(sample, options = {}) {
  const {
    addWordBoundaries: withBoundaries = true,
    caseInsensitive = false,
    permissive = false
  } = options;
  if (!sample || sample.trim().length === 0) {
    return {
      regex: "",
      valid: false,
      matchesSample: false,
      warnings: ["Empty sample provided"],
      segments: [],
      suggestedName: "empty",
      error: "Sample cannot be empty"
    };
  }
  const tokens = tokenize(sample);
  let segments = detectPatterns(tokens);
  segments = mergeAdjacentPatterns(segments);
  let regex = buildRegex(segments);
  if (withBoundaries) {
    regex = addWordBoundaries(regex, true);
  }
  const validation = validateRegex(regex, sample);
  const warnings = analyzePattern(regex);
  const suggestedName = generatePatternName(segments, sample);
  return {
    regex,
    valid: validation.valid,
    matchesSample: validation.matches,
    warnings,
    segments,
    suggestedName,
    error: validation.error
  };
}
function generatePatternName(segments, sample) {
  const patternTypes = segments.map((s) => s.type).filter((t) => t !== "literal" && t !== "unknown");
  if (patternTypes.includes("uuid")) return "uuid-pattern";
  if (patternTypes.includes("ipv4")) return "ipv4-pattern";
  if (patternTypes.includes("mac")) return "mac-address-pattern";
  if (patternTypes.includes("hex")) return "hex-pattern";
  if (/^\d{3}-\d{2}-\d{4}$/.test(sample)) return "ssn-pattern";
  if (/^\d{3}-\d{3}-\d{4}$/.test(sample)) return "phone-pattern";
  if (/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(sample)) return "card-pattern";
  if (/^[A-Z]{2}\d{6}$/.test(sample)) return "license-pattern";
  const hasDigits = segments.some((s) => s.type === "digit");
  const hasLetters = segments.some(
    (s) => s.type === "lower" || s.type === "upper"
  );
  const hasSpecial = segments.some((s) => s.type === "literal");
  if (hasDigits && hasLetters && hasSpecial) return "alphanumeric-mixed-pattern";
  if (hasDigits && hasLetters) return "alphanumeric-pattern";
  if (hasDigits) return "numeric-pattern";
  if (hasLetters) return "text-pattern";
  return "custom-pattern";
}
function testPattern(regex, samples) {
  try {
    const re = new RegExp(regex);
    return samples.map((sample) => {
      const match = sample.match(re);
      return {
        sample,
        matches: match !== null,
        matchedText: match?.[0]
      };
    });
  } catch {
    return samples.map((sample) => ({
      sample,
      matches: false
    }));
  }
}
function refineFromSamples(samples, options = {}) {
  if (samples.length === 0) {
    return generateFromSample("", options);
  }
  if (samples.length === 1) {
    return generateFromSample(samples[0], options);
  }
  const patterns = samples.map(
    (s) => generateFromSample(s, { ...options, addWordBoundaries: false })
  );
  const allValid = patterns.every((p) => p.valid);
  if (!allValid) {
    return generateFromSample(samples[0], options);
  }
  const firstSegments = patterns[0].segments;
  const sameStructure = patterns.every(
    (p) => p.segments.length === firstSegments.length && p.segments.every((seg, i) => seg.type === firstSegments[i].type)
  );
  if (sameStructure) {
    return generateFromSample(samples[0], options);
  }
  const regexes = patterns.map((p) => `(?:${p.regex.replace(/^\\b|\\b$/g, "")})`);
  const combinedRegex = regexes.join("|");
  const validation = validateRegex(combinedRegex, samples[0]);
  const warnings = analyzePattern(combinedRegex);
  warnings.push("Pattern combines multiple sample structures using alternation");
  return {
    regex: options.addWordBoundaries !== false ? addWordBoundaries(combinedRegex, true) : combinedRegex,
    valid: validation.valid,
    matchesSample: samples.every((s) => new RegExp(combinedRegex).test(s)),
    warnings,
    segments: patterns[0].segments,
    suggestedName: "multi-sample-pattern",
    error: validation.error
  };
}
export {
  AWSCredentialsScenario,
  ApiKeyScenario,
  AuthorizationHeaderScenario,
  BasePattern,
  BaseScenario,
  ConfigLoader,
  ConnectionStringScenario,
  CreditCardLast4Pattern,
  CreditCardPattern,
  DEFAULT_CONFIG,
  DataRedactor,
  EmailPattern,
  FilePathPattern,
  FormatPreservingStrategy,
  HostnamePattern,
  IPv4Pattern,
  IPv6Pattern,
  MACAddressPattern,
  MaskStrategy,
  NamePattern,
  PRESETS,
  PasswordScenario,
  PhonePattern,
  PrivateKeyScenario,
  RedactionContext,
  SSNPattern,
  TicketNumberPattern,
  TokenStrategy,
  TokenType,
  UUIDPattern,
  addWordBoundaries,
  analyzePattern,
  buildRegex,
  detectPatterns,
  escapeRegex,
  generateFromSample,
  getPreset,
  getPresetNames,
  hasPreset,
  mergeAdjacentPatterns,
  optimizeRegex,
  refineFromSamples,
  testPattern,
  tokenize,
  validateRegex
};
