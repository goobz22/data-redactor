// Data Redactor - Vanilla JS UI
import { DataRedactor, DEFAULT_CONFIG } from '../core/src/index.js'

// State
let inputText = ''
let redactedText = ''
let mapping = {}
let config = getDefaultConfig()
let jsonConfig = JSON.stringify(config, null, 2)
let testInputs = {
  ipv4: '192.168.1.100',
  ipv6: '2001:0db8:85a3::8a2e:0370:7334',
  macAddress: '00-1B-44-11-3A-B8',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  ssn: '123-45-6789',
  creditCard: '4532-1234-5678-9010',
  creditCardLast4: 'Card ending in 9010',
  hostname: 'mail.example.com',
  ticketNumber: 'Ticket #12345',
  name: 'John Doe',
}
let patternFormats = {
  ipv4: {
    tokenFormat: '[I_P_V4_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  ipv6: {
    tokenFormat: '[I_P_V6_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  macAddress: {
    tokenFormat: '[M_A_C_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  email: {
    tokenFormat: '[E_M_A_I_L_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  phone: {
    tokenFormat: '[P_H_O_N_E_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  ssn: {
    tokenFormat: '[S_S_N_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  creditCard: {
    tokenFormat: '[C_A_R_D_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  creditCardLast4: {
    tokenFormat: '[C_A_R_D_L_A_S_T_4_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  hostname: {
    tokenFormat: '[H_O_S_T_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  ticketNumber: {
    tokenFormat: '[T_I_C_K_E_T_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
  name: {
    tokenFormat: '[N_A_M_E_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  },
}

function getDefaultConfig() {
  return {
    patterns: {
      ipv4: {
        enabled: true,
        strategy: 'token',
        regex:
          '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?\\b',
      },
      ipv6: {
        enabled: true,
        strategy: 'token',
        regex: '(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}',
      },
      macAddress: {
        enabled: true,
        strategy: 'token',
        regex:
          '(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})',
      },
      email: {
        enabled: true,
        strategy: 'token',
        regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      },
      phone: {
        enabled: true,
        strategy: 'token',
        regex:
          '(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4})',
      },
      ssn: {
        enabled: true,
        strategy: 'token',
        regex: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
      },
      creditCard: {
        enabled: true,
        strategy: 'token',
        regex:
          '\\b(?:\\d{4}[-\\s]?){3,4}\\d{1,4}\\b|\\b\\d{13,19}\\b',
      },
      creditCardLast4: {
        enabled: true,
        strategy: 'token',
        regex:
          '(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)',
        flags: 'i',
      },
      hostname: {
        enabled: true,
        strategy: 'token',
        regex:
          '\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b',
      },
      ticketNumber: {
        enabled: true,
        strategy: 'token',
        regex: '(?:ticket|case)\\s*[#:-]?\\s*\\d+',
        flags: 'i',
      },
      name: {
        enabled: true,
        strategy: 'token',
      },
      custom: [],
    },
    customEntities: {},
    testData: `Support Ticket #12345

Customer Information:
- Name: John Doe
- Email: john.doe@company.com
- Phone: 555-123-4567
- Alt Phone: (555) 987-6543
- Mobile: 1-555-SUPPORT
- SSN: 123-45-6789

Network Details:
- IPv4: 192.168.1.100
- IPv6: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
- MAC Address: 00-1B-44-11-3A-B8
- Gateway: 10.0.0.1
- DNS Server: 8.8.8.8
- Hostname: mail.example.com

Payment Information:
- Primary Card: 4532-1234-5678-9010
- Backup Card: 5425233430109903
- Card ending in 9010
- AmEx: 378282246310005

Issue Description:
Customer contacted us from IP 203.0.113.45 regarding server api.internal.company.net connection issues.
Contact support@company.com or call 1-555-FLOWERS for assistance.`,
  }
}

// DOM Elements
const elements = {}

// Initialize
document.addEventListener('DOMContentLoaded', init)

function init() {
  cacheElements()
  bindEvents()
  renderPatternCards()
  renderOutputFormatTab()
  updateJsonConfig()
}

function cacheElements() {
  elements.tabSimple = document.getElementById('tab-simple')
  elements.tabJson = document.getElementById('tab-json')
  elements.tabOutput = document.getElementById('tab-output')
  elements.contentSimple = document.getElementById('content-simple')
  elements.contentJson = document.getElementById('content-json')
  elements.contentOutput = document.getElementById('content-output')
  elements.patternCards = document.getElementById('pattern-cards')
  elements.outputPatterns = document.getElementById('output-patterns')
  elements.inputText = document.getElementById('input-text')
  elements.redactedText = document.getElementById('redacted-text')
  elements.mappingContainer = document.getElementById('mapping-container')
  elements.mappingContent = document.getElementById('mapping-content')
  elements.jsonEditor = document.getElementById('json-editor')
  elements.jsonError = document.getElementById('json-error')
  elements.btnRedact = document.getElementById('btn-redact')
  elements.btnCopy = document.getElementById('btn-copy')
  elements.btnClear = document.getElementById('btn-clear')
  elements.btnCopyMapping = document.getElementById('btn-copy-mapping')
  elements.btnInsertTest = document.getElementById('btn-insert-test')
  elements.btnImportJson = document.getElementById('btn-import-json')
  elements.btnExportEdited = document.getElementById('btn-export-edited')
  elements.btnExportDefault = document.getElementById('btn-export-default')
  elements.btnReset = document.getElementById('btn-reset')
}

function bindEvents() {
  // Tabs
  elements.tabSimple.addEventListener('click', () => setActiveTab('simple'))
  elements.tabJson.addEventListener('click', () => setActiveTab('json'))
  elements.tabOutput.addEventListener('click', () => setActiveTab('output'))

  // Main actions
  elements.btnRedact.addEventListener('click', handleRedact)
  elements.btnCopy.addEventListener('click', handleCopy)
  elements.btnClear.addEventListener('click', handleClear)
  elements.btnCopyMapping.addEventListener('click', handleCopyMapping)
  elements.btnInsertTest.addEventListener('click', handleInsertTestData)

  // JSON actions
  elements.btnImportJson.addEventListener('click', handleImportJson)
  elements.btnExportEdited.addEventListener('click', handleExportEditedJson)
  elements.btnExportDefault.addEventListener('click', handleExportDefaultJson)
  elements.btnReset.addEventListener('click', handleResetConfig)

  // Input sync
  elements.inputText.addEventListener('input', e => {
    inputText = e.target.value
  })

  elements.jsonEditor.addEventListener('input', e => {
    handleJsonChange(e.target.value)
  })
}

function setActiveTab(tab) {
  // Update tab styles
  elements.tabSimple.classList.toggle('active', tab === 'simple')
  elements.tabJson.classList.toggle('active', tab === 'json')
  elements.tabOutput.classList.toggle('active', tab === 'output')

  // Show/hide content
  elements.contentSimple.classList.toggle('hidden', tab !== 'simple')
  elements.contentJson.classList.toggle('hidden', tab !== 'json')
  elements.contentOutput.classList.toggle('hidden', tab !== 'output')
}

function renderPatternCards() {
  const container = elements.patternCards
  container.innerHTML = ''

  Object.entries(config.patterns || {}).forEach(([key, value]) => {
    if (key === 'custom') return

    const card = document.createElement('div')
    card.className = 'pattern-card'
    card.innerHTML = `
      <label>
        <input type="checkbox" ${value.enabled ? 'checked' : ''} data-pattern="${key}">
        <span>${key}</span>
      </label>
      <select data-pattern="${key}" ${!value.enabled ? 'disabled' : ''}>
        <option value="token" ${value.strategy === 'token' ? 'selected' : ''}>Token</option>
        <option value="mask" ${value.strategy === 'mask' ? 'selected' : ''}>Mask</option>
        <option value="formatPreserving" ${value.strategy === 'formatPreserving' ? 'selected' : ''}>Format-Preserving</option>
      </select>
    `

    // Bind events
    const checkbox = card.querySelector('input[type="checkbox"]')
    const select = card.querySelector('select')

    checkbox.addEventListener('change', e => {
      togglePattern(key, e.target.checked)
      select.disabled = !e.target.checked
    })

    select.addEventListener('change', e => {
      setStrategy(key, e.target.value)
    })

    container.appendChild(card)
  })
}

function renderOutputFormatTab() {
  const container = elements.outputPatterns
  container.innerHTML = ''

  Object.entries(config.patterns || {}).forEach(([key]) => {
    if (key === 'custom') return

    const testInput = testInputs[key] || ''
    const format = patternFormats[key] || {
      tokenFormat: '[{TYPE}_{INDEX}]',
      maskChar: '*',
      preserveStructure: true,
    }

    const card = document.createElement('div')
    card.className = 'pattern-test-card'
    card.innerHTML = `
      <h3>${key}</h3>
      <label class="test-input-label">Test Input:</label>
      <input type="text" class="test-input" value="${escapeHtml(testInput)}" data-pattern="${key}" placeholder="Enter ${key} to test...">

      <div class="strategy-grid">
        <!-- Token Strategy -->
        <div class="strategy-card token">
          <div class="strategy-title">Token Strategy</div>
          <div class="format-input-group">
            <label>Token Format:</label>
            <input type="text" value="${escapeHtml(format.tokenFormat)}" data-pattern="${key}" data-field="tokenFormat" placeholder="[PATTERN_{INDEX}]">
            <div class="format-hint">Use <code>{INDEX}</code> for counter</div>
          </div>
          <div class="output-box">
            <div class="output-label">Output:</div>
            <code class="output-value" data-output="${key}-token"></code>
          </div>
          <button class="copy-btn" data-copy="${key}-token">Copy Token Output</button>
        </div>

        <!-- Mask Strategy -->
        <div class="strategy-card mask">
          <div class="strategy-title">Mask Strategy</div>
          <div class="format-input-group">
            <label>Mask Character:</label>
            <input type="text" value="${format.maskChar}" maxlength="1" data-pattern="${key}" data-field="maskChar" placeholder="*">
          </div>
          <label class="preserve-structure-label">
            <input type="checkbox" ${format.preserveStructure ? 'checked' : ''} data-pattern="${key}" data-field="preserveStructure">
            Preserve structure
          </label>
          <div class="output-box">
            <div class="output-label">Output:</div>
            <code class="output-value" data-output="${key}-mask"></code>
          </div>
          <button class="copy-btn" data-copy="${key}-mask">Copy Mask Output</button>
        </div>

        <!-- Format-Preserving Strategy -->
        <div class="strategy-card format-preserving">
          <div class="strategy-title">Format-Preserving</div>
          <div class="auto-info">Automatically maintains input format with realistic fake data</div>
          <div class="output-box">
            <div class="output-label">Output:</div>
            <code class="output-value" data-output="${key}-format"></code>
          </div>
          <button class="copy-btn" data-copy="${key}-format">Copy Format-Preserving Output</button>
        </div>
      </div>
    `

    container.appendChild(card)

    // Bind events
    const testInputEl = card.querySelector('.test-input')
    testInputEl.addEventListener('input', e => {
      testInputs[key] = e.target.value
      updateOutputForPattern(key)
    })

    // Format inputs
    card.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener('input', e => {
        const field = e.target.dataset.field
        const pattern = e.target.dataset.pattern
        if (field === 'preserveStructure') {
          patternFormats[pattern][field] = e.target.checked
        } else {
          patternFormats[pattern][field] = e.target.value
        }
        updateOutputForPattern(pattern)
      })

      if (input.type === 'checkbox') {
        input.addEventListener('change', e => {
          const field = e.target.dataset.field
          const pattern = e.target.dataset.pattern
          patternFormats[pattern][field] = e.target.checked
          updateOutputForPattern(pattern)
        })
      }
    })

    // Copy buttons
    card.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', e => {
        const outputKey = e.target.dataset.copy
        const outputEl = card.querySelector(`[data-output="${outputKey}"]`)
        copyToClipboard(outputEl.textContent, 'Output')
      })
    })

    // Initial output
    updateOutputForPattern(key)
  })
}

function updateOutputForPattern(key) {
  const testInput = testInputs[key] || ''
  const format = patternFormats[key] || {
    tokenFormat: '[{TYPE}_{INDEX}]',
    maskChar: '*',
    preserveStructure: true,
  }

  // Token output
  const tokenOutput = testWithStrategy(key, testInput, 'token', format)
  const tokenEl = document.querySelector(`[data-output="${key}-token"]`)
  if (tokenEl) tokenEl.textContent = tokenOutput

  // Mask output
  const maskOutput = testWithStrategy(key, testInput, 'mask', format)
  const maskEl = document.querySelector(`[data-output="${key}-mask"]`)
  if (maskEl) maskEl.textContent = maskOutput

  // Format-preserving output
  const formatOutput = testWithStrategy(
    key,
    testInput,
    'formatPreserving',
    format
  )
  const formatEl = document.querySelector(`[data-output="${key}-format"]`)
  if (formatEl) formatEl.textContent = formatOutput
}

function testWithStrategy(key, testInput, strategy, format) {
  try {
    const testConfig = {
      ...config,
      formatOptions: {
        tokenFormat: format.tokenFormat,
        maskChar: format.maskChar,
        preserveStructure: format.preserveStructure,
      },
      patterns: {
        ...config.patterns,
        [key]: {
          ...config.patterns[key],
          enabled: true,
          strategy,
        },
      },
    }
    const redactor = new DataRedactor(testConfig)
    const result = redactor.redact(testInput)
    return result.redactedText || testInput
  } catch (error) {
    return `Error: ${error}`
  }
}

function togglePattern(pattern, enabled) {
  config.patterns[pattern].enabled = enabled
  updateJsonConfig()
}

function setStrategy(pattern, strategy) {
  config.patterns[pattern].strategy = strategy
  updateJsonConfig()
}

function updateJsonConfig() {
  jsonConfig = JSON.stringify(config, null, 2)
  if (elements.jsonEditor) {
    elements.jsonEditor.value = jsonConfig
  }
}

function handleRedact() {
  try {
    inputText = elements.inputText.value
    const redactor = new DataRedactor(config)
    const result = redactor.redact(inputText)
    redactedText = result.redactedText
    mapping = result.mapping

    elements.redactedText.value = redactedText
    renderMapping()
  } catch (error) {
    console.error('Redaction error:', error)
    alert(`Error: ${error}`)
  }
}

function handleClear() {
  inputText = ''
  redactedText = ''
  mapping = {}
  elements.inputText.value = ''
  elements.redactedText.value = ''
  elements.mappingContainer.classList.add('hidden')
}

function handleCopy() {
  if (redactedText) {
    copyToClipboard(redactedText, 'Redacted text')
  }
}

function handleCopyMapping() {
  const mappingText = Object.entries(mapping)
    .map(([original, redacted]) => `${original} → ${redacted}`)
    .join('\n')
  copyToClipboard(mappingText, 'Mapping')
}

function handleInsertTestData() {
  inputText = config.testData || ''
  elements.inputText.value = inputText
}

function handleJsonChange(value) {
  jsonConfig = value
  elements.jsonError.textContent = ''
  elements.jsonError.classList.add('hidden')

  try {
    const parsed = JSON.parse(value)
    config = parsed
    renderPatternCards()
    renderOutputFormatTab()
  } catch {
    elements.jsonError.textContent = 'Invalid JSON - will not apply until fixed'
    elements.jsonError.classList.remove('hidden')
  }
}

function handleImportJson() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = event => {
        try {
          const content = event.target.result
          const parsed = JSON.parse(content)
          config = parsed
          updateJsonConfig()
          renderPatternCards()
          renderOutputFormatTab()
          alert('Configuration imported successfully!')
        } catch {
          alert('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

function handleExportEditedJson() {
  downloadJson(jsonConfig, 'redactor-config-edited.json')
}

function handleExportDefaultJson() {
  downloadJson(
    JSON.stringify(DEFAULT_CONFIG, null, 2),
    'redactor-config-default.json'
  )
}

function handleResetConfig() {
  config = getDefaultConfig()
  updateJsonConfig()
  renderPatternCards()
  renderOutputFormatTab()
}

function renderMapping() {
  if (Object.keys(mapping).length === 0) {
    elements.mappingContainer.classList.add('hidden')
    return
  }

  elements.mappingContainer.classList.remove('hidden')
  elements.mappingContent.innerHTML = Object.entries(mapping)
    .map(
      ([original, redacted]) =>
        `<div class="mapping-item"><strong>${escapeHtml(original)}</strong> → ${escapeHtml(redacted)}</div>`
    )
    .join('')
}

// Utility functions
function copyToClipboard(text, label) {
  navigator.clipboard.writeText(text)
  alert(`${label} copied to clipboard!`)
}

function downloadJson(content, filename) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
