// Data Redactor - Vanilla JS UI
import {
  DataRedactor,
  DEFAULT_CONFIG,
  generateFromSample,
  refineFromSamples,
} from '../core/src/index.js'

// LocalStorage key for persisting config
const CONFIG_STORAGE_KEY = 'dataRedactor_config'

// State
let inputText = ''
let redactedText = ''
let mapping = {}
let config = loadConfig()
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
let generatedPattern = null
let markedTexts = [] // Array of marked texts for multi-sample pattern generation
let fullSampleTexts = [] // Array of full sample texts for testing
let sampleCount = 1 // Number of sample input fields
let editingPatternIndex = null // Index of pattern being edited, null if creating new

// Community tab state
// In dev mode (bun dev), UI runs on a different port than API
// In production (bun start), both are served from the same origin
const API_BASE_URL = window.location.port === '3000'
  ? window.location.origin  // Production: same origin
  : 'http://localhost:3001' // Dev mode: API on port 3001
let communityPatterns = []
let communityCurrentPage = 1
let communityTotalPages = 1
let communityTotalCount = 0
const PATTERNS_PER_PAGE = 10

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

// Load config from localStorage or return default
function loadConfig() {
  try {
    const saved = localStorage.getItem(CONFIG_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge with defaults to ensure all patterns exist
      const defaults = getDefaultConfig()
      return {
        ...defaults,
        ...parsed,
        patterns: {
          ...defaults.patterns,
          ...parsed.patterns,
        },
      }
    }
  } catch (e) {
    console.warn('Failed to load config from localStorage:', e)
  }
  return getDefaultConfig()
}

// Save config to localStorage
function saveConfig() {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.warn('Failed to save config to localStorage:', e)
  }
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
        regex: '\\b(?:\\d{4}[-\\s]?){3,4}\\d{1,4}\\b|\\b\\d{13,19}\\b',
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
  syncCustomPatternSampleValues() // Sync sample values from loaded config
  renderPatternCards()
  renderOutputFormatTab()
  updateJsonConfig()
  loadVersion()
  initAccordionState()
  initTabsScroll()
}

// Load version from package.json
async function loadVersion() {
  try {
    // Try multiple paths since we don't know the exact serving structure
    const paths = ['/package.json', '../package.json', '../../package.json']
    for (const path of paths) {
      try {
        const response = await fetch(path)
        if (response.ok) {
          const pkg = await response.json()
          if (elements.versionBadge && pkg.version) {
            elements.versionBadge.textContent = `v${pkg.version}`
            return
          }
        }
      } catch {
        continue
      }
    }
    // If all paths fail, show fallback
    if (elements.versionBadge) {
      elements.versionBadge.textContent = 'v1.0.7'
    }
  } catch (e) {
    console.warn('Failed to load version:', e)
    if (elements.versionBadge) {
      elements.versionBadge.textContent = 'v1.0.7'
    }
  }
}

// Initialize accordion state based on screen size
// Desktop (>1024px): expanded by default
// Mobile/Tablet (<=1024px): collapsed by default
function initAccordionState() {
  const accordion = elements.builtinPatternsAccordion
  if (!accordion) return

  // Track if user has manually toggled the accordion
  let userToggled = false

  // Listen for manual toggle
  accordion.addEventListener('toggle', () => {
    userToggled = true
  })

  function updateAccordionState() {
    const isDesktop = window.innerWidth > 1024

    // Set state based on screen size
    if (isDesktop) {
      accordion.setAttribute('open', '')
    } else {
      accordion.removeAttribute('open')
    }

    // Reset user toggle flag when screen size changes
    userToggled = false
  }

  // Initial state
  updateAccordionState()

  // Update on resize with debounce
  let resizeTimeout
  let lastWidth = window.innerWidth
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimeout)
    resizeTimeout = window.setTimeout(() => {
      const currentWidth = window.innerWidth
      const crossedBreakpoint =
        (lastWidth <= 1024 && currentWidth > 1024) ||
        (lastWidth > 1024 && currentWidth <= 1024)

      // Only auto-update if crossing the breakpoint and user hasn't manually toggled
      if (crossedBreakpoint && !userToggled) {
        updateAccordionState()
      }

      lastWidth = currentWidth
    }, 150)
  })
}

// Initialize tabs (placeholder for future enhancements)
function initTabsScroll() {
  // Tabs now wrap on mobile, no scroll handling needed
}

// Scroll handling removed - tabs now wrap on mobile
function scrollToActiveTab() {
  // No longer needed since tabs wrap instead of scroll
}

function cacheElements() {
  elements.tabSimple = document.getElementById('tab-simple')
  elements.tabJson = document.getElementById('tab-json')
  elements.tabOutput = document.getElementById('tab-output')
  elements.tabBuilder = document.getElementById('tab-builder')
  elements.contentSimple = document.getElementById('content-simple')
  elements.contentJson = document.getElementById('content-json')
  elements.contentOutput = document.getElementById('content-output')
  elements.contentBuilder = document.getElementById('content-builder')
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
  elements.btnSaveConfig = document.getElementById('btn-save-config')
  elements.btnExportEdited = document.getElementById('btn-export-edited')
  elements.btnExportDefault = document.getElementById('btn-export-default')
  elements.btnReset = document.getElementById('btn-reset')
  elements.versionBadge = document.getElementById('version-badge')
  elements.btnEnableAll = document.getElementById('btn-enable-all')
  elements.btnDisableAll = document.getElementById('btn-disable-all')
  elements.customPatternsSection = document.getElementById(
    'custom-patterns-section'
  )
  elements.customPatternCards = document.getElementById('custom-pattern-cards')
  elements.builtinPatternsAccordion = document.getElementById(
    'builtin-patterns-accordion'
  )
  elements.tabsNav = document.getElementById('tabs-nav')
  elements.tabsContainer = document.querySelector('.tabs-container')

  // Output Format tab elements
  elements.outputCustomSection = document.getElementById(
    'output-custom-section'
  )
  elements.outputCustomPatterns = document.getElementById(
    'output-custom-patterns'
  )
  elements.btnViewCompact = document.getElementById('btn-view-compact')
  elements.btnViewExpanded = document.getElementById('btn-view-expanded')

  // Pattern Builder elements
  elements.samplesContainer = document.getElementById('samples-container')
  elements.builderWordBoundaries = document.getElementById(
    'builder-word-boundaries'
  )
  elements.builderCaseInsensitive = document.getElementById(
    'builder-case-insensitive'
  )
  elements.btnGeneratePattern = document.getElementById('btn-generate-pattern')
  elements.btnMarkSelection = document.getElementById('btn-mark-selection')
  elements.btnClearMarks = document.getElementById('btn-clear-marks')
  elements.btnAddSample = document.getElementById('btn-add-sample')
  elements.markedTextsList = document.getElementById('marked-texts-list')
  elements.markedTextsChips = document.getElementById('marked-texts-chips')
  elements.builderResult = document.getElementById('builder-result')
  elements.builderPatternName = document.getElementById('builder-pattern-name')
  elements.builderRegex = document.getElementById('builder-regex')
  elements.btnCopyRegex = document.getElementById('btn-copy-regex')
  elements.builderValidation = document.getElementById('builder-validation')
  elements.builderWarnings = document.getElementById('builder-warnings')
  elements.builderExplanation = document.getElementById('builder-explanation')
  elements.builderSegments = document.getElementById('builder-segments')
  elements.builderTestInput = document.getElementById('builder-test-input')
  elements.builderTestResult = document.getElementById('builder-test-result')
  elements.btnAddPattern = document.getElementById('btn-add-pattern')

  // Pattern submission elements
  elements.patternDescription = document.getElementById('pattern-description')
  elements.patternCategory = document.getElementById('pattern-category')
  elements.btnSubmitPattern = document.getElementById('btn-submit-pattern')
  elements.submitStatus = document.getElementById('submit-status')

  // Existing patterns elements
  elements.existingPatternsSection = document.getElementById(
    'existing-patterns-section'
  )
  elements.existingPatternsList = document.getElementById(
    'existing-patterns-list'
  )
  elements.editingIndicator = document.getElementById('editing-indicator')
  elements.editingPatternName = document.getElementById('editing-pattern-name')
  elements.btnCancelEdit = document.getElementById('btn-cancel-edit')

  // Community tab elements
  elements.tabCommunity = document.getElementById('tab-community')
  elements.contentCommunity = document.getElementById('content-community')
  elements.communityPatternsList = document.getElementById(
    'community-patterns-list'
  )
  elements.communityPagination = document.getElementById('community-pagination')
  elements.communityEmpty = document.getElementById('community-empty')
  elements.btnRefreshPatterns = document.getElementById('btn-refresh-patterns')
  elements.communityCategoryFilter = document.getElementById(
    'community-category-filter'
  )
  elements.communityStatusFilter = document.getElementById(
    'community-status-filter'
  )
  elements.btnPrevPage = document.getElementById('btn-prev-page')
  elements.btnNextPage = document.getElementById('btn-next-page')
  elements.paginationInfo = document.getElementById('pagination-info')
  elements.btnGoBuilder = document.getElementById('btn-go-builder')
}

function bindEvents() {
  // Tabs
  elements.tabSimple.addEventListener('click', () => setActiveTab('simple'))
  elements.tabJson.addEventListener('click', () => setActiveTab('json'))
  elements.tabOutput.addEventListener('click', () => setActiveTab('output'))
  elements.tabBuilder.addEventListener('click', () => setActiveTab('builder'))
  elements.tabCommunity.addEventListener('click', () =>
    setActiveTab('community')
  )

  // Main actions
  elements.btnRedact.addEventListener('click', handleRedact)
  elements.btnCopy.addEventListener('click', handleCopy)
  elements.btnClear.addEventListener('click', handleClear)
  elements.btnCopyMapping.addEventListener('click', handleCopyMapping)
  elements.btnInsertTest.addEventListener('click', handleInsertTestData)

  // JSON actions
  elements.btnImportJson.addEventListener('click', handleImportJson)
  elements.btnSaveConfig.addEventListener('click', handleSaveConfig)
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

  // Enable/Disable all patterns
  elements.btnEnableAll.addEventListener('click', handleEnableAll)
  elements.btnDisableAll.addEventListener('click', handleDisableAll)

  // Output Format view toggle
  elements.btnViewCompact.addEventListener('click', () =>
    setOutputView('compact')
  )
  elements.btnViewExpanded.addEventListener('click', () =>
    setOutputView('expanded')
  )

  // Pattern Builder events
  elements.btnMarkSelection.addEventListener('click', handleMarkSelection)
  elements.btnClearMarks.addEventListener('click', handleClearMarks)
  elements.btnAddSample.addEventListener('click', handleAddSample)
  elements.btnGeneratePattern.addEventListener('click', handleGeneratePattern)
  elements.btnCopyRegex.addEventListener('click', handleCopyRegex)
  elements.btnAddPattern.addEventListener('click', handleAddPattern)
  elements.builderTestInput.addEventListener('input', handleTestPattern)
  elements.btnSubmitPattern.addEventListener('click', handleSubmitPattern)
  elements.btnCancelEdit.addEventListener('click', handleCancelEdit)

  // Community tab events
  elements.btnRefreshPatterns.addEventListener('click', fetchCommunityPatterns)
  elements.communityCategoryFilter.addEventListener(
    'change',
    fetchCommunityPatterns
  )
  elements.communityStatusFilter.addEventListener(
    'change',
    fetchCommunityPatterns
  )
  elements.btnPrevPage.addEventListener('click', () => changePage(-1))
  elements.btnNextPage.addEventListener('click', () => changePage(1))
  elements.btnGoBuilder.addEventListener('click', () => setActiveTab('builder'))
}

function setActiveTab(tab) {
  // Update tab styles
  elements.tabSimple.classList.toggle('active', tab === 'simple')
  elements.tabJson.classList.toggle('active', tab === 'json')
  elements.tabOutput.classList.toggle('active', tab === 'output')
  elements.tabBuilder.classList.toggle('active', tab === 'builder')
  elements.tabCommunity.classList.toggle('active', tab === 'community')

  // Show/hide content
  elements.contentSimple.classList.toggle('hidden', tab !== 'simple')
  elements.contentJson.classList.toggle('hidden', tab !== 'json')
  elements.contentOutput.classList.toggle('hidden', tab !== 'output')
  elements.contentBuilder.classList.toggle('hidden', tab !== 'builder')
  elements.contentCommunity.classList.toggle('hidden', tab !== 'community')

  // Scroll to active tab on mobile
  scrollToActiveTab()

  // Render existing patterns when switching to builder tab
  if (tab === 'builder') {
    renderExistingPatterns()
  }

  // Fetch community patterns when switching to community tab
  if (tab === 'community') {
    fetchCommunityPatterns()
  }
}

// Pattern name display mapping for cleaner labels
const PATTERN_LABELS = {
  ipv4: 'IPv4',
  ipv6: 'IPv6',
  macAddress: 'MAC',
  email: 'Email',
  phone: 'Phone',
  ssn: 'SSN',
  creditCard: 'Credit Card',
  creditCardLast4: 'Card Last 4',
  hostname: 'Hostname',
  ticketNumber: 'Ticket #',
  name: 'Name',
}

function renderPatternCards() {
  const container = elements.patternCards
  container.innerHTML = ''

  Object.entries(config.patterns || {}).forEach(([key, value]) => {
    if (key === 'custom') return

    const label = PATTERN_LABELS[key] || key
    const card = document.createElement('div')
    card.className = `pattern-card${value.enabled ? '' : ' disabled'}`
    card.innerHTML = `
      <label>
        <input type="checkbox" ${value.enabled ? 'checked' : ''} data-pattern="${key}">
        <span>${label}</span>
      </label>
      <select data-pattern="${key}" ${!value.enabled ? 'disabled' : ''}>
        <option value="token" ${value.strategy === 'token' ? 'selected' : ''}>Token</option>
        <option value="mask" ${value.strategy === 'mask' ? 'selected' : ''}>Mask</option>
        <option value="formatPreserving" ${value.strategy === 'formatPreserving' ? 'selected' : ''}>Format</option>
      </select>
    `

    // Bind events
    const checkbox = card.querySelector('input[type="checkbox"]')
    const select = card.querySelector('select')

    checkbox.addEventListener('change', e => {
      togglePattern(key, e.target.checked)
      select.disabled = !e.target.checked
      card.classList.toggle('disabled', !e.target.checked)
    })

    select.addEventListener('change', e => {
      setStrategy(key, e.target.value)
    })

    container.appendChild(card)
  })

  // Render custom patterns
  renderCustomPatternCards()
}

function renderCustomPatternCards() {
  const customPatterns = config.patterns.custom || []

  if (customPatterns.length === 0) {
    elements.customPatternsSection.classList.add('hidden')
    return
  }

  elements.customPatternsSection.classList.remove('hidden')
  elements.customPatternCards.innerHTML = ''

  customPatterns.forEach((pattern, index) => {
    const card = document.createElement('div')
    card.className = 'pattern-card'
    card.innerHTML = `
      <label>
        <input type="checkbox" checked data-custom-index="${index}">
        <span>${escapeHtml(pattern.name)}</span>
      </label>
      <select data-custom-index="${index}">
        <option value="token" ${pattern.strategy === 'token' ? 'selected' : ''}>Token</option>
        <option value="mask" ${pattern.strategy === 'mask' ? 'selected' : ''}>Mask</option>
        <option value="formatPreserving" ${pattern.strategy === 'formatPreserving' ? 'selected' : ''}>Format</option>
      </select>
      <button class="btn-delete-pattern" data-custom-index="${index}" title="Remove pattern">×</button>
    `

    // Bind events
    const select = card.querySelector('select')
    const deleteBtn = card.querySelector('.btn-delete-pattern')

    select.addEventListener('change', e => {
      config.patterns.custom[index].strategy = e.target.value
      updateJsonConfig()
    })

    deleteBtn.addEventListener('click', () => {
      if (confirm(`Remove custom pattern "${pattern.name}"?`)) {
        config.patterns.custom.splice(index, 1)
        updateJsonConfig()
        renderPatternCards()
      }
    })

    elements.customPatternCards.appendChild(card)
  })
}

function handleEnableAll() {
  Object.keys(config.patterns).forEach(key => {
    if (key !== 'custom' && config.patterns[key]) {
      config.patterns[key].enabled = true
    }
  })
  updateJsonConfig()
  renderPatternCards()
}

function handleDisableAll() {
  Object.keys(config.patterns).forEach(key => {
    if (key !== 'custom' && config.patterns[key]) {
      config.patterns[key].enabled = false
    }
  })
  updateJsonConfig()
  renderPatternCards()
}

let outputView = 'compact'

function setOutputView(view) {
  outputView = view
  elements.btnViewCompact.classList.toggle('active', view === 'compact')
  elements.btnViewExpanded.classList.toggle('active', view === 'expanded')
  elements.outputPatterns.classList.toggle('expanded', view === 'expanded')
  if (elements.outputCustomPatterns) {
    elements.outputCustomPatterns.classList.toggle(
      'expanded',
      view === 'expanded'
    )
  }
}

function renderOutputFormatTab() {
  const container = elements.outputPatterns
  container.innerHTML = ''

  // Render built-in patterns
  Object.entries(config.patterns || {}).forEach(([key, patternConfig]) => {
    if (key === 'custom') return
    if (!patternConfig.enabled) return // Only show enabled patterns

    const label = PATTERN_LABELS[key] || key
    const testInput = testInputs[key] || ''

    const row = document.createElement('div')
    row.className = 'pattern-row'
    row.innerHTML = `
      <div class="pattern-row-name">${label}</div>
      <div class="pattern-row-input">
        <input type="text" value="${escapeHtml(testInput)}" data-pattern="${key}" placeholder="Test ${label}...">
      </div>
      <div class="pattern-row-outputs">
        <div class="output-chip token" data-output="${key}-token" title="Token: Replaces with [TYPE_INDEX] placeholder">
          <span class="chip-label">Token</span>
          <span class="chip-value"></span>
        </div>
        <div class="output-chip mask" data-output="${key}-mask" title="Mask: Replaces characters with asterisks">
          <span class="chip-label">Mask</span>
          <span class="chip-value"></span>
        </div>
        <div class="output-chip format" data-output="${key}-format" title="Format: Generates realistic fake data">
          <span class="chip-label">Format</span>
          <span class="chip-value"></span>
        </div>
      </div>
    `

    container.appendChild(row)

    // Bind events
    const inputEl = row.querySelector('input')
    inputEl.addEventListener('input', e => {
      testInputs[key] = e.target.value
      updateOutputForPattern(key)
    })

    // Copy on chip click
    row.querySelectorAll('.output-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.querySelector('.chip-value').textContent
        if (text && text !== '-') {
          copyToClipboard(text, 'Output')
        }
      })
    })

    // Initial output
    updateOutputForPattern(key)
  })

  // Render custom patterns
  renderOutputCustomPatterns()
}

function renderOutputCustomPatterns() {
  const customPatterns = config.patterns.custom || []

  if (customPatterns.length === 0) {
    elements.outputCustomSection.classList.add('hidden')
    return
  }

  elements.outputCustomSection.classList.remove('hidden')
  elements.outputCustomPatterns.innerHTML = ''

  customPatterns.forEach((pattern, index) => {
    const key = `custom_${index}`
    // Priority: existing testInputs > stored sampleValue > empty
    // Always sync sampleValue to testInputs if available and testInputs is empty
    if (pattern.sampleValue && !testInputs[key]) {
      testInputs[key] = pattern.sampleValue
    }
    const testInput = testInputs[key] || ''

    const row = document.createElement('div')
    row.className = 'pattern-row'
    row.innerHTML = `
      <div class="pattern-row-name">${escapeHtml(pattern.name)}</div>
      <div class="pattern-row-input">
        <input type="text" value="${escapeHtml(testInput)}" data-custom-pattern="${index}" placeholder="Test ${escapeHtml(pattern.name)}...">
      </div>
      <div class="pattern-row-outputs">
        <div class="output-chip token" data-output="${key}-token" title="Token: Replaces with [${pattern.name.toUpperCase()}_INDEX] placeholder">
          <span class="chip-label">Token</span>
          <span class="chip-value"></span>
        </div>
        <div class="output-chip mask" data-output="${key}-mask" title="Mask: Replaces characters with asterisks">
          <span class="chip-label">Mask</span>
          <span class="chip-value"></span>
        </div>
        <div class="output-chip format" data-output="${key}-format" title="Format: Generates realistic fake data">
          <span class="chip-label">Format</span>
          <span class="chip-value"></span>
        </div>
      </div>
    `

    elements.outputCustomPatterns.appendChild(row)

    // Bind events
    const inputEl = row.querySelector('input')
    inputEl.addEventListener('input', e => {
      testInputs[key] = e.target.value
      updateOutputForCustomPattern(index, key)
    })

    // Copy on chip click
    row.querySelectorAll('.output-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.querySelector('.chip-value').textContent
        if (text && text !== '-') {
          copyToClipboard(text, 'Output')
        }
      })
    })

    // Initial output
    updateOutputForCustomPattern(index, key)
  })

  // Apply current view mode
  elements.outputCustomPatterns.classList.toggle(
    'expanded',
    outputView === 'expanded'
  )
}

function updateOutputForCustomPattern(index, key) {
  const pattern = config.patterns.custom[index]
  if (!pattern) return

  const testInput = testInputs[key] || ''
  const format = patternFormats[key] || {
    tokenFormat: `[${pattern.name.toUpperCase()}_{INDEX}]`,
    maskChar: '*',
    preserveStructure: true,
  }

  // Test with each strategy
  const strategies = ['token', 'mask', 'formatPreserving']
  const outputKeys = ['token', 'mask', 'format']
  const labels = ['Token', 'Mask', 'Format']

  strategies.forEach((strategy, i) => {
    const output = testCustomPatternWithStrategy(
      pattern,
      testInput,
      strategy,
      format
    )
    const chipValue = document.querySelector(
      `[data-output="${key}-${outputKeys[i]}"] .chip-value`
    )
    const chip = document.querySelector(
      `[data-output="${key}-${outputKeys[i]}"]`
    )
    if (chipValue) {
      chipValue.textContent = output || '-'
    }
    if (chip) {
      chip.title = output
        ? `${labels[i]}: ${output} (click to copy)`
        : `${labels[i]}: No output`
      chip.classList.toggle('has-value', !!output)
    }
  })
}

function testCustomPatternWithStrategy(pattern, testInput, strategy, format) {
  if (!testInput) return ''

  try {
    const testConfig = {
      ...config,
      formatOptions: {
        tokenFormat: format.tokenFormat,
        maskChar: format.maskChar,
        preserveStructure: format.preserveStructure,
      },
      patterns: {
        custom: [
          {
            ...pattern,
            strategy,
          },
        ],
      },
    }
    const redactor = new DataRedactor(testConfig)
    const result = redactor.redact(testInput)
    return result.redactedText !== testInput ? result.redactedText : ''
  } catch {
    return ''
  }
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
  const tokenChipValue = document.querySelector(
    `[data-output="${key}-token"] .chip-value`
  )
  const tokenChip = document.querySelector(`[data-output="${key}-token"]`)
  if (tokenChipValue) {
    tokenChipValue.textContent = tokenOutput || '-'
  }
  if (tokenChip) {
    tokenChip.title = tokenOutput
      ? `Token: ${tokenOutput} (click to copy)`
      : 'Token: No output'
    tokenChip.classList.toggle('has-value', !!tokenOutput)
  }

  // Mask output
  const maskOutput = testWithStrategy(key, testInput, 'mask', format)
  const maskChipValue = document.querySelector(
    `[data-output="${key}-mask"] .chip-value`
  )
  const maskChip = document.querySelector(`[data-output="${key}-mask"]`)
  if (maskChipValue) {
    maskChipValue.textContent = maskOutput || '-'
  }
  if (maskChip) {
    maskChip.title = maskOutput
      ? `Mask: ${maskOutput} (click to copy)`
      : 'Mask: No output'
    maskChip.classList.toggle('has-value', !!maskOutput)
  }

  // Format-preserving output
  const formatOutput = testWithStrategy(
    key,
    testInput,
    'formatPreserving',
    format
  )
  const formatChipValue = document.querySelector(
    `[data-output="${key}-format"] .chip-value`
  )
  const formatChip = document.querySelector(`[data-output="${key}-format"]`)
  if (formatChipValue) {
    formatChipValue.textContent = formatOutput || '-'
  }
  if (formatChip) {
    formatChip.title = formatOutput
      ? `Format: ${formatOutput} (click to copy)`
      : 'Format: No output'
    formatChip.classList.toggle('has-value', !!formatOutput)
  }
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
  // Persist to localStorage
  saveConfig()
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

    // Sync sampleValue from custom patterns to testInputs
    syncCustomPatternSampleValues()

    renderPatternCards()
    renderOutputFormatTab()
  } catch {
    elements.jsonError.textContent = 'Invalid JSON - will not apply until fixed'
    elements.jsonError.classList.remove('hidden')
  }
}

// Sync sampleValue from custom patterns to testInputs for Output Format tab
function syncCustomPatternSampleValues() {
  const customPatterns = config.patterns?.custom || []
  customPatterns.forEach((pattern, index) => {
    const key = `custom_${index}`
    // If pattern has sampleValue and testInputs doesn't have it yet, sync it
    if (pattern.sampleValue && !testInputs[key]) {
      testInputs[key] = pattern.sampleValue
    }
  })
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
          syncCustomPatternSampleValues()
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

function handleSaveConfig() {
  // Apply the JSON editor content to config and save to localStorage
  try {
    const parsed = JSON.parse(jsonConfig)
    config = parsed
    saveConfig()
    syncCustomPatternSampleValues()
    renderPatternCards()
    renderOutputFormatTab()

    // Show success feedback
    const btn = elements.btnSaveConfig
    const originalText = btn.innerHTML
    btn.innerHTML = '<span class="json-btn-icon">&#x2714;</span> Saved!'
    btn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    setTimeout(() => {
      btn.innerHTML = originalText
      btn.style.background = ''
    }, 1500)
  } catch {
    alert('Cannot save: Invalid JSON. Please fix the errors first.')
  }
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
  // Clear localStorage
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to clear config from localStorage:', e)
  }
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

// Existing Patterns Management

function renderExistingPatterns() {
  const customPatterns = config.patterns.custom || []

  if (customPatterns.length === 0) {
    elements.existingPatternsSection.classList.add('hidden')
    return
  }

  elements.existingPatternsSection.classList.remove('hidden')
  elements.existingPatternsList.innerHTML = ''

  customPatterns.forEach((pattern, index) => {
    const card = document.createElement('div')
    card.className = `existing-pattern-card${editingPatternIndex === index ? ' editing' : ''}`
    card.innerHTML = `
      <div class="existing-pattern-info">
        <div class="existing-pattern-name">${escapeHtml(pattern.name)}</div>
        <div class="existing-pattern-regex">${escapeHtml(pattern.regex)}</div>
        ${pattern.sampleValue ? `<div class="existing-pattern-sample">Sample: <code>${escapeHtml(pattern.sampleValue)}</code></div>` : ''}
      </div>
      <div class="existing-pattern-actions">
        <button class="btn-edit-pattern" data-index="${index}">Edit</button>
      </div>
    `

    // Click on card or edit button to load pattern
    card.querySelector('.btn-edit-pattern').addEventListener('click', e => {
      e.stopPropagation()
      loadPatternForEditing(index)
    })

    card.addEventListener('click', () => {
      loadPatternForEditing(index)
    })

    elements.existingPatternsList.appendChild(card)
  })
}

function loadPatternForEditing(index) {
  const pattern = config.patterns.custom[index]
  if (!pattern) return

  editingPatternIndex = index

  // Show editing indicator
  elements.editingIndicator.classList.add('visible')
  elements.editingPatternName.textContent = pattern.name

  // Clear current state
  handleClearMarks()
  generatedPattern = null
  elements.builderResult.classList.add('hidden')

  // Reset samples container to single sample
  elements.samplesContainer.innerHTML = `
    <div class="sample-wrapper" data-sample-index="0">
      <div class="sample-header">
        <span class="sample-label">Sample 1</span>
      </div>
      <div class="builder-input-editable sample-input" contenteditable="true" placeholder="Paste your sample data here..."></div>
    </div>
  `
  sampleCount = 1

  // If pattern has a sample value, populate it and mark it
  if (pattern.sampleValue) {
    const firstSample = elements.samplesContainer.querySelector('.sample-input')
    // Create a mark element with the sample value
    const mark = document.createElement('mark')
    mark.className = 'marked-text'
    mark.textContent = pattern.sampleValue
    firstSample.appendChild(mark)

    // Add to marked texts
    markedTexts = [pattern.sampleValue]
    fullSampleTexts = [pattern.sampleValue]
    updateMarkedTextsDisplay()
  }

  // Set pattern name in the result section
  elements.builderPatternName.value = pattern.name

  // Update existing patterns list to show editing state
  renderExistingPatterns()

  // Scroll to sample input
  elements.samplesContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function handleCancelEdit() {
  editingPatternIndex = null
  elements.editingIndicator.classList.remove('visible')

  // Clear the builder
  handleClearMarks()
  generatedPattern = null
  elements.builderResult.classList.add('hidden')

  // Reset samples
  elements.samplesContainer.innerHTML = `
    <div class="sample-wrapper" data-sample-index="0">
      <div class="sample-header">
        <span class="sample-label">Sample 1</span>
      </div>
      <div class="builder-input-editable sample-input" contenteditable="true" placeholder="Paste your sample data here..."></div>
    </div>
  `
  sampleCount = 1

  // Update existing patterns list to remove editing state
  renderExistingPatterns()
}

// Pattern Builder handlers

// Get all sample input elements
function getSampleInputs() {
  return elements.samplesContainer.querySelectorAll('.sample-input')
}

// Add a new sample input field
function handleAddSample() {
  sampleCount++
  const wrapper = document.createElement('div')
  wrapper.className = 'sample-wrapper'
  wrapper.dataset.sampleIndex = sampleCount - 1

  wrapper.innerHTML = `
    <div class="sample-header">
      <span class="sample-label">Sample ${sampleCount}</span>
      <button class="btn-remove-sample" onclick="this.closest('.sample-wrapper').remove(); updateSampleLabels();">Remove</button>
    </div>
    <div class="builder-input-editable sample-input" contenteditable="true" placeholder="Paste another sample here..."></div>
  `

  elements.samplesContainer.appendChild(wrapper)
}

// Update sample labels after removal
window.updateSampleLabels = function () {
  const wrappers = elements.samplesContainer.querySelectorAll('.sample-wrapper')
  wrappers.forEach((wrapper, index) => {
    wrapper.querySelector('.sample-label').textContent = `Sample ${index + 1}`
    wrapper.dataset.sampleIndex = index
  })
  sampleCount = wrappers.length
}

function handleMarkSelection() {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    alert('Please select some text first, then click Mark Selection')
    return
  }

  const range = selection.getRangeAt(0)

  // Find which sample container the selection is in
  let container = null
  const sampleInputs = getSampleInputs()
  for (const input of sampleInputs) {
    if (input.contains(range.commonAncestorContainer)) {
      container = input
      break
    }
  }

  if (!container) {
    alert('Please select text within one of the sample data areas')
    return
  }

  // Wrap selection in a mark element
  const mark = document.createElement('mark')
  mark.className = 'marked-text'

  try {
    range.surroundContents(mark)
  } catch {
    // If surroundContents fails (crosses element boundaries), use extractContents
    const fragment = range.extractContents()
    mark.appendChild(fragment)
    range.insertNode(mark)
  }

  // Add this marked text to our list
  const markedValue = mark.textContent
  if (markedValue && !markedTexts.includes(markedValue)) {
    markedTexts.push(markedValue)
    // Store the full sample text for this mark
    fullSampleTexts.push(container.textContent)
  }

  updateMarkedTextsDisplay()

  // Clear the selection
  selection.removeAllRanges()
}

function handleClearMarks() {
  // Clear marks from all sample inputs
  const sampleInputs = getSampleInputs()
  sampleInputs.forEach(container => {
    const marks = container.querySelectorAll('mark, .marked-text')
    marks.forEach(mark => {
      const text = document.createTextNode(mark.textContent)
      mark.parentNode.replaceChild(text, mark)
    })
    container.normalize()
  })

  markedTexts = []
  fullSampleTexts = []
  updateMarkedTextsDisplay()
}

function updateMarkedTextsDisplay() {
  if (markedTexts.length > 0) {
    elements.markedTextsList.classList.remove('hidden')
    elements.markedTextsChips.innerHTML = markedTexts
      .map(
        (text, index) => `
        <span class="marked-chip">
          <span>${escapeHtml(text)}</span>
          <button class="chip-remove" onclick="removeMarkedText(${index})">×</button>
        </span>
      `
      )
      .join('')
  } else {
    elements.markedTextsList.classList.add('hidden')
    elements.markedTextsChips.innerHTML = ''
  }
}

// Remove a specific marked text
window.removeMarkedText = function (index) {
  markedTexts.splice(index, 1)
  fullSampleTexts.splice(index, 1)
  updateMarkedTextsDisplay()
}

function handleGeneratePattern() {
  // Check if we have marked texts - use those for pattern generation
  if (markedTexts.length > 0) {
    const options = {
      addWordBoundaries: elements.builderWordBoundaries.checked,
      caseInsensitive: elements.builderCaseInsensitive.checked,
    }

    if (markedTexts.length === 1) {
      generatedPattern = generateFromSample(markedTexts[0], options)
    } else {
      // Use multiple samples to refine the pattern
      generatedPattern = refineFromSamples(markedTexts, options)
    }

    renderPatternResult()
    return
  }

  // Fallback - check first sample input for any text
  const firstSample = getSampleInputs()[0]
  const sampleText = firstSample ? firstSample.textContent.trim() : ''

  if (!sampleText) {
    alert('Please enter sample data and mark the text you want to match')
    return
  }

  alert(
    'Please select and mark the specific text you want to create a pattern for'
  )
}

function renderPatternResult() {
  if (!generatedPattern) {
    elements.builderResult.classList.add('hidden')
    return
  }

  elements.builderResult.classList.remove('hidden')

  // Set pattern name
  elements.builderPatternName.value = generatedPattern.suggestedName

  // Show regex
  elements.builderRegex.textContent = generatedPattern.regex

  // Validation status
  const allSamplesMatch = markedTexts.every(sample => {
    try {
      const flags = elements.builderCaseInsensitive.checked ? 'i' : ''
      const regex = new RegExp(generatedPattern.regex, flags)
      return regex.test(sample)
    } catch {
      return false
    }
  })

  elements.builderValidation.className =
    'validation-status ' + (generatedPattern.valid ? 'valid' : 'invalid')
  if (generatedPattern.valid) {
    if (markedTexts.length > 1) {
      elements.builderValidation.textContent = allSamplesMatch
        ? `Pattern is valid and matches all ${markedTexts.length} samples`
        : `Pattern is valid but does not match all samples`
    } else {
      elements.builderValidation.textContent = generatedPattern.matchesSample
        ? 'Pattern is valid and matches the sample data'
        : 'Pattern is valid but does not match the sample data'
    }
  } else {
    elements.builderValidation.textContent = `Invalid pattern: ${generatedPattern.error || 'Unknown error'}`
  }

  // Warnings
  elements.builderWarnings.innerHTML = generatedPattern.warnings
    .map(w => `<div class="warning-item">${escapeHtml(w)}</div>`)
    .join('')

  // Generate human-readable explanation
  elements.builderExplanation.innerHTML =
    generatePatternExplanation(generatedPattern)

  // Segments
  elements.builderSegments.innerHTML = generatedPattern.segments
    .map(
      s =>
        `<span class="segment-chip ${s.type}">${escapeHtml(s.description)}</span>`
    )
    .join('')

  // Auto-populate test input with the full sample texts
  const testText =
    fullSampleTexts.length > 0
      ? fullSampleTexts.join('\n\n')
      : markedTexts.join('\n')
  elements.builderTestInput.value = testText

  // Run the test automatically
  handleTestPattern()
}

// Generate a human-readable explanation of what the pattern does
function generatePatternExplanation(pattern) {
  if (!pattern || !pattern.segments || pattern.segments.length === 0) {
    return '<p>No pattern segments to explain.</p>'
  }

  const segments = pattern.segments
  let explanation =
    '<span class="explanation-title">This pattern matches text that:</span>'
  explanation += '<ul>'

  // Build explanation from segments
  let position = 1
  for (const segment of segments) {
    let desc = ''

    switch (segment.type) {
      case 'digit':
        if (segment.minLength === segment.maxLength) {
          desc = `Has exactly <code>${segment.minLength}</code> digit(s) at position ${position}`
        } else {
          desc = `Has <code>${segment.minLength}-${segment.maxLength}</code> digits at position ${position}`
        }
        break
      case 'lower':
        if (segment.minLength === segment.maxLength) {
          desc = `Has exactly <code>${segment.minLength}</code> lowercase letter(s) at position ${position}`
        } else {
          desc = `Has <code>${segment.minLength}-${segment.maxLength}</code> lowercase letters at position ${position}`
        }
        break
      case 'upper':
        if (segment.minLength === segment.maxLength) {
          desc = `Has exactly <code>${segment.minLength}</code> uppercase letter(s) at position ${position}`
        } else {
          desc = `Has <code>${segment.minLength}-${segment.maxLength}</code> uppercase letters at position ${position}`
        }
        break
      case 'hex':
        desc = `Has <code>${segment.minLength}</code> hexadecimal character(s) (0-9, a-f) at position ${position}`
        break
      case 'literal':
        desc = `Contains the exact text <code>${escapeHtml(segment.originalValue || segment.description.replace('literal "', '').replace('"', ''))}</code>`
        break
      case 'whitespace':
        desc = `Has whitespace at position ${position}`
        break
      case 'uuid':
        desc = `Is a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)`
        break
      case 'ipv4':
        desc = `Is an IPv4 address (format: xxx.xxx.xxx.xxx)`
        break
      case 'mac':
        desc = `Is a MAC address`
        break
      default:
        desc = segment.description
    }

    if (desc) {
      explanation += `<li>${desc}</li>`
      position++
    }
  }

  explanation += '</ul>'

  // Add summary based on number of samples
  if (markedTexts.length > 1) {
    explanation += `<p><strong>Generated from ${markedTexts.length} samples:</strong> The pattern was refined to match common structure across all your marked examples.</p>`
  }

  // Add regex breakdown
  explanation += `<p><strong>Regex breakdown:</strong> <code>${escapeHtml(pattern.regex)}</code></p>`

  return explanation
}

function handleCopyRegex() {
  if (generatedPattern && generatedPattern.regex) {
    copyToClipboard(generatedPattern.regex, 'Regex pattern')
  }
}

function handleTestPattern() {
  const testInput = elements.builderTestInput.value
  if (!generatedPattern || !generatedPattern.regex || !testInput) {
    elements.builderTestResult.textContent = ''
    elements.builderTestResult.className = 'test-result'
    return
  }

  try {
    const flags = elements.builderCaseInsensitive.checked ? 'gi' : 'g'
    const regex = new RegExp(generatedPattern.regex, flags)
    const matches = testInput.match(regex)

    if (matches && matches.length > 0) {
      const uniqueMatches = [...new Set(matches)]
      elements.builderTestResult.textContent = `Found ${matches.length} match(es): "${uniqueMatches.join('", "')}"`
      elements.builderTestResult.className = 'test-result match'
    } else {
      elements.builderTestResult.textContent = 'No match found'
      elements.builderTestResult.className = 'test-result no-match'
    }
  } catch (error) {
    elements.builderTestResult.textContent = `Error: ${error.message}`
    elements.builderTestResult.className = 'test-result no-match'
  }
}

function handleAddPattern() {
  if (!generatedPattern || !generatedPattern.valid) {
    alert('Cannot add an invalid pattern')
    return
  }

  const patternName = elements.builderPatternName.value.trim()
  if (!patternName) {
    alert('Please enter a pattern name')
    return
  }

  // Add to custom patterns
  if (!config.patterns.custom) {
    config.patterns.custom = []
  }

  // Store the sample text for testing in Output Format tab
  const sampleValue = markedTexts.length > 0 ? markedTexts[0] : ''

  // Check if we're editing an existing pattern or creating new
  if (editingPatternIndex !== null) {
    // Update existing pattern
    const existingStrategy =
      config.patterns.custom[editingPatternIndex].strategy || 'token'
    config.patterns.custom[editingPatternIndex] = {
      name: patternName,
      regex: generatedPattern.regex,
      strategy: existingStrategy,
      sampleValue: sampleValue,
    }

    // Update test input for this pattern
    testInputs[`custom_${editingPatternIndex}`] = sampleValue

    // Clear editing state
    editingPatternIndex = null
    elements.editingIndicator.classList.remove('visible')

    updateJsonConfig()
    renderPatternCards()
    renderOutputFormatTab()

    // Switch to Output Format tab to show the updated pattern
    setActiveTab('output')

    alert(
      `Pattern "${patternName}" updated! You can see the changes in the Output Format tab.`
    )
  } else {
    // Create new pattern
    config.patterns.custom.push({
      name: patternName,
      regex: generatedPattern.regex,
      strategy: 'token',
      sampleValue: sampleValue,
    })

    // Pre-populate test input for this custom pattern
    const customIndex = config.patterns.custom.length - 1
    testInputs[`custom_${customIndex}`] = sampleValue

    updateJsonConfig()
    renderPatternCards()
    renderOutputFormatTab()

    // Switch to Output Format tab to show the new pattern in action
    setActiveTab('output')

    alert(
      `Pattern "${patternName}" added! You can see it in the Output Format tab with your sample value pre-filled.`
    )
  }
}

// Handle pattern submission to community patterns API
async function handleSubmitPattern() {
  if (!generatedPattern || !generatedPattern.valid) {
    showSubmitStatus('Please generate a valid pattern first', 'error')
    return
  }

  const patternName = elements.builderPatternName.value.trim()
  const description = elements.patternDescription.value.trim()
  const category = elements.patternCategory.value

  if (!patternName) {
    showSubmitStatus('Please enter a pattern name', 'error')
    return
  }

  if (!description) {
    showSubmitStatus('Please enter a description for the pattern', 'error')
    return
  }

  if (!category) {
    showSubmitStatus('Please select a category', 'error')
    return
  }

  // Prepare submission data
  const submission = {
    name: patternName,
    regex: generatedPattern.regex,
    description: description,
    category: category,
    samples: markedTexts,
    segments: generatedPattern.segments,
  }

  showSubmitStatus('Submitting pattern...', 'pending')

  try {
    // Try to submit to the API
    const response = await fetch(`${API_BASE_URL}/api/patterns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission),
    })

    if (response.ok) {
      const data = await response.json()
      showSubmitStatus(
        `Pattern submitted successfully! ID: ${data.id}. It will appear in the Community tab after review.`,
        'success'
      )

      // Clear the form
      elements.patternDescription.value = ''
      elements.patternCategory.value = ''

      console.log('Pattern submitted to API:', data)
    } else {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to submit pattern')
    }
  } catch (error) {
    // If API fails, fall back to local storage
    console.error('API submission failed, storing locally:', error)

    const submissions = JSON.parse(
      localStorage.getItem('dataRedactor_submissions') || '[]'
    )
    submissions.push({ ...submission, submittedAt: new Date().toISOString() })
    localStorage.setItem(
      'dataRedactor_submissions',
      JSON.stringify(submissions)
    )

    showSubmitStatus(
      'API offline - Pattern saved locally. Start the API server and visit the Community tab to sync.',
      'warning'
    )
  }
}

function showSubmitStatus(message, type) {
  elements.submitStatus.textContent = message
  elements.submitStatus.className = `submit-status ${type}`
  elements.submitStatus.classList.remove('hidden')

  // Auto-hide success messages after 5 seconds
  if (type === 'success') {
    setTimeout(() => {
      elements.submitStatus.classList.add('hidden')
    }, 5000)
  }
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

// ==========================================
// Community Patterns Tab Functions
// ==========================================

async function fetchCommunityPatterns() {
  const category = elements.communityCategoryFilter.value
  const status = elements.communityStatusFilter.value
  const offset = (communityCurrentPage - 1) * PATTERNS_PER_PAGE

  elements.communityPatternsList.innerHTML =
    '<div class="loading-message">Loading patterns...</div>'

  try {
    let url = `${API_BASE_URL}/api/patterns?limit=${PATTERNS_PER_PAGE}&offset=${offset}`
    if (category) url += `&category=${category}`
    if (status) url += `&status=${status}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    communityPatterns = data.patterns || []
    communityTotalCount = data.count || 0
    communityTotalPages =
      Math.ceil(communityTotalCount / PATTERNS_PER_PAGE) || 1

    renderCommunityPatterns()
    updatePagination()
  } catch (error) {
    console.error('Failed to fetch community patterns:', error)
    elements.communityPatternsList.innerHTML = `
      <div class="error-message">
        <p>Failed to load patterns. Make sure the API server is running.</p>
        <code>bun run packages/api/server.ts</code>
      </div>
    `
    elements.communityPagination.classList.add('hidden')
    elements.communityEmpty.classList.add('hidden')
  }
}

function renderCommunityPatterns() {
  if (communityPatterns.length === 0) {
    elements.communityPatternsList.innerHTML = ''
    elements.communityEmpty.classList.remove('hidden')
    elements.communityPagination.classList.add('hidden')
    return
  }

  elements.communityEmpty.classList.add('hidden')
  elements.communityPatternsList.innerHTML = communityPatterns
    .map(
      pattern => `
    <div class="community-pattern-card" data-id="${pattern.id}">
      <div class="community-pattern-header">
        <div class="community-pattern-name">${escapeHtml(pattern.name)}</div>
        <span class="community-pattern-status ${pattern.status}">${pattern.status}</span>
      </div>
      <div class="community-pattern-regex"><code>${escapeHtml(pattern.regex)}</code></div>
      ${pattern.description ? `<div class="community-pattern-desc">${escapeHtml(pattern.description)}</div>` : ''}
      <div class="community-pattern-meta">
        <span class="community-pattern-category">${escapeHtml(pattern.category || 'custom')}</span>
        <span class="community-pattern-stats">
          <span class="stat" title="Upvotes">👍 ${pattern.upvotes || 0}</span>
          <span class="stat" title="Downvotes">👎 ${pattern.downvotes || 0}</span>
          <span class="stat" title="Times used">📊 ${pattern.usage_count || 0}</span>
        </span>
      </div>
      ${
        pattern.samples && pattern.samples.length > 0
          ? `
        <div class="community-pattern-samples">
          <span class="samples-label">Samples:</span>
          ${pattern.samples
            .slice(0, 3)
            .map(s => `<code class="sample-chip">${escapeHtml(s)}</code>`)
            .join('')}
          ${pattern.samples.length > 3 ? `<span class="more-samples">+${pattern.samples.length - 3} more</span>` : ''}
        </div>
      `
          : ''
      }
      <div class="community-pattern-actions">
        <button class="btn-vote btn-upvote" onclick="handleVote('${pattern.id}', 'up')" title="Upvote this pattern">
          👍 Upvote
        </button>
        <button class="btn-vote btn-downvote" onclick="handleVote('${pattern.id}', 'down')" title="Downvote this pattern">
          👎 Downvote
        </button>
        <button class="btn-use-pattern" onclick="handleUsePattern('${pattern.id}')" title="Add to your configuration">
          ✅ Use Pattern
        </button>
      </div>
    </div>
  `
    )
    .join('')
}

function updatePagination() {
  if (communityTotalCount <= PATTERNS_PER_PAGE) {
    elements.communityPagination.classList.add('hidden')
    return
  }

  elements.communityPagination.classList.remove('hidden')
  elements.paginationInfo.textContent = `Page ${communityCurrentPage} of ${communityTotalPages}`
  elements.btnPrevPage.disabled = communityCurrentPage <= 1
  elements.btnNextPage.disabled = communityCurrentPage >= communityTotalPages
}

function changePage(delta) {
  const newPage = communityCurrentPage + delta
  if (newPage >= 1 && newPage <= communityTotalPages) {
    communityCurrentPage = newPage
    fetchCommunityPatterns()
  }
}

// Vote on a community pattern
window.handleVote = async function (patternId, vote) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/patterns/${patternId}/vote`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to vote')
    }

    // Refresh patterns to show updated vote counts
    fetchCommunityPatterns()
  } catch (error) {
    console.error('Vote error:', error)
    alert('Failed to submit vote. Please try again.')
  }
}

// Use a community pattern - add to local config
window.handleUsePattern = async function (patternId) {
  const pattern = communityPatterns.find(p => p.id === patternId)
  if (!pattern) {
    alert('Pattern not found')
    return
  }

  // Add to custom patterns
  if (!config.patterns.custom) {
    config.patterns.custom = []
  }

  // Check if pattern already exists
  const exists = config.patterns.custom.some(
    p => p.name === pattern.name || p.regex === pattern.regex
  )
  if (exists) {
    alert(`Pattern "${pattern.name}" is already in your configuration`)
    return
  }

  config.patterns.custom.push({
    name: pattern.name,
    regex: pattern.regex,
    strategy: 'token',
    sampleValue:
      pattern.samples && pattern.samples.length > 0 ? pattern.samples[0] : '',
  })

  // Update test inputs
  const customIndex = config.patterns.custom.length - 1
  if (pattern.samples && pattern.samples.length > 0) {
    testInputs[`custom_${customIndex}`] = pattern.samples[0]
  }

  updateJsonConfig()
  renderPatternCards()
  renderOutputFormatTab()

  // Track usage (silently fail if API unavailable)
  try {
    await fetch(`${API_BASE_URL}/api/patterns/${patternId}/use`, {
      method: 'POST',
    })
  } catch {
    // Silently fail - usage tracking is not critical
  }

  // Switch to JSON Editor tab to show the added pattern
  setActiveTab('json')

  alert(
    `Pattern "${pattern.name}" added to your configuration! The regex has been added to the JSON config.`
  )
}
