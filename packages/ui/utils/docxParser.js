/**
 * Custom DOCX Text Extraction - Zero Dependencies
 *
 * Extracts text from .docx files using native browser APIs.
 *
 * DOCX Structure (it's a ZIP file):
 * ├── [Content_Types].xml
 * ├── _rels/.rels
 * ├── word/
 * │   ├── document.xml    ← Main text content
 * │   ├── styles.xml
 * │   ├── settings.xml
 * │   └── ...
 * └── docProps/
 *     ├── app.xml
 *     └── core.xml
 *
 * We use native ZIP reading (via manual parsing) and XML parsing (via DOMParser).
 */

/**
 * Extract text from a DOCX file
 * @param {ArrayBuffer} arrayBuffer - The DOCX file as ArrayBuffer
 * @returns {Promise<{text: string, error?: string}>}
 */
export async function extractTextFromDOCX(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer)

    // Verify it's a ZIP file (DOCX is ZIP-based)
    if (!isZipFile(bytes)) {
      return {
        text: '',
        error: 'Not a valid DOCX file (invalid ZIP signature)',
      }
    }

    // Parse the ZIP structure
    const files = await parseZip(bytes)

    // Find document.xml (main content)
    const documentXml = files['word/document.xml']
    if (!documentXml) {
      return {
        text: '',
        error: 'Not a valid DOCX file (missing word/document.xml)',
      }
    }

    // Parse XML and extract text
    const text = extractTextFromDocumentXml(documentXml)

    return { text: text.trim() }
  } catch (error) {
    return { text: '', error: `DOCX parsing error: ${error.message}` }
  }
}

/**
 * Check if bytes represent a ZIP file
 */
function isZipFile(bytes) {
  // ZIP magic number: PK\x03\x04
  return (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  )
}

/**
 * Parse ZIP file and extract files
 * @param {Uint8Array} bytes
 * @returns {Promise<Object<string, string>>} Map of filename to content
 */
async function parseZip(bytes) {
  const files = {}
  let offset = 0

  while (offset < bytes.length - 4) {
    // Look for local file header signature: PK\x03\x04
    if (bytes[offset] !== 0x50 || bytes[offset + 1] !== 0x4b) {
      break
    }

    const signature = bytes[offset + 2] | (bytes[offset + 3] << 8)

    // Local file header
    if (signature === 0x0403) {
      const entry = parseLocalFileHeader(bytes, offset)
      if (!entry) break

      offset = entry.nextOffset

      // Only process XML files we care about
      if (
        entry.filename.endsWith('.xml') &&
        entry.filename.startsWith('word/')
      ) {
        let content = entry.data

        // Decompress if needed
        if (entry.compressionMethod === 8) {
          // Deflate compression
          content = await decompressDeflate(entry.data)
        }

        if (content) {
          files[entry.filename] = bytesToString(content)
        }
      }
    }
    // Central directory header - we're done with local files
    else if (signature === 0x0201) {
      break
    }
    // End of central directory
    else if (signature === 0x0605) {
      break
    } else {
      offset++
    }
  }

  return files
}

/**
 * Parse a local file header in ZIP
 */
function parseLocalFileHeader(bytes, offset) {
  // Minimum header size check
  if (offset + 30 > bytes.length) return null

  const compressionMethod = bytes[offset + 8] | (bytes[offset + 9] << 8)
  const compressedSize =
    bytes[offset + 18] |
    (bytes[offset + 19] << 8) |
    (bytes[offset + 20] << 16) |
    (bytes[offset + 21] << 24)
  const uncompressedSize =
    bytes[offset + 22] |
    (bytes[offset + 23] << 8) |
    (bytes[offset + 24] << 16) |
    (bytes[offset + 25] << 24)
  const filenameLength = bytes[offset + 26] | (bytes[offset + 27] << 8)
  const extraFieldLength = bytes[offset + 28] | (bytes[offset + 29] << 8)

  const filenameStart = offset + 30
  const filenameEnd = filenameStart + filenameLength

  if (filenameEnd > bytes.length) return null

  const filename = bytesToString(bytes.slice(filenameStart, filenameEnd))

  const dataStart = filenameEnd + extraFieldLength
  const dataEnd = dataStart + compressedSize

  if (dataEnd > bytes.length) return null

  const data = bytes.slice(dataStart, dataEnd)

  return {
    filename,
    compressionMethod,
    compressedSize,
    uncompressedSize,
    data,
    nextOffset: dataEnd,
  }
}

/**
 * Convert bytes to string (UTF-8)
 */
function bytesToString(bytes) {
  // Try UTF-8 decoding first
  try {
    return new TextDecoder('utf-8').decode(bytes)
  } catch {
    // Fallback to Latin-1
    let str = ''
    for (let i = 0; i < bytes.length; i++) {
      str += String.fromCharCode(bytes[i])
    }
    return str
  }
}

/**
 * Decompress deflate data using native DecompressionStream
 */
async function decompressDeflate(compressedBytes) {
  if (typeof DecompressionStream === 'undefined') {
    // Browser doesn't support DecompressionStream
    // Return raw bytes and hope for the best (some files may not be compressed)
    return compressedBytes
  }

  try {
    // ZIP uses raw deflate (no zlib header)
    const ds = new DecompressionStream('deflate-raw')
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
    // Decompression failed, return original
    return compressedBytes
  }
}

/**
 * Extract text from DOCX document.xml content
 */
function extractTextFromDocumentXml(xmlString) {
  // Parse XML using DOMParser
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  // Check for parsing errors
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    // Try to extract text anyway using regex
    return extractTextWithRegex(xmlString)
  }

  // DOCX uses namespaces, but we can query by local name
  // Main text is in <w:t> elements (Word text)
  // Paragraphs are <w:p> elements

  let result = ''
  const paragraphs = doc.getElementsByTagName('w:p')

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i]
    let paraText = ''

    // Get all text runs in this paragraph
    const textElements = para.getElementsByTagName('w:t')
    for (let j = 0; j < textElements.length; j++) {
      paraText += textElements[j].textContent || ''
    }

    // Check for tabs
    const tabs = para.getElementsByTagName('w:tab')
    if (tabs.length > 0) {
      paraText = paraText.replace(/(\S)(\S)/g, '$1\t$2')
    }

    if (paraText) {
      result += paraText + '\n'
    } else {
      // Empty paragraph = blank line (but avoid multiple)
      if (result && !result.endsWith('\n\n')) {
        result += '\n'
      }
    }
  }

  // Also extract text from tables
  const tables = doc.getElementsByTagName('w:tbl')
  for (let i = 0; i < tables.length; i++) {
    const rows = tables[i].getElementsByTagName('w:tr')
    for (let j = 0; j < rows.length; j++) {
      const cells = rows[j].getElementsByTagName('w:tc')
      const rowText = []
      for (let k = 0; k < cells.length; k++) {
        const cellTextElements = cells[k].getElementsByTagName('w:t')
        let cellText = ''
        for (let l = 0; l < cellTextElements.length; l++) {
          cellText += cellTextElements[l].textContent || ''
        }
        rowText.push(cellText)
      }
      if (rowText.some(t => t.trim())) {
        result += rowText.join('\t') + '\n'
      }
    }
  }

  return cleanText(result)
}

/**
 * Fallback: Extract text from XML using regex
 */
function extractTextWithRegex(xmlString) {
  let text = ''

  // Match <w:t>content</w:t> and <w:t ...>content</w:t>
  const textRegex = /<w:t[^>]*>([^<]*)<\/w:t>/g
  let match

  while ((match = textRegex.exec(xmlString)) !== null) {
    text += match[1]
  }

  // Add paragraph breaks where we see </w:p>
  text = xmlString.replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '')

  return cleanText(text)
}

/**
 * Clean up extracted text
 */
function cleanText(text) {
  return (
    text
      // Decode XML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      )
      // Normalize whitespace
      .replace(/[ \t]+/g, ' ')
      .replace(/\n /g, '\n')
      .replace(/ \n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}
