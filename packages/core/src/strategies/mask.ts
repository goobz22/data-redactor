import type { IRedactionStrategy } from './base';
import type { FormatOptions } from '../types';

export class MaskStrategy implements IRedactionStrategy {
  private maskChar: string;
  private preserveStructure: boolean;

  constructor(formatOptions?: FormatOptions) {
    this.maskChar = formatOptions?.maskChar || '*';
    this.preserveStructure = formatOptions?.preserveStructure !== false; // Default true
  }

  redact(value: string, type: string, counter: number): string {
    if (!this.preserveStructure) {
      // Simple mask: replace all characters with mask character
      return this.maskChar.repeat(value.length);
    }

    // Preserve structure: maintain special characters, mask alphanumerics
    return value.replace(/[a-zA-Z0-9]/g, this.maskChar);
  }
}
