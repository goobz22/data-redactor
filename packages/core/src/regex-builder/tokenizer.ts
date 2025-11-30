/**
 * Tokenizer for Regex Builder
 *
 * Breaks down sample text into classified tokens for pattern detection
 */

export enum TokenType {
  DIGIT = 'DIGIT',
  LOWER = 'LOWER',
  UPPER = 'UPPER',
  HEX_LOWER = 'HEX_LOWER',
  HEX_UPPER = 'HEX_UPPER',
  WHITESPACE = 'WHITESPACE',
  NEWLINE = 'NEWLINE',
  SPECIAL = 'SPECIAL',
}

export interface Token {
  type: TokenType
  value: string
  position: number
  length: number
}

/**
 * Classify a single character into a token type
 */
function classifyChar(char: string): TokenType {
  if (/\d/.test(char)) return TokenType.DIGIT
  if (/[a-f]/.test(char)) return TokenType.HEX_LOWER
  if (/[A-F]/.test(char)) return TokenType.HEX_UPPER
  if (/[a-z]/.test(char)) return TokenType.LOWER
  if (/[A-Z]/.test(char)) return TokenType.UPPER
  if (/[\r\n]/.test(char)) return TokenType.NEWLINE
  if (/\s/.test(char)) return TokenType.WHITESPACE
  return TokenType.SPECIAL
}

/**
 * Check if two token types can be merged
 * - Hex chars can be merged with digits
 * - Lower hex can be merged with regular lowercase
 * - Upper hex can be merged with regular uppercase
 */
function canMerge(type1: TokenType, type2: TokenType): boolean {
  // Same type always merges
  if (type1 === type2) return true

  // Hex and digit merge
  if (
    (type1 === TokenType.DIGIT ||
      type1 === TokenType.HEX_LOWER ||
      type1 === TokenType.HEX_UPPER) &&
    (type2 === TokenType.DIGIT ||
      type2 === TokenType.HEX_LOWER ||
      type2 === TokenType.HEX_UPPER)
  ) {
    return true
  }

  // Hex lower and lower merge
  if (
    (type1 === TokenType.HEX_LOWER && type2 === TokenType.LOWER) ||
    (type1 === TokenType.LOWER && type2 === TokenType.HEX_LOWER)
  ) {
    return true
  }

  // Hex upper and upper merge
  if (
    (type1 === TokenType.HEX_UPPER && type2 === TokenType.UPPER) ||
    (type1 === TokenType.UPPER && type2 === TokenType.HEX_UPPER)
  ) {
    return true
  }

  return false
}

/**
 * Get the merged token type when two types are combined
 */
function getMergedType(type1: TokenType, type2: TokenType): TokenType {
  // If same, keep it
  if (type1 === type2) return type1

  // Digit + Hex = HEX (of appropriate case)
  const hexTypes = [TokenType.DIGIT, TokenType.HEX_LOWER, TokenType.HEX_UPPER]
  if (hexTypes.includes(type1) && hexTypes.includes(type2)) {
    // If any is hex lower, result is hex lower (for [0-9a-f])
    if (type1 === TokenType.HEX_LOWER || type2 === TokenType.HEX_LOWER) {
      return TokenType.HEX_LOWER
    }
    if (type1 === TokenType.HEX_UPPER || type2 === TokenType.HEX_UPPER) {
      return TokenType.HEX_UPPER
    }
    return TokenType.DIGIT
  }

  // Hex lower + lower = lower
  if (
    (type1 === TokenType.HEX_LOWER || type1 === TokenType.LOWER) &&
    (type2 === TokenType.HEX_LOWER || type2 === TokenType.LOWER)
  ) {
    return TokenType.LOWER
  }

  // Hex upper + upper = upper
  if (
    (type1 === TokenType.HEX_UPPER || type1 === TokenType.UPPER) &&
    (type2 === TokenType.HEX_UPPER || type2 === TokenType.UPPER)
  ) {
    return TokenType.UPPER
  }

  return type1
}

/**
 * Tokenize input string into classified tokens
 * Adjacent characters of compatible types are merged
 */
export function tokenize(input: string): Token[] {
  if (!input) return []

  const tokens: Token[] = []
  let pos = 0

  while (pos < input.length) {
    const char = input[pos]
    const charType = classifyChar(char)

    // Check if we can merge with the last token
    if (tokens.length > 0) {
      const lastToken = tokens[tokens.length - 1]

      // Special chars never merge (they're literal delimiters)
      if (
        charType !== TokenType.SPECIAL &&
        lastToken.type !== TokenType.SPECIAL
      ) {
        if (canMerge(lastToken.type, charType)) {
          // Merge into last token
          lastToken.value += char
          lastToken.length++
          lastToken.type = getMergedType(lastToken.type, charType)
          pos++
          continue
        }
      }
    }

    // Create new token
    tokens.push({
      type: charType,
      value: char,
      position: pos,
      length: 1,
    })
    pos++
  }

  return tokens
}

/**
 * Get a human-readable description of a token
 */
export function describeToken(token: Token): string {
  switch (token.type) {
    case TokenType.DIGIT:
      return `${token.length} digit(s)`
    case TokenType.LOWER:
      return `${token.length} lowercase letter(s)`
    case TokenType.UPPER:
      return `${token.length} uppercase letter(s)`
    case TokenType.HEX_LOWER:
      return `${token.length} hex char(s) [0-9a-f]`
    case TokenType.HEX_UPPER:
      return `${token.length} hex char(s) [0-9A-F]`
    case TokenType.WHITESPACE:
      return `${token.length} whitespace`
    case TokenType.NEWLINE:
      return 'newline'
    case TokenType.SPECIAL:
      return `literal "${token.value}"`
    default:
      return token.value
  }
}
