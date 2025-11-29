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
    custom: []
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
      throw new Error("loadFromFile is only available in Node.js environments. Use loadFromObject instead.");
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
              errors.push(`Custom pattern '${pattern.name}' has invalid strategy: ${pattern.strategy}`);
            }
            try {
              new RegExp(pattern.regex, pattern.flags || "");
            } catch (e) {
              errors.push(`Custom pattern '${pattern.name}' has invalid regex: ${e}`);
            }
          });
        } else {
          const patternConfig = value;
          if (patternConfig && !validStrategies.includes(patternConfig.strategy)) {
            errors.push(`Pattern '${key}' has invalid strategy: ${patternConfig.strategy}`);
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
    const regex = new RegExp(this.regex.source, "g" + this.regex.flags.replace("g", ""));
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
    console.log("[IPv6Pattern] findAll called with text:", text.substring(0, 200));
    const matches = [];
    const regex = new RegExp(this.regex.source, "g");
    let match;
    while ((match = regex.exec(text)) !== null) {
      const potential = match[0];
      console.log("[IPv6Pattern] Found potential match:", potential, "at index:", match.index);
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
    console.log("[IPv6Pattern] Existing groups:", existingGroups, "Zero groups needed:", zeroGroups);
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
    const escapedNames = allNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    escapedNames.sort((a, b) => b.length - a.length);
    const namesPattern = escapedNames.join("|");
    const regex = new RegExp(`\\b(?:${namesPattern})(?:\\s+(?:${namesPattern}))?\\b`, "i");
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

// packages/core/src/engine.ts
var DataRedactor = class {
  config;
  patterns = [];
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
  }
  initializePatterns() {
    const { patterns } = this.config;
    if (!patterns) return;
    if (patterns.ipv4) {
      if (patterns.ipv4.regex) {
        const regex = new RegExp(patterns.ipv4.regex, patterns.ipv4.flags || "");
        this.patterns.push(
          new BasePattern("ipv4", regex, patterns.ipv4.strategy, patterns.ipv4.enabled)
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
          new BasePattern("ipv6", regex, patterns.ipv6.strategy, patterns.ipv6.enabled)
        );
      } else {
        this.patterns.push(
          new IPv6Pattern(patterns.ipv6.strategy, patterns.ipv6.enabled)
        );
      }
    }
    if (patterns.macAddress) {
      if (patterns.macAddress.regex) {
        const regex = new RegExp(patterns.macAddress.regex, patterns.macAddress.flags || "");
        this.patterns.push(
          new BasePattern("macAddress", regex, patterns.macAddress.strategy, patterns.macAddress.enabled)
        );
      } else {
        this.patterns.push(
          new MACAddressPattern(patterns.macAddress.strategy, patterns.macAddress.enabled)
        );
      }
    }
    if (patterns.email) {
      if (patterns.email.regex) {
        const regex = new RegExp(patterns.email.regex, patterns.email.flags || "");
        this.patterns.push(
          new BasePattern("email", regex, patterns.email.strategy, patterns.email.enabled)
        );
      } else {
        this.patterns.push(
          new EmailPattern(patterns.email.strategy, patterns.email.enabled)
        );
      }
    }
    if (patterns.phone) {
      if (patterns.phone.regex) {
        const regex = new RegExp(patterns.phone.regex, patterns.phone.flags || "");
        this.patterns.push(
          new BasePattern("phone", regex, patterns.phone.strategy, patterns.phone.enabled)
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
          new BasePattern("ssn", regex, patterns.ssn.strategy, patterns.ssn.enabled)
        );
      } else {
        this.patterns.push(
          new SSNPattern(patterns.ssn.strategy, patterns.ssn.enabled)
        );
      }
    }
    if (patterns.creditCard) {
      if (patterns.creditCard.regex) {
        const regex = new RegExp(patterns.creditCard.regex, patterns.creditCard.flags || "");
        this.patterns.push(
          new BasePattern("creditCard", regex, patterns.creditCard.strategy, patterns.creditCard.enabled)
        );
      } else {
        this.patterns.push(
          new CreditCardPattern(patterns.creditCard.strategy, patterns.creditCard.enabled)
        );
      }
    }
    if (patterns.creditCardLast4) {
      if (patterns.creditCardLast4.regex) {
        const regex = new RegExp(patterns.creditCardLast4.regex, patterns.creditCardLast4.flags || "");
        this.patterns.push(
          new BasePattern("creditCardLast4", regex, patterns.creditCardLast4.strategy, patterns.creditCardLast4.enabled)
        );
      } else {
        this.patterns.push(
          new CreditCardLast4Pattern(patterns.creditCardLast4.strategy, patterns.creditCardLast4.enabled)
        );
      }
    }
    if (patterns.hostname) {
      if (patterns.hostname.regex) {
        const regex = new RegExp(patterns.hostname.regex, patterns.hostname.flags || "");
        this.patterns.push(
          new BasePattern("hostname", regex, patterns.hostname.strategy, patterns.hostname.enabled)
        );
      } else {
        this.patterns.push(
          new HostnamePattern(patterns.hostname.strategy, patterns.hostname.enabled)
        );
      }
    }
    if (patterns.ticketNumber) {
      if (patterns.ticketNumber.regex) {
        const regex = new RegExp(patterns.ticketNumber.regex, patterns.ticketNumber.flags || "");
        this.patterns.push(
          new BasePattern("ticketNumber", regex, patterns.ticketNumber.strategy, patterns.ticketNumber.enabled)
        );
      } else {
        this.patterns.push(
          new TicketNumberPattern(patterns.ticketNumber.strategy, patterns.ticketNumber.enabled)
        );
      }
    }
    if (patterns.name) {
      if (patterns.name.regex) {
        const regex = new RegExp(patterns.name.regex, patterns.name.flags || "");
        this.patterns.push(
          new BasePattern("name", regex, patterns.name.strategy, patterns.name.enabled)
        );
      } else {
        this.patterns.push(
          new NamePattern(patterns.name.strategy, patterns.name.enabled)
        );
      }
    }
    if (patterns.custom) {
      patterns.custom.forEach((customPattern) => {
        const regex = new RegExp(customPattern.regex, customPattern.flags || "");
        this.patterns.push(
          new BasePattern(customPattern.name, regex, customPattern.strategy, true)
        );
      });
    }
    if (this.config.customEntities) {
      Object.entries(this.config.customEntities).forEach(([type, values]) => {
        if (values && values.length > 0) {
          const escapedValues = values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
          const regex = new RegExp(`\\b(${escapedValues.join("|")})\\b`, "gi");
          this.patterns.push(
            new BasePattern(type, regex, "token", true)
          );
        }
      });
    }
  }
  redact(text) {
    console.log("[DataRedactor] redact() called with text:", text.substring(0, 200));
    console.log("[DataRedactor] Number of patterns:", this.patterns.length);
    const allMatches = [];
    this.patterns.forEach((pattern) => {
      console.log("[DataRedactor] Checking pattern:", pattern.name, "enabled:", pattern.enabled);
      if (pattern.enabled) {
        const matches = pattern.findAll(text);
        console.log("[DataRedactor] Pattern", pattern.name, "found", matches.length, "matches");
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
    this.initializePatterns();
    this.reset();
  }
};
export {
  BasePattern,
  ConfigLoader,
  CreditCardLast4Pattern,
  CreditCardPattern,
  DEFAULT_CONFIG,
  DataRedactor,
  EmailPattern,
  FormatPreservingStrategy,
  HostnamePattern,
  IPv4Pattern,
  IPv6Pattern,
  MACAddressPattern,
  MaskStrategy,
  NamePattern,
  PhonePattern,
  RedactionContext,
  SSNPattern,
  TicketNumberPattern,
  TokenStrategy
};
