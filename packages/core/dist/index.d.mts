type RedactionStrategy = 'token' | 'mask' | 'formatPreserving';
interface PatternConfig {
    enabled: boolean;
    strategy: RedactionStrategy;
    regex?: string;
    flags?: string;
}
interface CustomPattern {
    name: string;
    regex: string;
    strategy: RedactionStrategy;
    flags?: string;
}
interface FormatOptions {
    tokenFormat?: string;
    maskChar?: string;
    preserveStructure?: boolean;
}
interface RedactorConfig {
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
    testData?: string;
}
interface Match {
    value: string;
    start: number;
    end: number;
    type: string;
    strategy: RedactionStrategy;
}
interface RedactionResult {
    redactedText: string;
    mapping: Record<string, string>;
    matches: Match[];
}
interface Pattern {
    name: string;
    regex: RegExp;
    strategy: RedactionStrategy;
    enabled: boolean;
    test: (text: string) => boolean;
    findAll: (text: string) => Match[];
}

declare class DataRedactor {
    private config;
    private patterns;
    private context;
    private strategies;
    constructor(config?: Partial<RedactorConfig> | string);
    private initializePatterns;
    redact(text: string): RedactionResult;
    private removeOverlaps;
    reset(): void;
    getConfig(): RedactorConfig;
    updateConfig(config: Partial<RedactorConfig>): void;
}

declare const DEFAULT_CONFIG: RedactorConfig;
declare class ConfigLoader {
    static loadFromFile(path: string): RedactorConfig;
    static loadFromObject(config: Partial<RedactorConfig>): RedactorConfig;
    static getDefault(): RedactorConfig;
    private static mergeWithDefaults;
    static validateConfig(config: RedactorConfig): {
        valid: boolean;
        errors: string[];
    };
}

declare class BasePattern implements Pattern {
    name: string;
    regex: RegExp;
    strategy: RedactionStrategy;
    enabled: boolean;
    constructor(name: string, regex: RegExp, strategy?: RedactionStrategy, enabled?: boolean);
    test(text: string): boolean;
    findAll(text: string): Match[];
    setStrategy(strategy: RedactionStrategy): void;
    setEnabled(enabled: boolean): void;
}

declare class IPv4Pattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}
declare class IPv6Pattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
    findAll(text: string): Match[];
    private isValidIPv6;
    private expandIPv6;
}
declare class MACAddressPattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}
declare class HostnamePattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}

declare class EmailPattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}
declare class PhonePattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}
declare class SSNPattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}
declare class NamePattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}

declare class CreditCardPattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}
declare class CreditCardLast4Pattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}

declare class TicketNumberPattern extends BasePattern {
    constructor(strategy?: RedactionStrategy, enabled?: boolean);
}

interface IRedactionStrategy {
    redact(value: string, type: string, counter: number): string;
}
declare class RedactionContext {
    private valueMap;
    private counters;
    getOrCreateRedaction(value: string, type: string, strategy: IRedactionStrategy): string;
    getMapping(): Record<string, string>;
    clear(): void;
}

declare class TokenStrategy implements IRedactionStrategy {
    private tokenFormat;
    constructor(formatOptions?: FormatOptions);
    redact(value: string, type: string, counter: number): string;
}

declare class MaskStrategy implements IRedactionStrategy {
    private maskChar;
    private preserveStructure;
    constructor(formatOptions?: FormatOptions);
    redact(value: string, type: string, counter: number): string;
}

declare class FormatPreservingStrategy implements IRedactionStrategy {
    private seed;
    constructor(formatOptions?: FormatOptions);
    redact(value: string, type: string, counter: number): string;
    private hashString;
    private seededRandom;
    private generateIPv4;
    private generateMAC;
    private generateEmail;
    private generatePhone;
    private generateSSN;
    private generateCreditCard;
    private generateHostname;
    private generateRandomString;
}

export { BasePattern, ConfigLoader, CreditCardLast4Pattern, CreditCardPattern, type CustomPattern, DEFAULT_CONFIG, DataRedactor, EmailPattern, type FormatOptions, FormatPreservingStrategy, HostnamePattern, IPv4Pattern, IPv6Pattern, type IRedactionStrategy, MACAddressPattern, MaskStrategy, type Match, NamePattern, type Pattern, type PatternConfig, PhonePattern, RedactionContext, type RedactionResult, type RedactionStrategy, type RedactorConfig, SSNPattern, TicketNumberPattern, TokenStrategy };
