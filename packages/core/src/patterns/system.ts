import { BasePattern } from './base'
import type { RedactionStrategy } from '../types'

/**
 * UUID Pattern - Matches standard UUID format (8-4-4-4-12 hex digits)
 * Examples: 550e8400-e29b-41d4-a716-446655440000
 */
export class UUIDPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    const regex =
      /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g
    super('uuid', regex, strategy, enabled)
  }
}

/**
 * File Path Pattern - Matches Windows and Unix file paths
 * Windows: C:\Users\name\file.txt, D:\folder\subfolder\
 * Unix: /home/user/file.txt, /var/log/syslog
 */
export class FilePathPattern extends BasePattern {
  constructor(strategy: RedactionStrategy = 'token', enabled: boolean = true) {
    // Windows paths: C:\path\to\file or C:\path\to\folder\
    // Unix paths: /path/to/file (must start with / and have at least one path segment)
    const regex =
      /(?:[A-Za-z]:\\(?:[^\\\/:*?"<>|\r\n]+\\)*[^\\\/:*?"<>|\r\n]*)|(?:\/(?:[^\s\/\0]+\/)+[^\s\/\0]*|\/[^\s\/\0]+)/g
    super('filePath', regex, strategy, enabled)
  }
}
