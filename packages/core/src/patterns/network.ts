import { BasePattern } from './base';
import type { RedactionStrategy, Match } from '../types';

export class IPv4Pattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match IPv4 addresses (including CIDR notation)
    // Using lookahead/lookbehind to avoid word boundary issues
    const regex = /(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?(?![0-9])/;
    super('ipv4', regex, strategy, enabled);
  }
}

export class IPv6Pattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Simple regex to match any potential IPv6 address (including compressed forms with ::)
    // We'll validate by expanding :: notation
    const regex = /(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}/;
    super('ipv6', regex, strategy, enabled);
  }

  // Override findAll to expand :: shorthand before validating
  findAll(text: string): Match[] {
    console.log('[IPv6Pattern] findAll called with text:', text.substring(0, 200));
    const matches: Match[] = [];
    const regex = new RegExp(this.regex.source, 'g');
    let match;

    while ((match = regex.exec(text)) !== null) {
      const potential = match[0];
      console.log('[IPv6Pattern] Found potential match:', potential, 'at index:', match.index);

      // Validate by checking if it can be expanded to a valid IPv6
      const isValid = this.isValidIPv6(potential);
      console.log('[IPv6Pattern] isValid:', isValid, 'for:', potential);

      if (isValid) {
        matches.push({
          value: potential,
          start: match.index,
          end: match.index + potential.length,
          type: this.name,
          strategy: this.strategy,
        });
        console.log('[IPv6Pattern] Added valid match:', potential);
      } else {
        console.log('[IPv6Pattern] Rejected invalid match:', potential);
      }
    }

    console.log('[IPv6Pattern] Total valid matches:', matches.length);
    return matches;
  }

  private isValidIPv6(addr: string): boolean {
    console.log('[IPv6Pattern] Validating:', addr);
    // Must contain at least 2 colons and have :: or 7 colons
    const colonCount = (addr.match(/:/g) || []).length;
    console.log('[IPv6Pattern] Colon count:', colonCount);
    if (colonCount < 2) {
      console.log('[IPv6Pattern] Validation failed: too few colons');
      return false;
    }

    // If it has ::, it must have exactly one occurrence
    const doubleColonCount = (addr.match(/::/g) || []).length;
    console.log('[IPv6Pattern] Double colon count:', doubleColonCount);
    if (doubleColonCount > 1) {
      console.log('[IPv6Pattern] Validation failed: multiple ::');
      return false;
    }

    // Try to expand and validate
    try {
      const expanded = this.expandIPv6(addr);
      console.log('[IPv6Pattern] Expanded to:', expanded);
      // Valid IPv6 should have exactly 8 groups when expanded
      const groups = expanded.split(':');
      console.log('[IPv6Pattern] Groups:', groups, 'count:', groups.length);
      if (groups.length !== 8) {
        console.log('[IPv6Pattern] Validation failed: not 8 groups');
        return false;
      }

      // Each group should be valid hex (0-4 digits)
      const allValid = groups.every(g => /^[0-9a-fA-F]{1,4}$/.test(g));
      console.log('[IPv6Pattern] All groups valid hex:', allValid);
      return allValid;
    } catch (e) {
      console.log('[IPv6Pattern] Validation failed with error:', e);
      return false;
    }
  }

  private expandIPv6(addr: string): string {
    console.log('[IPv6Pattern] Expanding:', addr);
    // If no ::, just return as-is if it has 8 groups
    if (!addr.includes('::')) {
      console.log('[IPv6Pattern] No :: found, returning as-is');
      return addr;
    }

    // Split on ::
    const sides = addr.split('::');
    console.log('[IPv6Pattern] Split on ::', sides);
    if (sides.length !== 2) {
      console.log('[IPv6Pattern] Invalid split length:', sides.length);
      return addr;
    }

    const left = sides[0] ? sides[0].split(':') : [];
    const right = sides[1] ? sides[1].split(':') : [];
    console.log('[IPv6Pattern] Left groups:', left, 'Right groups:', right);

    // Calculate how many zero groups we need
    const totalGroups = 8;
    const existingGroups = left.length + right.length;
    const zeroGroups = totalGroups - existingGroups;
    console.log('[IPv6Pattern] Existing groups:', existingGroups, 'Zero groups needed:', zeroGroups);

    // Build expanded address
    const zeros = Array(zeroGroups).fill('0');
    const expanded = [...left, ...zeros, ...right];
    console.log('[IPv6Pattern] Expanded array:', expanded);

    const result = expanded.join(':');
    console.log('[IPv6Pattern] Final expanded result:', result);
    return result;
  }
}

export class MACAddressPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match MAC addresses - must be complete 6-octet addresses
    // Formats: XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX or XXXX.XXXX.XXXX
    const regex = /(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/;
    super('macAddress', regex, strategy, enabled);
  }
}

export class HostnamePattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Match hostnames and domain names
    const regex = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/;
    super('hostname', regex, strategy, enabled);
  }
}
