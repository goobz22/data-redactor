import type { Pattern, Match, RedactionStrategy } from '../types';

export class BasePattern implements Pattern {
  name: string;
  regex: RegExp;
  strategy: RedactionStrategy;
  enabled: boolean;

  constructor(
    name: string,
    regex: RegExp,
    strategy: RedactionStrategy = 'token',
    enabled: boolean = true
  ) {
    this.name = name;
    this.regex = regex;
    this.strategy = strategy;
    this.enabled = enabled;
  }

  test(text: string): boolean {
    return this.regex.test(text);
  }

  findAll(text: string): Match[] {
    if (!this.enabled) return [];

    const matches: Match[] = [];
    const regex = new RegExp(this.regex.source, 'g' + this.regex.flags.replace('g', ''));
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
        type: this.name,
        strategy: this.strategy,
      });
    }

    return matches;
  }

  setStrategy(strategy: RedactionStrategy): void {
    this.strategy = strategy;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}
