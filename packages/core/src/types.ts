export type RedactionStrategy = 'token' | 'mask' | 'formatPreserving';

export interface PatternConfig {
  enabled: boolean;
  strategy: RedactionStrategy;
  regex?: string; // Optional custom regex pattern (if not provided, uses built-in default)
  flags?: string; // Optional regex flags (e.g., 'i' for case-insensitive)
}

export interface CustomPattern {
  name: string;
  regex: string;
  strategy: RedactionStrategy;
  flags?: string;
}

export interface FormatOptions {
  tokenFormat?: string; // Format template for tokens, e.g., "[{TYPE}_{INDEX}]" or "{{{TYPE}-{INDEX}}}"
  maskChar?: string; // Character to use for masking, default "*"
  preserveStructure?: boolean; // For mask strategy, preserve dots/dashes/etc, default true
}

export interface RedactorConfig {
  formatOptions?: FormatOptions;
  customEntities?: {
    companyNames?: string[];
    customerNames?: string[];
    [key: string]: string[] | undefined;
  };
  patterns?: {
    ipv4?: PatternConfig;
    ipv6?: PatternConfig;
    macAddress?: PatternConfig;
    email?: PatternConfig;
    phone?: PatternConfig;
    ssn?: PatternConfig;
    creditCard?: PatternConfig;
    creditCardLast4?: PatternConfig;
    hostname?: PatternConfig;
    ticketNumber?: PatternConfig;
    name?: PatternConfig;
    custom?: CustomPattern[];
  };
  testData?: string; // Optional test data for UI testing
}

export interface Match {
  value: string;
  start: number;
  end: number;
  type: string;
  strategy: RedactionStrategy;
}

export interface RedactionResult {
  redactedText: string;
  mapping: Record<string, string>;
  matches: Match[];
}

export interface Pattern {
  name: string;
  regex: RegExp;
  strategy: RedactionStrategy;
  enabled: boolean;
  test: (text: string) => boolean;
  findAll: (text: string) => Match[];
}
