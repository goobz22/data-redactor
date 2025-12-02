/**
 * File Extractor - Zero Dependencies
 *
 * Routes file extraction by type, all client-side.
 *
 * Supported formats:
 * - .pdf (text-based only, no OCR)
 * - .docx (Word documents)
 * - .txt, .md, .csv, .json, .html, .xml
 */

import { extractTextFromPDF } from './pdfParser.js'
import { extractTextFromDOCX } from './docxParser.js'

/**
 * Supported file extensions and their MIME types
 */
export const SUPPORTED_FORMATS = {
  // Documents
  pdf: { mime: 'application/pdf', name: 'PDF' },
  docx: {
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    name: 'Word Document',
  },

  // Plain text
  txt: { mime: 'text/plain', name: 'Text File' },
  md: { mime: 'text/markdown', name: 'Markdown' },
  csv: { mime: 'text/csv', name: 'CSV' },

  // Structured
  json: { mime: 'application/json', name: 'JSON' },
  html: { mime: 'text/html', name: 'HTML' },
  htm: { mime: 'text/html', name: 'HTML' },
  xml: { mime: 'application/xml', name: 'XML' },

  // Code (treat as plain text)
  js: { mime: 'text/javascript', name: 'JavaScript' },
  ts: { mime: 'text/typescript', name: 'TypeScript' },
  py: { mime: 'text/x-python', name: 'Python' },
  java: { mime: 'text/x-java', name: 'Java' },
  css: { mime: 'text/css', name: 'CSS' },
  sql: { mime: 'text/x-sql', name: 'SQL' },
  log: { mime: 'text/plain', name: 'Log File' },
}

/**
 * Get file extension from filename
 */
function getExtension(filename) {
  const parts = filename.toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

/**
 * Check if a file format is supported
 * @param {File} file
 * @returns {boolean}
 */
export function isSupported(file) {
  const ext = getExtension(file.name)
  return ext in SUPPORTED_FORMATS
}

/**
 * Get list of supported extensions as string
 * @returns {string}
 */
export function getSupportedExtensions() {
  return Object.keys(SUPPORTED_FORMATS)
    .map(ext => `.${ext}`)
    .join(', ')
}

/**
 * Extract text from a file
 * @param {File} file - The file to extract text from
 * @returns {Promise<{text: string, filename: string, format: string, error?: string, isScanned?: boolean}>}
 */
export async function extractText(file) {
  const ext = getExtension(file.name)
  const format = SUPPORTED_FORMATS[ext]

  if (!format) {
    return {
      text: '',
      filename: file.name,
      format: 'unknown',
      error: `Unsupported file format: .${ext}\n\nSupported formats: ${getSupportedExtensions()}`,
    }
  }

  try {
    let text = ''
    let isScanned = false
    let error = null

    switch (ext) {
      case 'pdf': {
        const pdfResult = await extractFromPDF(file)
        text = pdfResult.text
        isScanned = pdfResult.isScanned
        error = pdfResult.error
        break
      }

      case 'docx': {
        const docxResult = await extractFromDOCX(file)
        text = docxResult.text
        error = docxResult.error
        break
      }

      case 'html':
      case 'htm':
        text = await extractFromHTML(file)
        break

      case 'xml':
        text = await extractFromXML(file)
        break

      case 'json':
        text = await extractFromJSON(file)
        break

      default:
        // Plain text formats
        text = await extractFromText(file)
        break
    }

    return {
      text,
      filename: file.name,
      format: format.name,
      error,
      isScanned,
    }
  } catch (err) {
    return {
      text: '',
      filename: file.name,
      format: format.name,
      error: `Failed to extract text: ${err.message}`,
    }
  }
}

/**
 * Extract text from PDF
 */
async function extractFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  return await extractTextFromPDF(arrayBuffer)
}

/**
 * Extract text from DOCX
 */
async function extractFromDOCX(file) {
  const arrayBuffer = await file.arrayBuffer()
  return await extractTextFromDOCX(arrayBuffer)
}

/**
 * Extract text from plain text file
 */
async function extractFromText(file) {
  return await file.text()
}

/**
 * Extract text from HTML (strip tags)
 */
async function extractFromHTML(file) {
  const html = await file.text()

  // Parse HTML and extract text content
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove script and style elements
  const scripts = doc.querySelectorAll('script, style, noscript')
  scripts.forEach(el => el.remove())

  // Get text content
  let text = doc.body ? doc.body.textContent : doc.documentElement.textContent

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim()

  return text
}

/**
 * Extract text from XML (strip tags, keep content)
 */
async function extractFromXML(file) {
  const xml = await file.text()

  // Simple tag stripping - preserve structure somewhat
  let text = xml
    // Add newlines after closing tags
    .replace(/<\/[^>]+>/g, '$&\n')
    // Remove all tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    // Clean whitespace
    .replace(/^\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return text
}

/**
 * Extract text from JSON (stringify with formatting)
 */
async function extractFromJSON(file) {
  const jsonText = await file.text()

  try {
    // Parse and re-stringify for consistent formatting
    const parsed = JSON.parse(jsonText)

    // If it's an array of objects or nested structure, flatten to readable text
    if (typeof parsed === 'object') {
      return flattenJSON(parsed)
    }

    return String(parsed)
  } catch {
    // If invalid JSON, return as-is
    return jsonText
  }
}

/**
 * Flatten JSON object to readable text
 */
function flattenJSON(obj, prefix = '') {
  let lines = []

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (typeof item === 'object' && item !== null) {
        lines.push(`[${index + 1}]`)
        lines.push(flattenJSON(item, '  '))
      } else {
        lines.push(`[${index + 1}] ${item}`)
      }
    })
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        lines.push(`${prefix}${key}:`)
        lines.push(flattenJSON(value, prefix + '  '))
      } else {
        lines.push(`${prefix}${key}: ${value}`)
      }
    }
  } else {
    lines.push(`${prefix}${obj}`)
  }

  return lines.join('\n')
}

/**
 * Extract text from multiple files
 * @param {FileList|File[]} files
 * @returns {Promise<{text: string, results: Array}>}
 */
export async function extractTextFromMultiple(files) {
  const results = []
  let combinedText = ''

  for (const file of files) {
    const result = await extractText(file)
    results.push(result)

    if (result.text) {
      if (combinedText) {
        combinedText += '\n\n--- ' + result.filename + ' ---\n\n'
      }
      combinedText += result.text
    }
  }

  return { text: combinedText, results }
}
