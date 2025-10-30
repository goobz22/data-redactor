import type { IRedactionStrategy } from './base';
import type { FormatOptions } from '../types';

export class FormatPreservingStrategy implements IRedactionStrategy {
  private seed: number = 12345;

  constructor(formatOptions?: FormatOptions) {
    // FormatPreservingStrategy doesn't use formatOptions currently
    // but accepts it for consistency with other strategies
  }

  redact(value: string, type: string, counter: number): string {
    // Use a deterministic pseudo-random generator seeded with value hash
    const hash = this.hashString(value + counter);

    switch (type) {
      case 'ipv4':
        return this.generateIPv4(hash);
      case 'macAddress':
        return this.generateMAC(hash, value);
      case 'email':
        return this.generateEmail(hash);
      case 'phone':
        return this.generatePhone(hash);
      case 'ssn':
        return this.generateSSN(hash);
      case 'creditCard':
        return this.generateCreditCard(hash);
      case 'hostname':
        return this.generateHostname(hash);
      default:
        return `REDACTED_${counter}`;
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  private generateIPv4(seed: number): string {
    // Generate private IP address (10.x.x.x)
    const octets = [10];
    for (let i = 0; i < 3; i++) {
      octets.push(Math.floor(this.seededRandom(seed + i) * 256));
    }
    return octets.join('.');
  }

  private generateMAC(seed: number, original: string): string {
    // Preserve format (: or - or .)
    let separator = ':';
    if (original.includes('-')) separator = '-';
    else if (original.includes('.')) separator = '.';

    const hex = '0123456789ABCDEF';
    const parts = [];

    if (separator === '.') {
      // XXXX.XXXX.XXXX format
      for (let i = 0; i < 3; i++) {
        let part = '';
        for (let j = 0; j < 4; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 4 + j) * 16)];
        }
        parts.push(part);
      }
      return parts.join('.');
    } else {
      // XX:XX:XX:XX:XX:XX format
      for (let i = 0; i < 6; i++) {
        let part = '';
        for (let j = 0; j < 2; j++) {
          part += hex[Math.floor(this.seededRandom(seed + i * 2 + j) * 16)];
        }
        parts.push(part);
      }
      return parts.join(separator);
    }
  }

  private generateEmail(seed: number): string {
    const userLength = 5 + Math.floor(this.seededRandom(seed) * 8);
    const user = this.generateRandomString(seed, userLength);
    const domains = ['example.com', 'test.com', 'sample.org', 'demo.net'];
    const domain = domains[Math.floor(this.seededRandom(seed + 1000) * domains.length)];
    return `${user}@${domain}`;
  }

  private generatePhone(seed: number): string {
    const area = 200 + Math.floor(this.seededRandom(seed) * 800);
    const exchange = 200 + Math.floor(this.seededRandom(seed + 1) * 800);
    const number = Math.floor(this.seededRandom(seed + 2) * 10000);
    return `${area}-${exchange}-${number.toString().padStart(4, '0')}`;
  }

  private generateSSN(seed: number): string {
    const area = 100 + Math.floor(this.seededRandom(seed) * 900);
    const group = 10 + Math.floor(this.seededRandom(seed + 1) * 90);
    const serial = 1000 + Math.floor(this.seededRandom(seed + 2) * 9000);
    return `${area}-${group.toString().padStart(2, '0')}-${serial}`;
  }

  private generateCreditCard(seed: number): string {
    // Generate 16-digit number starting with 4 (Visa-like)
    let card = '4';
    for (let i = 0; i < 15; i++) {
      card += Math.floor(this.seededRandom(seed + i) * 10);
    }
    return card.match(/.{1,4}/g)?.join(' ') || card;
  }

  private generateHostname(seed: number): string {
    const length = 5 + Math.floor(this.seededRandom(seed) * 8);
    const name = this.generateRandomString(seed, length);
    const tlds = ['com', 'net', 'org', 'io'];
    const tld = tlds[Math.floor(this.seededRandom(seed + 1000) * tlds.length)];
    return `${name}.${tld}`;
  }

  private generateRandomString(seed: number, length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(this.seededRandom(seed + i) * chars.length)];
    }
    return result;
  }
}
