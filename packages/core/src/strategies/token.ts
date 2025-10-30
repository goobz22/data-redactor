import type { IRedactionStrategy } from './base';
import type { FormatOptions } from '../types';

export class TokenStrategy implements IRedactionStrategy {
  private tokenFormat: string;

  constructor(formatOptions?: FormatOptions) {
    // Default format: "[{TYPE}_{INDEX}]"
    this.tokenFormat = formatOptions?.tokenFormat || '[{TYPE}_{INDEX}]';
  }

  redact(value: string, type: string, counter: number): string {
    // Convert type to uppercase and snake_case
    const typeUpper = type.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '');

    // Replace placeholders in format template
    return this.tokenFormat
      .replace(/\{TYPE\}/g, typeUpper)
      .replace(/\{INDEX\}/g, counter.toString());
  }
}
