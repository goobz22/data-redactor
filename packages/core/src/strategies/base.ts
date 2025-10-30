export interface IRedactionStrategy {
  redact(value: string, type: string, counter: number): string;
}

export class RedactionContext {
  private valueMap: Map<string, string> = new Map();
  private counters: Map<string, number> = new Map();

  getOrCreateRedaction(
    value: string,
    type: string,
    strategy: IRedactionStrategy
  ): string {
    // Check if we've already redacted this exact value
    const key = `${type}:${value}`;
    if (this.valueMap.has(key)) {
      return this.valueMap.get(key)!;
    }

    // Get counter for this type
    const counter = (this.counters.get(type) || 0) + 1;
    this.counters.set(type, counter);

    // Generate redaction
    const redacted = strategy.redact(value, type, counter);
    this.valueMap.set(key, redacted);

    return redacted;
  }

  getMapping(): Record<string, string> {
    const mapping: Record<string, string> = {};
    this.valueMap.forEach((redacted, key) => {
      const [, original] = key.split(':', 2);
      mapping[original] = redacted;
    });
    return mapping;
  }

  clear(): void {
    this.valueMap.clear();
    this.counters.clear();
  }
}
