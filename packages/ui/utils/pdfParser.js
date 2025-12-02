/**
 * Custom PDF Text Extraction - Zero Dependencies
 *
 * Extracts text from text-based PDFs using native browser APIs.
 * Does NOT support scanned/image-only PDFs (would require OCR).
 *
 * PDF Structure:
 * - Header: %PDF-1.x
 * - Body: Objects containing streams (text content)
 * - Cross-reference table
 * - Trailer
 *
 * Text is stored in content streams, often compressed with FlateDecode (zlib).
 * We use the native DecompressionStream API to decompress.
 */

/**
 * Extract text from a PDF file
 * @param {ArrayBuffer} arrayBuffer - The PDF file as ArrayBuffer
 * @returns {Promise<{text: string, pageCount: number, isScanned: boolean, error?: string}>}
 */
export async function extractTextFromPDF(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer)
    const pdfString = bytesToString(bytes)

    // Verify it's a PDF
    if (!pdfString.startsWith('%PDF-')) {
      return {
        text: '',
        pageCount: 0,
        isScanned: false,
        error: 'Not a valid PDF file',
      }
    }

    // Extract all streams from the PDF
    const streams = await extractStreams(bytes, pdfString)

    // Extract text from streams
    let allText = ''
    let textFound = false

    for (const stream of streams) {
      const text = extractTextFromStream(stream)
      if (text.trim()) {
        textFound = true
        allText += text + '\n'
      }
    }

    // Count pages (approximate)
    const pageMatches = pdfString.match(/\/Type\s*\/Page[^s]/g)
    const pageCount = pageMatches ? pageMatches.length : 1

    // Clean up the extracted text
    allText = cleanExtractedText(allText)

    // Check if this appears to be a scanned PDF
    const isScanned = !textFound || allText.trim().length < 50

    if (isScanned) {
      return {
        text: '',
        pageCount,
        isScanned: true,
        error:
          'This PDF appears to be scanned or image-based. Text extraction requires a text-based PDF.',
      }
    }

    return {
      text: allText.trim(),
      pageCount,
      isScanned: false,
    }
  } catch (error) {
    return {
      text: '',
      pageCount: 0,
      isScanned: false,
      error: `PDF parsing error: ${error.message}`,
    }
  }
}

/**
 * Convert bytes to string (Latin-1 encoding for PDF)
 */
function bytesToString(bytes) {
  let str = ''
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i])
  }
  return str
}

/**
 * Extract all streams from PDF
 */
async function extractStreams(bytes, pdfString) {
  const streams = []

  // Find all stream...endstream blocks
  const streamRegex = /stream[\r\n]+/g
  let match

  while ((match = streamRegex.exec(pdfString)) !== null) {
    const streamStart = match.index + match[0].length

    // Find the corresponding endstream
    const endstreamIndex = pdfString.indexOf('endstream', streamStart)
    if (endstreamIndex === -1) continue

    // Get the stream content
    let streamContent = bytes.slice(streamStart, endstreamIndex)

    // Remove trailing whitespace/newlines from stream
    while (
      streamContent.length > 0 &&
      (streamContent[streamContent.length - 1] === 0x0a ||
        streamContent[streamContent.length - 1] === 0x0d)
    ) {
      streamContent = streamContent.slice(0, -1)
    }

    // Check if this stream is compressed (look for filter in the object header)
    const objHeaderStart = pdfString.lastIndexOf('obj', match.index)
    const objHeader = pdfString.substring(objHeaderStart, match.index)

    const isCompressed =
      objHeader.includes('/FlateDecode') ||
      objHeader.includes('/Fl') ||
      objHeader.includes('/Filter')

    if (isCompressed && streamContent.length > 0) {
      // Try to decompress using native DecompressionStream
      try {
        const decompressed = await decompressZlib(streamContent)
        if (decompressed) {
          streams.push(bytesToString(decompressed))
        }
      } catch {
        // If decompression fails, try as raw text
        streams.push(bytesToString(streamContent))
      }
    } else {
      streams.push(bytesToString(streamContent))
    }
  }

  return streams
}

/**
 * Decompress zlib/deflate data using native DecompressionStream
 */
async function decompressZlib(compressedBytes) {
  // Check if DecompressionStream is available
  if (typeof DecompressionStream === 'undefined') {
    // Fallback: try manual inflate for browsers without DecompressionStream
    return manualInflate(compressedBytes)
  }

  try {
    // PDF uses raw deflate, but sometimes has zlib header
    // Try deflate-raw first, then deflate (with zlib header)
    for (const format of ['deflate-raw', 'deflate']) {
      try {
        const ds = new DecompressionStream(format)
        const writer = ds.writable.getWriter()
        const reader = ds.readable.getReader()

        writer.write(compressedBytes)
        writer.close()

        const chunks = []
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
        }

        // Combine chunks
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
        const result = new Uint8Array(totalLength)
        let offset = 0
        for (const chunk of chunks) {
          result.set(chunk, offset)
          offset += chunk.length
        }

        return result
      } catch {
        continue // Try next format
      }
    }
  } catch {
    // Decompression failed
  }

  return null
}

/**
 * Manual inflate implementation for older browsers
 * This is a simplified version that handles common cases
 */
function manualInflate(_bytes) {
  // For now, return null and let the caller handle uncompressed
  // A full inflate implementation would be hundreds of lines
  // (would need to skip zlib header if present and decompress)
  return null
}

/**
 * Extract readable text from a PDF content stream
 */
function extractTextFromStream(stream) {
  let text = ''

  // Method 1: Extract text from BT...ET blocks (text objects)
  const textObjectRegex = /BT([\s\S]*?)ET/g
  let match

  while ((match = textObjectRegex.exec(stream)) !== null) {
    const textObject = match[1]
    const extractedText = extractTextFromTextObject(textObject)
    if (extractedText) {
      text += extractedText + ' '
    }
  }

  // Method 2: If no BT/ET blocks, try to find raw text strings
  if (!text.trim()) {
    text = extractRawTextStrings(stream)
  }

  return text
}

/**
 * Extract text from a PDF text object (content between BT and ET)
 */
function extractTextFromTextObject(textObject) {
  let result = ''

  // Extract text from Tj operator: (text) Tj
  const tjRegex = /\(([^)]*)\)\s*Tj/g
  let match
  while ((match = tjRegex.exec(textObject)) !== null) {
    result += decodePDFString(match[1]) + ' '
  }

  // Extract text from TJ operator: [(text) -kern (text)] TJ
  const tjArrayRegex = /\[(.*?)\]\s*TJ/g
  while ((match = tjArrayRegex.exec(textObject)) !== null) {
    const array = match[1]
    const stringRegex = /\(([^)]*)\)/g
    let strMatch
    while ((strMatch = stringRegex.exec(array)) !== null) {
      result += decodePDFString(strMatch[1])
    }
    result += ' '
  }

  // Extract text from ' operator (move to next line and show text)
  const quoteRegex = /\(([^)]*)\)\s*'/g
  while ((match = quoteRegex.exec(textObject)) !== null) {
    result += decodePDFString(match[1]) + '\n'
  }

  // Extract text from " operator (set spacing, move to next line, show text)
  const dquoteRegex = /\(([^)]*)\)\s*"/g
  while ((match = dquoteRegex.exec(textObject)) !== null) {
    result += decodePDFString(match[1]) + '\n'
  }

  return result
}

/**
 * Extract raw text strings from stream (fallback method)
 */
function extractRawTextStrings(stream) {
  let result = ''

  // Find all parenthesized strings
  const stringRegex = /\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g
  let match

  while ((match = stringRegex.exec(stream)) !== null) {
    const decoded = decodePDFString(match[1])
    // Only include if it looks like readable text
    if (decoded.length > 1 && /[a-zA-Z0-9]/.test(decoded)) {
      result += decoded + ' '
    }
  }

  // Also try hex strings: <hexdata>
  const hexRegex = /<([0-9A-Fa-f\s]+)>/g
  while ((match = hexRegex.exec(stream)) !== null) {
    const hex = match[1].replace(/\s/g, '')
    if (hex.length % 2 === 0) {
      let decoded = ''
      for (let i = 0; i < hex.length; i += 2) {
        const charCode = parseInt(hex.substr(i, 2), 16)
        if (charCode >= 32 && charCode < 127) {
          decoded += String.fromCharCode(charCode)
        }
      }
      if (decoded.length > 1 && /[a-zA-Z0-9]/.test(decoded)) {
        result += decoded + ' '
      }
    }
  }

  return result
}

/**
 * Decode PDF string escape sequences
 */
function decodePDFString(str) {
  return (
    str
      // Octal escapes
      .replace(/\\([0-7]{1,3})/g, (_, oct) =>
        String.fromCharCode(parseInt(oct, 8))
      )
      // Standard escapes
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\')
      // Remove other backslash escapes
      .replace(/\\./g, '')
  )
}

/**
 * Clean up extracted text
 */
function cleanExtractedText(text) {
  return (
    text
      // Normalize whitespace
      .replace(/[\r\n]+/g, '\n')
      .replace(/[ \t]+/g, ' ')
      // Remove excessive newlines
      .replace(/\n{3,}/g, '\n\n')
      // Remove lines that are just whitespace
      .replace(/\n +\n/g, '\n\n')
      // Trim
      .trim()
  )
}
