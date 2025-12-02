// Data Redactor - Vanilla JS UI
import {
  DataRedactor,
  DEFAULT_CONFIG,
  generateFromSample,
  refineFromSamples,
  PatternTestEngine,
  calculateQualityScore,
  getQualityTier,
  getTestSamplesForPattern,
  getTestSample,
  BasePattern,
} from '../core/src/index.js'
import { extractText, isSupported } from './utils/fileExtractor.js'

// LocalStorage key for persisting config
const CONFIG_STORAGE_KEY = 'dataRedactor_config'

// Helper function to create a Pattern instance from pattern name and config
function createPatternFromConfig(patternName, patternConfig) {
  if (!patternConfig || !patternConfig.regex) {
    return null
  }

  try {
    const regex = new RegExp(patternConfig.regex, patternConfig.flags || 'g')
    return new BasePattern(
      patternName,
      regex,
      patternConfig.strategy || 'token',
      patternConfig.enabled !== false
    )
  } catch (error) {
    console.error(`Failed to create pattern ${patternName}:`, error)
    return null
  }
}

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
// API URL detection:
// - Dev mode (localhost:3000): API on port 3001
// - Production/Vercel: API on same origin
const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
const isDevMode = isLocalhost && window.location.port === '3000'
const API_BASE_URL = isDevMode
  ? 'http://localhost:3001' // Dev mode: UI on 3000, API on 3001
  : window.location.origin // Production/Vercel: same origin
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

// State
let edgeCaseViewMode = 'compact' // 'compact' or 'expanded'

// Initialize
document.addEventListener('DOMContentLoaded', init)

function init() {
  cacheElements()
  bindEvents()
  syncCustomPatternSampleValues() // Sync sample values from loaded config
  renderPatternCards()
  renderOutputFormatTab()
  updateJsonConfig()
  if (elements.versionBadge) {
    elements.versionBadge.textContent = 'v1.0.8'
  }
  initAccordionState()
  initTabsScroll()
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
  elements.tabValidation = document.getElementById('tab-validation')
  elements.contentSimple = document.getElementById('content-simple')
  elements.contentJson = document.getElementById('content-json')
  elements.contentOutput = document.getElementById('content-output')
  elements.contentValidation = document.getElementById('content-validation')

  // Validation sub-tabs
  elements.subtabBuilder = document.getElementById('subtab-builder')
  elements.subtabTests = document.getElementById('subtab-tests')
  elements.subtabCommunity = document.getElementById('subtab-community')
  elements.subtabIssues = document.getElementById('subtab-issues')
  elements.subcontentBuilder = document.getElementById('subcontent-builder')
  elements.subcontentTests = document.getElementById('subcontent-tests')
  elements.subcontentCommunity = document.getElementById('subcontent-community')
  elements.subcontentIssues = document.getElementById('subcontent-issues')

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
  elements.btnUploadFile = document.getElementById('btn-upload-file')
  elements.fileDropZone = document.getElementById('file-drop-zone')
  elements.fileInput = document.getElementById('file-input')
  elements.fileStatus = document.getElementById('file-status')
  elements.fileStatusIcon = document.getElementById('file-status-icon')
  elements.fileStatusText = document.getElementById('file-status-text')
  elements.btnClearFile = document.getElementById('btn-clear-file')
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

  // Community sub-tab elements (now under validation)
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

  // Test Samples sub-tab elements
  elements.testPatternSelect = document.getElementById('test-pattern-select')
  elements.qualityScoreDisplay = document.getElementById(
    'quality-score-display'
  )
  elements.qualityScoreBadge = document.getElementById('quality-score-badge')
  elements.qualityScoreBreakdown = document.getElementById(
    'quality-score-breakdown'
  )
  elements.testResultsContainer = document.getElementById(
    'test-results-container'
  )

  // Edge Cases sub-tab elements
  elements.edgeCasePatternFilter = document.getElementById(
    'edge-case-pattern-filter'
  )
  elements.edgeCaseStatusFilter = document.getElementById(
    'edge-case-status-filter'
  )
  elements.edgeCaseSort = document.getElementById('edge-case-sort')
  elements.edgeCasesList = document.getElementById('edge-cases-list')
  elements.edgeCasePagination = document.getElementById('edge-case-pagination')
  elements.btnEdgeCaseCompact = document.getElementById('btn-edge-case-compact')
  elements.btnEdgeCaseExpanded = document.getElementById(
    'btn-edge-case-expanded'
  )

  // JSON Editor test metadata elements
  elements.btnShowTestMetadata = document.getElementById(
    'btn-show-test-metadata'
  )
  elements.testSamplesMetadata = document.getElementById(
    'test-samples-metadata'
  )
  elements.btnCloseMetadata = document.getElementById('btn-close-metadata')
  elements.metadataContent = document.getElementById('metadata-content')
  elements.btnPrevEdgeCases = document.getElementById('btn-prev-edge-cases')
  elements.btnNextEdgeCases = document.getElementById('btn-next-edge-cases')
  elements.edgeCasePaginationInfo = document.getElementById(
    'edge-case-pagination-info'
  )

  // Report Issue modal elements
  elements.btnReportIssue = document.getElementById('btn-report-issue')
  elements.reportIssueModal = document.getElementById('report-issue-modal')
  elements.btnCloseModal = document.getElementById('btn-close-modal')
  elements.btnCancelIssue = document.getElementById('btn-cancel-issue')
  elements.btnSubmitIssue = document.getElementById('btn-submit-issue')
  elements.issuePattern = document.getElementById('issue-pattern')
  elements.issueType = document.getElementById('issue-type')
  elements.issueSampleText = document.getElementById('issue-sample-text')
  elements.issueProblematicValue = document.getElementById(
    'issue-problematic-value'
  )
  elements.issueExpectedBehavior = document.getElementById(
    'issue-expected-behavior'
  )
  elements.issueContext = document.getElementById('issue-context')
  elements.lineCount = document.getElementById('line-count')
  elements.issueSubmitStatus = document.getElementById('issue-submit-status')
}

function bindEvents() {
  // Helper function to safely add event listener
  const addListener = (element, event, handler) => {
    if (element) {
      element.addEventListener(event, handler)
    } else {
      console.warn('Element not found for event binding:', event)
    }
  }

  // Tabs
  addListener(elements.tabSimple, 'click', () => setActiveTab('simple'))
  addListener(elements.tabJson, 'click', () => setActiveTab('json'))
  addListener(elements.tabOutput, 'click', () => setActiveTab('output'))
  addListener(elements.tabValidation, 'click', () => setActiveTab('validation'))

  // Sub-tabs
  addListener(elements.subtabBuilder, 'click', () => setActiveSubTab('builder'))
  addListener(elements.subtabTests, 'click', () => setActiveSubTab('tests'))
  addListener(elements.subtabCommunity, 'click', () =>
    setActiveSubTab('community')
  )
  addListener(elements.subtabIssues, 'click', () => setActiveSubTab('issues'))

  // Main actions
  addListener(elements.btnRedact, 'click', handleRedact)
  addListener(elements.btnCopy, 'click', handleCopy)
  addListener(elements.btnClear, 'click', handleClear)
  addListener(elements.btnCopyMapping, 'click', handleCopyMapping)
  addListener(elements.btnInsertTest, 'click', handleInsertTestData)

  // File upload events
  addListener(elements.btnUploadFile, 'click', () => elements.fileInput.click())
  addListener(elements.fileDropZone, 'click', () => elements.fileInput.click())
  addListener(elements.fileInput, 'change', handleFileSelect)
  addListener(elements.fileDropZone, 'dragover', handleDragOver)
  addListener(elements.fileDropZone, 'dragleave', handleDragLeave)
  addListener(elements.fileDropZone, 'drop', handleFileDrop)
  addListener(elements.btnClearFile, 'click', handleClearFile)

  // JSON actions
  addListener(elements.btnImportJson, 'click', handleImportJson)
  addListener(elements.btnSaveConfig, 'click', handleSaveConfig)
  addListener(elements.btnExportEdited, 'click', handleExportEditedJson)
  addListener(elements.btnExportDefault, 'click', handleExportDefaultJson)
  addListener(elements.btnReset, 'click', handleResetConfig)

  // Test metadata panel
  addListener(elements.btnShowTestMetadata, 'click', showTestMetadataPanel)
  addListener(elements.btnCloseMetadata, 'click', hideTestMetadataPanel)

  // Input sync
  addListener(elements.inputText, 'input', e => {
    inputText = e.target.value
  })

  addListener(elements.jsonEditor, 'input', e => {
    handleJsonChange(e.target.value)
  })

  // Enable/Disable all patterns
  addListener(elements.btnEnableAll, 'click', handleEnableAll)
  addListener(elements.btnDisableAll, 'click', handleDisableAll)

  // Output Format view toggle
  addListener(elements.btnViewCompact, 'click', () => setOutputView('compact'))
  addListener(elements.btnViewExpanded, 'click', () =>
    setOutputView('expanded')
  )

  // Pattern Builder events
  addListener(elements.btnMarkSelection, 'click', handleMarkSelection)
  addListener(elements.btnClearMarks, 'click', handleClearMarks)
  addListener(elements.btnAddSample, 'click', handleAddSample)
  addListener(elements.btnGeneratePattern, 'click', handleGeneratePattern)
  addListener(elements.btnCopyRegex, 'click', handleCopyRegex)
  addListener(elements.btnAddPattern, 'click', handleAddPattern)
  addListener(elements.builderTestInput, 'input', handleTestPattern)
  addListener(elements.btnSubmitPattern, 'click', handleSubmitPattern)
  addListener(elements.btnCancelEdit, 'click', handleCancelEdit)

  // Community tab events
  addListener(elements.btnRefreshPatterns, 'click', fetchCommunityPatterns)
  addListener(
    elements.communityCategoryFilter,
    'change',
    fetchCommunityPatterns
  )
  addListener(elements.communityStatusFilter, 'change', fetchCommunityPatterns)
  addListener(elements.btnPrevPage, 'click', () => changePage(-1))

  // Report Issue modal events
  addListener(elements.btnReportIssue, 'click', openReportIssueModal)
  addListener(elements.btnCloseModal, 'click', closeReportIssueModal)
  addListener(elements.btnCancelIssue, 'click', closeReportIssueModal)
  addListener(elements.btnSubmitIssue, 'click', handleSubmitIssue)
  addListener(elements.issueSampleText, 'input', updateLineCount)
  addListener(elements.issueSampleText, 'mouseup', handleSampleTextSelection)

  // Modal overlay click handler - needs special handling
  if (elements.reportIssueModal) {
    const modalOverlay =
      elements.reportIssueModal.querySelector('.modal-overlay')
    addListener(modalOverlay, 'click', closeReportIssueModal)
  }

  addListener(elements.btnNextPage, 'click', () => changePage(1))
  addListener(elements.btnGoBuilder, 'click', () => {
    setActiveTab('validation')
    setActiveSubTab('builder')
  })
}

function setActiveTab(tab) {
  // Update tab styles
  elements.tabSimple.classList.toggle('active', tab === 'simple')
  elements.tabJson.classList.toggle('active', tab === 'json')
  elements.tabOutput.classList.toggle('active', tab === 'output')
  elements.tabValidation.classList.toggle('active', tab === 'validation')

  // Show/hide content
  elements.contentSimple.classList.toggle('hidden', tab !== 'simple')
  elements.contentJson.classList.toggle('hidden', tab !== 'json')
  elements.contentOutput.classList.toggle('hidden', tab !== 'output')
  elements.contentValidation.classList.toggle('hidden', tab !== 'validation')

  // Scroll to active tab on mobile
  scrollToActiveTab()

  // Initialize sub-tabs when switching to validation tab
  if (tab === 'validation') {
    // Default to builder sub-tab
    setActiveSubTab('builder')
  }
}

function setActiveSubTab(subtab) {
  // Update sub-tab styles
  elements.subtabBuilder.classList.toggle('active', subtab === 'builder')
  elements.subtabTests.classList.toggle('active', subtab === 'tests')
  elements.subtabCommunity.classList.toggle('active', subtab === 'community')
  elements.subtabIssues.classList.toggle('active', subtab === 'issues')

  // Show/hide sub-content
  elements.subcontentBuilder.classList.toggle('hidden', subtab !== 'builder')
  elements.subcontentTests.classList.toggle('hidden', subtab !== 'tests')
  elements.subcontentCommunity.classList.toggle(
    'hidden',
    subtab !== 'community'
  )
  elements.subcontentIssues.classList.toggle('hidden', subtab !== 'issues')

  // Render existing patterns when switching to builder sub-tab
  if (subtab === 'builder') {
    renderExistingPatterns()
  }

  // Fetch community patterns when switching to community sub-tab
  if (subtab === 'community') {
    fetchCommunityPatterns()
  }

  // Populate pattern selects when switching to tests or issues sub-tabs
  if (subtab === 'tests') {
    populateTestPatternSelect()
  }

  if (subtab === 'issues') {
    populateEdgeCaseFilters()
    fetchEdgeCases()
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

    // Enable Report Issue button after redaction
    if (elements.btnReportIssue) {
      elements.btnReportIssue.disabled = false
    }
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

// File Upload Handlers
function handleDragOver(e) {
  e.preventDefault()
  e.stopPropagation()
  elements.fileDropZone.classList.add('drag-over')
}

function handleDragLeave(e) {
  e.preventDefault()
  e.stopPropagation()
  elements.fileDropZone.classList.remove('drag-over')
}

function handleFileDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  elements.fileDropZone.classList.remove('drag-over')

  const files = e.dataTransfer.files
  if (files.length > 0) {
    processFiles(files)
  }
}

function handleFileSelect(e) {
  const files = e.target.files
  if (files.length > 0) {
    processFiles(files)
  }
}

async function processFiles(files) {
  // Show processing status
  showFileStatus('processing', 'Processing file...')

  try {
    let combinedText = ''

    for (const file of files) {
      if (!isSupported(file)) {
        showFileStatus('error', `Unsupported format: ${file.name}`)
        return
      }

      const result = await extractText(file)

      if (result.error) {
        if (result.isScanned) {
          showFileStatus(
            'warning',
            `${file.name}: Scanned PDF detected. Text-based PDFs only.`
          )
        } else {
          showFileStatus('error', `${file.name}: ${result.error}`)
        }
        return
      }

      if (result.text) {
        if (combinedText) combinedText += '\n\n'
        combinedText += result.text
      }
    }

    if (combinedText) {
      inputText = combinedText
      elements.inputText.value = inputText

      const fileCount = files.length
      const charCount = combinedText.length.toLocaleString()
      showFileStatus(
        'success',
        `Extracted ${charCount} characters from ${fileCount} file${fileCount > 1 ? 's' : ''}`
      )
    } else {
      showFileStatus('warning', 'No text content found in file(s)')
    }
  } catch (err) {
    showFileStatus('error', `Error: ${err.message}`)
  }

  // Reset file input for re-upload
  elements.fileInput.value = ''
}

function showFileStatus(type, message) {
  elements.fileStatus.classList.remove('hidden', 'success', 'error', 'warning')
  elements.fileStatus.classList.add(type)

  const icons = {
    processing: '&#x23F3;',
    success: '&#x2705;',
    error: '&#x274C;',
    warning: '&#x26A0;',
  }

  elements.fileStatusIcon.innerHTML = icons[type] || icons.processing
  elements.fileStatusText.textContent = message
}

function handleClearFile() {
  elements.fileStatus.classList.add('hidden')
  elements.fileInput.value = ''
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

// =============================================================================
// TEST METADATA PANEL (JSON EDITOR)
// =============================================================================

// Helper to fetch known issues count from API
async function getKnownIssuesCount(patternName) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/patterns/${patternName}/edge-cases?status=open`
    )
    if (!response.ok) return 0
    const data = await response.json()
    return data.count || 0
  } catch {
    return 0
  }
}

async function showTestMetadataPanel() {
  // Load test samples for all built-in patterns and calculate quality scores
  const builtInPatterns = [
    'ipv4',
    'ipv6',
    'macAddress',
    'email',
    'phone',
    'ssn',
    'creditCard',
    'hostname',
    'ticketNumber',
    'name',
    'uuid',
    'filePath',
  ]

  const patternMetadata = await Promise.all(
    builtInPatterns.map(async patternName => {
      const testSamples = getTestSamplesForPattern(patternName)
      const patternConfig = config.patterns[patternName]

      if (!testSamples || testSamples.length === 0 || !patternConfig) {
        return null
      }

      // Execute tests
      const testResults = []
      const pattern = createPatternFromConfig(patternName, patternConfig)
      if (!pattern) {
        return null
      }

      for (const sample of testSamples) {
        const result = PatternTestEngine.executeTest(pattern, sample)
        testResults.push(result)
      }

      // Calculate quality score
      const knownIssues = await getKnownIssuesCount(patternName)
      const qualityScoreBreakdown = calculateQualityScore(
        testResults,
        knownIssues
      )
      const qualityScore = qualityScoreBreakdown.totalScore
      const qualityTier = getQualityTier(qualityScore)
      const passedTests = testResults.filter(r => r.passed).length

      return {
        patternName,
        sampleIds: testSamples.map(s => s.id),
        sampleCount: testSamples.length,
        qualityScore,
        qualityTier,
        passedTests,
        totalTests: testResults.length,
        knownIssues,
      }
    })
  )

  const filteredMetadata = patternMetadata.filter(Boolean)

  // Render metadata
  elements.metadataContent.innerHTML = filteredMetadata
    .map(
      meta => `
    <div class="pattern-metadata-card">
      <div class="metadata-card-header">
        <h5>${formatPatternName(meta.patternName)}</h5>
        <span class="quality-badge ${meta.qualityTier}">
          ${meta.qualityScore}
        </span>
      </div>

      <div class="metadata-card-body">
        <div class="metadata-stat">
          <span class="metadata-label">Test Samples:</span>
          <span class="metadata-value">${meta.sampleCount}</span>
        </div>
        <div class="metadata-stat">
          <span class="metadata-label">Tests Passed:</span>
          <span class="metadata-value">${meta.passedTests}/${meta.totalTests}</span>
        </div>

        <div class="metadata-samples">
          <details>
            <summary class="metadata-summary">View Sample IDs (${meta.sampleCount})</summary>
            <div class="metadata-sample-list">
              ${meta.sampleIds.map(id => `<code class="sample-id">${id}</code>`).join('')}
            </div>
          </details>
        </div>
      </div>

      <div class="metadata-card-footer">
        <button class="btn btn-small btn-primary" onclick="navigateToTestSamples('${meta.patternName}')">
          View Test Results
        </button>
      </div>
    </div>
  `
    )
    .join('')

  elements.testSamplesMetadata.classList.remove('hidden')
}

function hideTestMetadataPanel() {
  elements.testSamplesMetadata.classList.add('hidden')
}

// Navigate to Test Samples sub-tab with specific pattern pre-selected
window.navigateToTestSamples = function (patternName) {
  // Switch to Pattern Validation tab
  setActiveTab('validation')

  // Switch to Test Samples sub-tab
  setActiveSubTab('tests')

  // Set the pattern in the dropdown
  elements.testPatternSelect.value = patternName

  // Trigger the change event to load test results
  handleTestPatternChange()

  // Hide the metadata panel
  hideTestMetadataPanel()
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

// =============================================================================
// PATTERN BUILDER PRE-LOAD SYSTEM
// =============================================================================

/**
 * Pre-load Pattern Builder with a sample to fix
 * @param {Object} params
 * @param {string} params.patternName - Pattern name (e.g., 'ipv4')
 * @param {string} params.sampleText - Full sample text (log, config, etc.)
 * @param {string} params.problematicValue - Specific value causing the issue
 * @param {string} params.currentRegex - Current regex for this pattern
 * @param {string} params.context - Context description (e.g., "Fixing false-positive")
 */
function preloadPatternBuilder({
  patternName,
  sampleText,
  problematicValue,
  currentRegex,
  context,
}) {
  // Switch to Pattern Validation tab
  setActiveTab('validation')

  // Switch to Builder sub-tab
  setActiveSubTab('builder')

  // Clear existing samples
  elements.samplesContainer.innerHTML = ''
  markedTexts = []
  fullSampleTexts = []
  sampleCount = 0

  // Add the pre-loaded sample
  sampleCount = 1
  const wrapper = document.createElement('div')
  wrapper.className = 'sample-wrapper'
  wrapper.dataset.sampleIndex = 0

  wrapper.innerHTML = `
    <div class="sample-header">
      <span class="sample-label">Sample 1 (Pre-loaded)</span>
      <button class="btn-remove-sample" onclick="this.closest('.sample-wrapper').remove(); updateSampleLabels();">Remove</button>
    </div>
    <div class="builder-input-editable sample-input" contenteditable="true">${escapeHtml(sampleText)}</div>
  `

  elements.samplesContainer.appendChild(wrapper)

  // Show context banner
  const contextBanner = document.createElement('div')
  contextBanner.className = 'preload-context-banner'
  contextBanner.setAttribute('data-pattern-key', patternName)
  contextBanner.innerHTML = `
    <div class="banner-content">
      <strong>🔧 Fixing Pattern:</strong> ${formatPatternName(patternName)}
      <span class="banner-context">${context}</span>
    </div>
    <div class="banner-info">
      <span class="banner-label">Current Regex:</span>
      <code class="banner-regex">${escapeHtml(currentRegex || 'Not set')}</code>
    </div>
    <div class="banner-hint">
      <strong>Problematic Value:</strong> <code>${escapeHtml(problematicValue)}</code>
    </div>
    <div class="banner-actions">
      <button class="btn btn-primary" onclick="saveToBuiltInPattern()" style="margin-right: 10px;">
        💾 Save Improved Regex to Pattern
      </button>
      <button class="btn-small btn-secondary" onclick="clearPreloadBanner()">Clear Banner</button>
    </div>
  `

  // Insert banner before samples container
  const samplesHeader = elements.samplesContainer.previousElementSibling
  samplesHeader.insertAdjacentElement('afterend', contextBanner)

  // Scroll to Pattern Builder
  elements.samplesContainer.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })

  // Highlight the problematic value in the sample text
  if (problematicValue && sampleText.includes(problematicValue)) {
    setTimeout(() => {
      const sampleInput =
        elements.samplesContainer.querySelector('.sample-input')
      if (sampleInput) {
        // Find the problematic value and wrap it in a highlight span
        const content = sampleInput.textContent
        const index = content.indexOf(problematicValue)
        if (index !== -1) {
          const before = content.substring(0, index)
          const match = content.substring(
            index,
            index + problematicValue.length
          )
          const after = content.substring(index + problematicValue.length)

          sampleInput.innerHTML = `${escapeHtml(before)}<mark style="background: rgba(241, 196, 15, 0.3); color: #f1c40f; font-weight: bold;">${escapeHtml(match)}</mark>${escapeHtml(after)}`
        }
      }
    }, 100)
  }

  // Show success message
  alert(
    `Pattern Builder pre-loaded!\n\nPattern: ${formatPatternName(patternName)}\nContext: ${context}\n\nThe problematic value is highlighted. Select and mark the text you want to match, then click "Generate Pattern".`
  )
}

// Clear the pre-load context banner
window.clearPreloadBanner = function () {
  const banner = document.querySelector('.preload-context-banner')
  if (banner) {
    banner.remove()
  }
}

/**
 * Save improved regex to built-in pattern configuration
 * This is called when fixing a built-in pattern from test failures or edge cases
 */
window.saveToBuiltInPattern = function () {
  if (!generatedPattern || !generatedPattern.valid) {
    alert('Please generate a valid pattern first')
    return
  }

  // Get pattern name from banner
  const banner = document.querySelector('.preload-context-banner')
  if (!banner) {
    alert(
      'No pre-loaded pattern found. Use "Add to Config" for custom patterns.'
    )
    return
  }

  // Get pattern key from data attribute
  const patternKey = banner.getAttribute('data-pattern-key')
  if (!patternKey || !config.patterns[patternKey]) {
    alert(`Pattern not found in config: ${patternKey}`)
    return
  }

  const formattedName = formatPatternName(patternKey)

  // Get OLD pattern config for comparison
  const oldPatternConfig = { ...config.patterns[patternKey] }

  // Get test samples for this pattern
  const testSamples = getTestSamplesForPattern(patternKey)

  if (!testSamples || testSamples.length === 0) {
    // No test samples, just save without testing
    config.patterns[patternKey].regex = generatedPattern.regex
    config.patterns[patternKey].lastTested = new Date().toISOString()

    updateJsonConfig()
    renderPatternCards()

    window.clearPreloadBanner()

    alert(
      `✅ Pattern updated!\n\nPattern: ${formattedName}\nNew regex saved to configuration.\n\nNo test samples available for comparison.`
    )
    return
  }

  // Test OLD regex
  const oldTestResults = []
  const oldPattern = createPatternFromConfig(patternKey, oldPatternConfig)
  if (!oldPattern) {
    alert(`Error: Could not create pattern for ${formattedName}`)
    return
  }

  for (const sample of testSamples) {
    const result = PatternTestEngine.executeTest(oldPattern, sample)
    oldTestResults.push(result)
  }
  const oldQualityScoreBreakdown = calculateQualityScore(oldTestResults, 0)
  const oldQualityScore = oldQualityScoreBreakdown.totalScore

  // Test NEW regex
  const newPatternConfig = {
    ...oldPatternConfig,
    regex: generatedPattern.regex,
  }
  const newPattern = createPatternFromConfig(patternKey, newPatternConfig)
  if (!newPattern) {
    alert(`Error: Could not create pattern with new regex for ${formattedName}`)
    return
  }

  const newTestResults = []
  for (const sample of testSamples) {
    const result = PatternTestEngine.executeTest(newPattern, sample)
    newTestResults.push(result)
  }
  const newQualityScoreBreakdown = calculateQualityScore(newTestResults, 0)
  const newQualityScore = newQualityScoreBreakdown.totalScore

  // Calculate improvements
  const oldPassed = oldTestResults.filter(r => r.passed).length
  const newPassed = newTestResults.filter(r => r.passed).length
  const improvement = newQualityScore - oldQualityScore

  // Show comparison
  const comparisonMessage = `
📊 Pattern Test Results Comparison

Pattern: ${formattedName}

BEFORE (Old Regex):
  Quality Score: ${oldQualityScore}/100
  Tests Passed: ${oldPassed}/${oldTestResults.length}

AFTER (New Regex):
  Quality Score: ${newQualityScore}/100
  Tests Passed: ${newPassed}/${newTestResults.length}

${improvement > 0 ? `✅ Improvement: +${improvement} points` : improvement < 0 ? `⚠️ Regression: ${improvement} points` : '⚪ No change in quality score'}

Do you want to save this regex to the built-in pattern configuration?
  `.trim()

  if (confirm(comparisonMessage)) {
    // Save new regex
    config.patterns[patternKey].regex = generatedPattern.regex
    config.patterns[patternKey].qualityScore = newQualityScore
    config.patterns[patternKey].lastTested = new Date().toISOString()

    updateJsonConfig()
    renderPatternCards()

    // Clear the banner
    window.clearPreloadBanner()

    alert(
      `✅ Pattern saved successfully!\n\nThe improved regex has been saved to your configuration.\n\nNew Quality Score: ${newQualityScore}/100`
    )
  }
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
    elements.communityPatternsList.classList.add('hidden')
    elements.communityEmpty.classList.remove('hidden')
    elements.communityPagination.classList.add('hidden')
    return
  }

  elements.communityPatternsList.classList.remove('hidden')
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

// =============================================================================
// REPORT ISSUE MODAL
// =============================================================================

function openReportIssueModal() {
  // Populate pattern dropdown
  populatePatternDropdown()

  // Pre-fill with input text if available
  if (inputText) {
    elements.issueSampleText.value = inputText
    updateLineCount()
  }

  // Show modal
  elements.reportIssueModal.classList.remove('hidden')
  document.body.style.overflow = 'hidden'
}

function closeReportIssueModal() {
  elements.reportIssueModal.classList.add('hidden')
  document.body.style.overflow = ''

  // Clear form
  elements.issuePattern.value = ''
  elements.issueType.value = 'false-positive'
  elements.issueSampleText.value = ''
  elements.issueProblematicValue.value = ''
  elements.issueExpectedBehavior.value = 'should-match'
  elements.issueContext.value = ''
  elements.issueSubmitStatus.classList.add('hidden')
}

function populatePatternDropdown() {
  const select = elements.issuePattern
  select.innerHTML = '<option value="">Select pattern...</option>'

  // Add built-in patterns
  const builtInPatterns = [
    'ipv4',
    'ipv6',
    'macAddress',
    'email',
    'phone',
    'ssn',
    'creditCard',
    'creditCardLast4',
    'hostname',
    'ticketNumber',
    'name',
    'uuid',
    'filePath',
  ]

  builtInPatterns.forEach(key => {
    if (config.patterns[key] && config.patterns[key].enabled) {
      const option = document.createElement('option')
      option.value = key
      option.textContent = formatPatternName(key)
      select.appendChild(option)
    }
  })

  // Add custom patterns
  if (config.patterns.custom && config.patterns.custom.length > 0) {
    config.patterns.custom.forEach((pattern, index) => {
      const option = document.createElement('option')
      option.value = `custom_${index}`
      option.textContent = `${pattern.name} (Custom)`
      select.appendChild(option)
    })
  }
}

function formatPatternName(key) {
  const names = {
    ipv4: 'IPv4 Address',
    ipv6: 'IPv6 Address',
    macAddress: 'MAC Address',
    email: 'Email',
    phone: 'Phone Number',
    ssn: 'SSN',
    creditCard: 'Credit Card',
    creditCardLast4: 'Credit Card Last 4',
    hostname: 'Hostname',
    ticketNumber: 'Ticket Number',
    name: 'Name',
    uuid: 'UUID',
    filePath: 'File Path',
  }
  return names[key] || key
}

function updateLineCount() {
  const text = elements.issueSampleText.value
  const lineCount = text.split('\n').length
  elements.lineCount.textContent = lineCount

  if (lineCount > 500) {
    elements.lineCount.style.color = '#e74c3c'
  } else {
    elements.lineCount.style.color = '#666'
  }
}

function handleSampleTextSelection() {
  const text = elements.issueSampleText
  const start = text.selectionStart
  const end = text.selectionEnd

  if (start !== end) {
    const selectedText = text.value.substring(start, end)
    elements.issueProblematicValue.value = selectedText
  }
}

async function handleSubmitIssue() {
  const patternName = elements.issuePattern.value
  const reportType = elements.issueType.value
  const fullSampleText = elements.issueSampleText.value
  const problematicValue = elements.issueProblematicValue.value
  const expectedBehavior = elements.issueExpectedBehavior.value
  const context = elements.issueContext.value

  // Validation
  if (!patternName) {
    showIssueStatus('Please select a pattern', 'error')
    return
  }

  if (!fullSampleText) {
    showIssueStatus('Please provide sample text', 'error')
    return
  }

  if (!problematicValue) {
    showIssueStatus('Please provide the problematic value', 'error')
    return
  }

  const lineCount = fullSampleText.split('\n').length
  if (lineCount > 500) {
    showIssueStatus('Sample text exceeds 500 line limit', 'error')
    return
  }

  // Disable submit button
  elements.btnSubmitIssue.disabled = true
  elements.btnSubmitIssue.textContent = 'Submitting...'

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/patterns/${patternName}/edge-cases`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          fullSampleText,
          problematicValue,
          expectedBehavior,
          context: context || undefined,
        }),
      }
    )

    if (response.ok) {
      await response.json() // Consume response
      showIssueStatus(
        'Issue submitted successfully! Thank you for your feedback.',
        'success'
      )

      // Close modal after delay
      setTimeout(() => {
        closeReportIssueModal()
      }, 2000)
    } else {
      const error = await response.json()
      showIssueStatus(error.error || 'Failed to submit issue', 'error')
    }
  } catch (error) {
    console.error('Submit issue error:', error)
    showIssueStatus('Network error. Please check your connection.', 'error')
  } finally {
    elements.btnSubmitIssue.disabled = false
    elements.btnSubmitIssue.textContent = 'Submit Issue'
  }
}

function showIssueStatus(message, type) {
  elements.issueSubmitStatus.textContent = message
  elements.issueSubmitStatus.className = `submit-status ${type}`
  elements.issueSubmitStatus.classList.remove('hidden')
}

// =============================================================================
// TEST SAMPLES SUB-TAB FUNCTIONS
// =============================================================================

function populateTestPatternSelect() {
  const select = elements.testPatternSelect

  // Clear existing options except the first one
  while (select.options.length > 1) {
    select.remove(1)
  }

  // Add all built-in patterns
  const builtInPatterns = [
    'ipv4',
    'ipv6',
    'macAddress',
    'email',
    'phone',
    'ssn',
    'creditCard',
    'hostname',
    'ticketNumber',
    'name',
    'uuid',
    'filePath',
  ]

  builtInPatterns.forEach(key => {
    const option = document.createElement('option')
    option.value = key
    option.textContent = formatPatternName(key)
    select.appendChild(option)
  })

  // Add event listener
  select.addEventListener('change', handleTestPatternChange)
}

async function handleTestPatternChange() {
  const patternName = elements.testPatternSelect.value

  if (!patternName) {
    elements.qualityScoreDisplay.classList.add('hidden')
    elements.testResultsContainer.innerHTML =
      '<div class="empty-state">Select a pattern above to view test samples and run tests.</div>'
    return
  }

  // Load test samples for the selected pattern
  const testSamples = getTestSamplesForPattern(patternName)

  if (!testSamples || testSamples.length === 0) {
    elements.qualityScoreDisplay.classList.add('hidden')
    elements.testResultsContainer.innerHTML = `
      <div class="info-box" style="background: rgba(241, 196, 15, 0.1); border-color: #f1c40f;">
        <strong>No test samples found for pattern:</strong> ${formatPatternName(patternName)}
      </div>
    `
    return
  }

  // Get pattern configuration
  const patternConfig = config.patterns[patternName]
  if (!patternConfig) {
    elements.qualityScoreDisplay.classList.add('hidden')
    elements.testResultsContainer.innerHTML = `
      <div class="info-box" style="background: rgba(231, 76, 60, 0.1); border-color: #e74c3c;">
        <strong>Error:</strong> Pattern configuration not found for ${formatPatternName(patternName)}
      </div>
    `
    return
  }

  // Execute tests
  const testResults = []
  const pattern = createPatternFromConfig(patternName, patternConfig)
  if (!pattern) {
    elements.qualityScoreDisplay.classList.add('hidden')
    elements.testResultsContainer.innerHTML = `
      <div class="info-box" style="background: rgba(231, 76, 60, 0.1); border-color: #e74c3c;">
        <strong>Error:</strong> Could not create pattern instance for ${formatPatternName(patternName)}
      </div>
    `
    return
  }

  for (const sample of testSamples) {
    const result = PatternTestEngine.executeTest(pattern, sample)
    testResults.push(result)
  }

  // Calculate quality score
  const knownIssues = await getKnownIssuesCount(patternName)
  const qualityScoreBreakdown = calculateQualityScore(testResults, knownIssues)
  const qualityScore = qualityScoreBreakdown.totalScore
  const qualityTier = getQualityTier(qualityScore)

  // Display quality score
  elements.qualityScoreDisplay.classList.remove('hidden')
  elements.qualityScoreBadge.className = `quality-badge ${qualityTier}`
  elements.qualityScoreBadge.innerHTML = `${qualityScore}`

  // Display quality breakdown
  const passedTests = testResults.filter(r => r.passed).length
  const totalTests = testResults.length
  const avgAccuracy =
    testResults.reduce((sum, r) => sum + r.accuracy, 0) / totalTests

  elements.qualityScoreBreakdown.innerHTML = `
    <div class="quality-stats">
      <div class="stat">
        <span class="stat-label">Tests Passed:</span>
        <span class="stat-value">${passedTests}/${totalTests}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Avg Accuracy:</span>
        <span class="stat-value">${Math.round(avgAccuracy)}%</span>
      </div>
      <div class="stat">
        <span class="stat-label">Known Issues:</span>
        <span class="stat-value">${knownIssues}</span>
      </div>
    </div>
  `

  // Render test results with samples for names
  renderTestResults(testResults, testSamples)
}

// Test result view mode (compact or expanded)
let testResultViewMode = 'compact'

function renderTestResults(testResults, testSamples) {
  if (!testResults || testResults.length === 0) {
    elements.testResultsContainer.innerHTML =
      '<div class="empty-state">No test results available.</div>'
    return
  }

  // Add view toggle buttons if not already present
  const existingToggle = document.querySelector('.test-view-toggle')
  if (!existingToggle) {
    const toggleHTML = `
      <div class="test-view-toggle">
        <button id="btn-test-compact" class="view-btn ${testResultViewMode === 'compact' ? 'active' : ''}">Compact</button>
        <button id="btn-test-expanded" class="view-btn ${testResultViewMode === 'expanded' ? 'active' : ''}">Expanded</button>
      </div>
    `
    elements.qualityScoreDisplay.insertAdjacentHTML('afterend', toggleHTML)

    // Attach event listeners
    document
      .getElementById('btn-test-compact')
      .addEventListener('click', () => {
        testResultViewMode = 'compact'
        renderTestResults(testResults, testSamples)
      })
    document
      .getElementById('btn-test-expanded')
      .addEventListener('click', () => {
        testResultViewMode = 'expanded'
        renderTestResults(testResults, testSamples)
      })
  } else {
    // Update active states
    document.getElementById('btn-test-compact').className =
      `view-btn ${testResultViewMode === 'compact' ? 'active' : ''}`
    document.getElementById('btn-test-expanded').className =
      `view-btn ${testResultViewMode === 'expanded' ? 'active' : ''}`
  }

  const viewClass =
    testResultViewMode === 'compact'
      ? 'test-result-card-compact'
      : 'test-result-card-expanded'

  elements.testResultsContainer.innerHTML = testResults
    .map(result => {
      const statusClass = result.passed ? 'passed' : 'failed'
      const statusIcon = result.passed ? '✅' : '⚠️'

      // Find the sample to get name and category
      const sample = testSamples.find(s => s.id === result.sampleId)
      const sampleName = sample ? sample.name : result.sampleId
      const sampleCategory = sample ? sample.category : ''
      const sampleContent = sample ? sample.content : ''

      return `
      <div class="test-result-card ${viewClass} ${statusClass}">
        <div class="test-header">
          <h4>${sampleName}</h4>
          <span class="badge ${statusClass}">
            ${statusIcon} ${result.accuracy}% accurate
          </span>
        </div>

        <div class="test-stats">
          <span>Expected: ${result.expectedCount}</span>
          <span>Found: ${result.actualCount}</span>
          ${sampleCategory ? `<span class="category-badge">${sampleCategory}</span>` : ''}
        </div>

        ${
          result.falsePositives.length > 0
            ? `
          <div class="false-positives">
            <strong>❌ False Positives (matched but shouldn't):</strong>
            <div class="matches-list">
              ${result.falsePositives.map(fp => `<code>${escapeHtml(fp)}</code>`).join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          result.falseNegatives.length > 0
            ? `
          <div class="false-negatives">
            <strong>⚠️ Missed Matches (should have matched):</strong>
            <div class="matches-list">
              ${result.falseNegatives.map(fn => `<code>${escapeHtml(fn)}</code>`).join('')}
            </div>
          </div>
        `
            : ''
        }

        ${
          result.passed
            ? `
          <div class="test-success">
            All expected matches found with no false positives!
          </div>
        `
            : ''
        }

        <!-- Full Sample Content (only in expanded view) -->
        <div class="test-sample-content">
          <strong>Full Sample Text:</strong>
          <pre class="sample-content-pre">${escapeHtml(sampleContent)}</pre>
        </div>

        <div class="test-actions">
          ${
            !result.passed
              ? `
            <button class="btn btn-small btn-primary" onclick="fixPatternFromTest('${result.patternName}', '${result.sampleId}')">
              Fix in Builder
            </button>
          `
              : ''
          }
        </div>
      </div>
    `
    })
    .join('')
}

// View test sample detail in a modal
window.viewTestSampleDetail = function (sampleId) {
  const sample = getTestSample(sampleId)

  if (!sample) {
    alert('Test sample not found')
    return
  }

  // Create modal overlay
  const modal = document.createElement('div')
  modal.className = 'modal'
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content" style="max-width: 800px;">
      <div class="modal-header">
        <h2 class="modal-title">Test Sample: ${sample.name}</h2>
        <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
      </div>

      <div class="modal-body">
        <div class="info-box" style="margin-bottom: 20px;">
          <strong>Category:</strong> ${sample.category}<br>
          <strong>Sample ID:</strong> ${sample.id}
        </div>

        <h3 style="color: #002868; margin-bottom: 10px;">Sample Content:</h3>
        <pre style="background: rgba(0, 40, 104, 0.1); padding: 15px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(sample.content)}</pre>

        <h3 style="color: #002868; margin-top: 20px; margin-bottom: 10px;">Expected Matches (${sample.expectedMatches.length}):</h3>
        <div style="display: grid; gap: 10px;">
          ${sample.expectedMatches
            .map(
              match => `
            <div style="background: ${match.shouldMatch ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)'}; padding: 12px; border-radius: 8px; border: 1px solid ${match.shouldMatch ? 'rgba(39, 174, 96, 0.3)' : 'rgba(231, 76, 60, 0.3)'};">
              <div><strong>Value:</strong> <code>${escapeHtml(match.value)}</code></div>
              <div><strong>Should Match:</strong> ${match.shouldMatch ? '✅ Yes' : '❌ No'}</div>
              ${match.reason ? `<div><strong>Reason:</strong> ${escapeHtml(match.reason)}</div>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)
  modal.classList.remove('hidden')
}

// Fix pattern from failed test (pre-load into Pattern Builder)
window.fixPatternFromTest = function (patternName, sampleId) {
  // Load the test sample
  const testSample = getTestSample(sampleId)
  if (!testSample) {
    alert(`Test sample not found: ${sampleId}`)
    return
  }

  // Get the current pattern configuration
  const patternConfig = config.patterns[patternName]
  if (!patternConfig) {
    alert(`Pattern configuration not found: ${patternName}`)
    return
  }

  // Get the first expected match as the problematic value
  const problematicValue = testSample.expectedMatches[0]?.value || ''

  // Pre-load into Pattern Builder
  preloadPatternBuilder({
    patternName,
    sampleText: testSample.content,
    problematicValue,
    currentRegex: patternConfig.regex,
    context: `Fixing failed test: ${testSample.name}`,
  })
}

// =============================================================================
// EDGE CASES SUB-TAB FUNCTIONS
// =============================================================================

function populateEdgeCaseFilters() {
  const select = elements.edgeCasePatternFilter

  // Clear existing options except the first one
  while (select.options.length > 1) {
    select.remove(1)
  }

  // Add all built-in patterns
  const builtInPatterns = [
    'ipv4',
    'ipv6',
    'macAddress',
    'email',
    'phone',
    'ssn',
    'creditCard',
    'hostname',
    'ticketNumber',
    'name',
    'uuid',
    'filePath',
  ]

  builtInPatterns.forEach(key => {
    const option = document.createElement('option')
    option.value = key
    option.textContent = formatPatternName(key)
    select.appendChild(option)
  })

  // Add event listeners for filters (real-time updates)
  elements.edgeCasePatternFilter.addEventListener('change', fetchEdgeCases)
  elements.edgeCaseStatusFilter.addEventListener('change', fetchEdgeCases)
  elements.edgeCaseSort.addEventListener('change', fetchEdgeCases)

  // Edge case view toggle
  if (elements.btnEdgeCaseCompact) {
    elements.btnEdgeCaseCompact.addEventListener('click', () =>
      setEdgeCaseViewMode('compact')
    )
  }
  if (elements.btnEdgeCaseExpanded) {
    elements.btnEdgeCaseExpanded.addEventListener('click', () =>
      setEdgeCaseViewMode('expanded')
    )
  }
}

function setEdgeCaseViewMode(mode) {
  edgeCaseViewMode = mode

  // Update button states
  if (elements.btnEdgeCaseCompact) {
    elements.btnEdgeCaseCompact.classList.toggle('active', mode === 'compact')
  }
  if (elements.btnEdgeCaseExpanded) {
    elements.btnEdgeCaseExpanded.classList.toggle('active', mode === 'expanded')
  }

  // Re-render edge cases with new view mode
  const cards = document.querySelectorAll('.edge-case-card')
  cards.forEach(card => {
    if (mode === 'compact') {
      card.classList.add('edge-case-card-compact')
      card.classList.remove('edge-case-card-expanded')
    } else {
      card.classList.add('edge-case-card-expanded')
      card.classList.remove('edge-case-card-compact')
    }
  })
}

async function fetchEdgeCases() {
  const patternName = elements.edgeCasePatternFilter.value
  const status = elements.edgeCaseStatusFilter.value

  elements.edgeCasesList.innerHTML =
    '<div class="loading-message">Loading edge cases...</div>'

  try {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('limit', '20')
    params.append('offset', '0')

    const url = patternName
      ? `${API_BASE_URL}/api/patterns/${patternName}/edge-cases?${params}`
      : `${API_BASE_URL}/api/edge-cases?${params}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch edge cases')
    }

    const data = await response.json()

    if (!data.edgeCases || data.edgeCases.length === 0) {
      elements.edgeCasesList.innerHTML =
        '<div class="empty-state">No edge cases found. Report an issue from the Pattern Detection tab.</div>'
      elements.edgeCasePagination.classList.add('hidden')
      return
    }

    renderEdgeCases(data.edgeCases)

    // Update pagination
    if (data.count > 20) {
      elements.edgeCasePagination.classList.remove('hidden')
      elements.edgeCasePaginationInfo.textContent = `Showing ${data.edgeCases.length} of ${data.count}`
    } else {
      elements.edgeCasePagination.classList.add('hidden')
    }
  } catch (error) {
    console.error('Fetch edge cases error:', error)
    elements.edgeCasesList.innerHTML = `
      <div class="info-box" style="background: rgba(231, 76, 60, 0.1); border-color: #e74c3c;">
        <strong>Error:</strong> Could not load edge cases. Make sure MongoDB is configured and the server is running.
      </div>
    `
  }
}

function renderEdgeCases(edgeCases) {
  const viewClass =
    edgeCaseViewMode === 'compact'
      ? 'edge-case-card-compact'
      : 'edge-case-card-expanded'

  elements.edgeCasesList.innerHTML = edgeCases
    .map(
      issue => `
    <div class="edge-case-card ${viewClass}" data-id="${issue.id}">
      <div class="edge-case-header">
        <div class="edge-case-pattern">
          <strong>${formatPatternName(issue.pattern_name)}</strong>
          <span class="badge badge-${issue.report_type}">${issue.report_type.replace('-', ' ')}</span>
          <span class="badge badge-${issue.status}">${issue.status}</span>
        </div>
        <div class="edge-case-votes">
          <button class="vote-btn vote-up" data-id="${issue.id}">▲</button>
          <span class="vote-count">${issue.votes}</span>
          <button class="vote-btn vote-down" data-id="${issue.id}">▼</button>
        </div>
      </div>

      <div class="edge-case-body">
        <div class="edge-case-problem">
          <strong>Problematic Value:</strong>
          <code>${escapeHtml(issue.problematic_value)}</code>
        </div>
        <div class="edge-case-expected">
          <strong>Expected:</strong> ${issue.expected_behavior}
        </div>
        ${issue.context ? `<div class="edge-case-context"><strong>Context:</strong> ${escapeHtml(issue.context)}</div>` : ''}

        <!-- Full Sample Text (only in expanded view) -->
        <div class="edge-case-full-sample">
          <strong>Full Sample Text:</strong>
          <pre class="sample-text-pre">${escapeHtml(issue.full_sample_text)}</pre>
        </div>
      </div>

      <div class="edge-case-footer">
        <span class="edge-case-date">${formatDate(issue.created_at)}</span>
        <button class="btn btn-small btn-primary" onclick="fixInBuilder('${issue.id}')">Fix in Builder</button>
      </div>
    </div>
  `
    )
    .join('')

  // Add vote event listeners
  document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', handleEdgeCaseVote)
  })
}

async function handleEdgeCaseVote(event) {
  const button = event.currentTarget
  const id = button.dataset.id
  const voteType = button.classList.contains('vote-up') ? 'up' : 'down'

  try {
    const response = await fetch(`${API_BASE_URL}/api/edge-cases/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote: voteType }),
    })

    if (response.ok) {
      // Refresh the list
      fetchEdgeCases()
    }
  } catch (error) {
    console.error('Vote error:', error)
  }
}

window.fixInBuilder = async function (id) {
  try {
    // Fetch the edge case details from API
    const response = await fetch(`${API_BASE_URL}/api/edge-cases/${id}`)

    if (!response.ok) {
      alert('Failed to load edge case details. Please try again.')
      return
    }

    const edgeCase = await response.json()

    // Get the current pattern configuration
    const patternConfig = config.patterns[edgeCase.pattern_name]
    if (!patternConfig) {
      alert(`Pattern configuration not found: ${edgeCase.pattern_name}`)
      return
    }

    // Pre-load into Pattern Builder
    preloadPatternBuilder({
      patternName: edgeCase.pattern_name,
      sampleText: edgeCase.full_sample_text,
      problematicValue: edgeCase.problematic_value,
      currentRegex: patternConfig.regex,
      context: `Fixing ${edgeCase.report_type}: ${edgeCase.expected_behavior}`,
    })
  } catch (error) {
    console.error('Error loading edge case:', error)
    alert('Failed to load edge case details. API may be offline.')
  }
}

function formatDate(isoString) {
  if (!isoString) return 'Unknown date'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
