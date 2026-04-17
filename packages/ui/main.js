// Data Redactor - Presidio-powered UI

// API URL detection
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const isDevMode = isLocalhost && window.location.port === '3000'
const API_BASE_URL = isDevMode ? 'http://localhost:3001' : window.location.origin

// Presidio entity types with display info
const PRESIDIO_ENTITIES = {
  PERSON: { name: 'Person Names', icon: '👤', enabled: true },
  EMAIL_ADDRESS: { name: 'Email Addresses', icon: '📧', enabled: true },
  PHONE_NUMBER: { name: 'Phone Numbers', icon: '📞', enabled: true },
  CREDIT_CARD: { name: 'Credit Cards', icon: '💳', enabled: true },
  US_SSN: { name: 'SSN (US)', icon: '🔢', enabled: true },
  US_DRIVER_LICENSE: { name: 'Driver License (US)', icon: '🪪', enabled: true },
  US_PASSPORT: { name: 'Passport (US)', icon: '🛂', enabled: true },
  US_BANK_NUMBER: { name: 'Bank Account (US)', icon: '🏦', enabled: true },
  IBAN_CODE: { name: 'IBAN Code', icon: '🏛️', enabled: true },
  IP_ADDRESS: { name: 'IP Addresses', icon: '🌐', enabled: true },
  URL: { name: 'URLs', icon: '🔗', enabled: true },
  DATE_TIME: { name: 'Dates & Times', icon: '📅', enabled: true },
  LOCATION: { name: 'Locations', icon: '📍', enabled: true },
  CRYPTO: { name: 'Crypto Wallets', icon: '₿', enabled: true },
  MEDICAL_LICENSE: { name: 'Medical License', icon: '⚕️', enabled: true },
  NRP: { name: 'Nationality/Religion', icon: '🌍', enabled: false },
  US_ITIN: { name: 'ITIN (US)', icon: '📋', enabled: true },
  UK_NHS: { name: 'NHS Number (UK)', icon: '🏥', enabled: true },
}

// State
let entityConfig = { ...PRESIDIO_ENTITIES }
let redactionStrategy = 'token'
let language = 'en'
let confidenceThreshold = 0.5
let currentTab = 'text'
let uploadedImage = null
let uploadedPdf = null
let customRecognizers = []

// DOM Elements
const elements = {}

// Initialize
document.addEventListener('DOMContentLoaded', init)

function init() {
  // Cache DOM elements
  cacheElements()

  // Load saved config
  loadConfig()

  // Render entity cards
  renderEntityCards()

  // Bind events
  bindEvents()

  // Setup custom dropdowns
  setupCustomDropdowns()

  // Setup file uploads
  setupFileUploads()

  // Check Presidio health
  checkPresidioHealth()

  // Setup custom recognizers
  setupCustomRecognizers()

  // Load existing custom recognizers from backend
  loadCustomRecognizers()

  // Set version
  const versionBadge = document.getElementById('version-badge')
  if (versionBadge) versionBadge.textContent = 'v1.1.0'
}

function cacheElements() {
  elements.inputText = document.getElementById('input-text')
  elements.redactedText = document.getElementById('redacted-text')
  elements.mappingContainer = document.getElementById('mapping-container')
  elements.mappingContent = document.getElementById('mapping-content')
  elements.entityCards = document.getElementById('entity-cards')
  elements.btnRedact = document.getElementById('btn-redact')
  elements.btnCopy = document.getElementById('btn-copy')
  elements.btnClear = document.getElementById('btn-clear')
  elements.btnEnableAll = document.getElementById('btn-enable-all')
  elements.btnDisableAll = document.getElementById('btn-disable-all')
  elements.statsDisplay = document.getElementById('stats-display')
  elements.confidenceSlider = document.getElementById('confidence-slider')
  elements.confidenceValue = document.getElementById('confidence-value')

  // Image elements
  elements.imageInput = document.getElementById('image-input')
  elements.imageUploadZone = document.getElementById('image-upload-zone')
  elements.imagePreviewContainer = document.getElementById('image-preview-container')
  elements.originalImagePreview = document.getElementById('original-image-preview')
  elements.redactedImagePreview = document.getElementById('redacted-image-preview')
  elements.btnRedactImage = document.getElementById('btn-redact-image')
  elements.btnDownloadImage = document.getElementById('btn-download-image')
  elements.btnClearImage = document.getElementById('btn-clear-image')

  // PDF elements
  elements.pdfInput = document.getElementById('pdf-input')
  elements.pdfUploadZone = document.getElementById('pdf-upload-zone')
  elements.pdfPreviewContainer = document.getElementById('pdf-preview-container')
  elements.pdfFilename = document.getElementById('pdf-filename')
  elements.pdfPages = document.getElementById('pdf-pages')
  elements.pdfProgress = document.getElementById('pdf-progress')
  elements.pdfProgressFill = document.getElementById('pdf-progress-fill')
  elements.pdfProgressText = document.getElementById('pdf-progress-text')
  elements.btnRedactPdf = document.getElementById('btn-redact-pdf')
  elements.btnDownloadPdf = document.getElementById('btn-download-pdf')
  elements.btnClearPdf = document.getElementById('btn-clear-pdf')
}

function loadConfig() {
  try {
    const saved = localStorage.getItem('presidio_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      entityConfig = { ...PRESIDIO_ENTITIES, ...parsed.entities }
      redactionStrategy = parsed.strategy || 'token'
      language = parsed.language || 'en'
      confidenceThreshold = parsed.confidence || 0.5
    }
  } catch (e) {
    console.warn('Failed to load config:', e)
  }

  // Update UI with loaded values
  if (elements.confidenceSlider) {
    elements.confidenceSlider.value = confidenceThreshold * 100
    elements.confidenceValue.textContent = `${Math.round(confidenceThreshold * 100)}%`
  }
}

function saveConfig() {
  try {
    localStorage.setItem('presidio_config', JSON.stringify({
      entities: entityConfig,
      strategy: redactionStrategy,
      language: language,
      confidence: confidenceThreshold
    }))
  } catch (e) {
    console.warn('Failed to save config:', e)
  }
}

function renderEntityCards() {
  if (!elements.entityCards) return

  elements.entityCards.innerHTML = Object.entries(entityConfig)
    .map(([key, entity]) => `
      <div class="entity-card ${entity.enabled ? 'enabled' : 'disabled'}" data-entity="${key}">
        <div class="entity-icon">${entity.icon}</div>
        <div class="entity-info">
          <div class="entity-name">${entity.name}</div>
          <div class="entity-key">${key}</div>
        </div>
        <label class="toggle">
          <input type="checkbox" ${entity.enabled ? 'checked' : ''} data-entity="${key}">
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('')

  // Bind toggle events
  elements.entityCards.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const entityKey = e.target.dataset.entity
      entityConfig[entityKey].enabled = e.target.checked
      e.target.closest('.entity-card').classList.toggle('enabled', e.target.checked)
      e.target.closest('.entity-card').classList.toggle('disabled', !e.target.checked)
      saveConfig()
    })
  })
}

function bindEvents() {
  // Text redaction buttons
  elements.btnRedact?.addEventListener('click', handleRedact)
  elements.btnCopy?.addEventListener('click', handleCopy)
  elements.btnClear?.addEventListener('click', handleClear)
  elements.btnEnableAll?.addEventListener('click', () => setAllEntities(true))
  elements.btnDisableAll?.addEventListener('click', () => setAllEntities(false))

  // Confidence slider
  elements.confidenceSlider?.addEventListener('input', (e) => {
    confidenceThreshold = e.target.value / 100
    elements.confidenceValue.textContent = `${e.target.value}%`
    saveConfig()
  })

  // Keyboard shortcut: Ctrl+Enter to redact
  elements.inputText?.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleRedact()
    }
  })

  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab))
  })

  // Image buttons
  elements.btnRedactImage?.addEventListener('click', handleRedactImage)
  elements.btnDownloadImage?.addEventListener('click', handleDownloadImage)
  elements.btnClearImage?.addEventListener('click', handleClearImage)

  // PDF buttons
  elements.btnRedactPdf?.addEventListener('click', handleRedactPdf)
  elements.btnDownloadPdf?.addEventListener('click', handleDownloadPdf)
  elements.btnClearPdf?.addEventListener('click', handleClearPdf)

  // Insert test data
  document.getElementById('btn-insert-test')?.addEventListener('click', insertTestData)

  // Copy mapping
  document.getElementById('btn-copy-mapping')?.addEventListener('click', handleCopyMapping)
}

function setupCustomDropdowns() {
  // Strategy dropdown
  setupDropdown('strategy', (value, text, icon) => {
    redactionStrategy = value
    saveConfig()
  })

  // Language dropdown
  setupDropdown('language', (value, text, icon) => {
    language = value
    saveConfig()
  })
}

function setupDropdown(name, onChange) {
  const wrapper = document.getElementById(`${name}-wrapper`)
  const button = document.getElementById(`${name}-button`)
  const dropdown = document.getElementById(`${name}-dropdown`)

  if (!wrapper || !button || !dropdown) return

  // Toggle dropdown
  button.addEventListener('click', (e) => {
    e.stopPropagation()
    closeAllDropdowns()
    wrapper.classList.toggle('open')
  })

  // Handle option selection
  dropdown.querySelectorAll('.select-option').forEach(option => {
    option.addEventListener('click', () => {
      const value = option.dataset.value
      const title = option.querySelector('.option-title')?.textContent || ''
      const icon = option.querySelector('.option-icon')?.textContent || ''

      // Update button text
      button.querySelector('.select-text').textContent = title
      button.querySelector('.select-icon').textContent = icon

      // Update selected state
      dropdown.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'))
      option.classList.add('selected')

      // Close dropdown
      wrapper.classList.remove('open')

      // Trigger callback
      onChange(value, title, icon)
    })
  })
}

function closeAllDropdowns() {
  document.querySelectorAll('.custom-select').forEach(el => el.classList.remove('open'))
}

// Close dropdowns when clicking outside
document.addEventListener('click', closeAllDropdowns)

function setupFileUploads() {
  // Image upload
  setupUploadZone(elements.imageUploadZone, elements.imageInput, handleImageUpload)

  // PDF upload
  setupUploadZone(elements.pdfUploadZone, elements.pdfInput, handlePdfUpload)
}

function setupUploadZone(zone, input, handler) {
  if (!zone || !input) return

  zone.addEventListener('click', () => input.click())

  zone.addEventListener('dragover', (e) => {
    e.preventDefault()
    zone.classList.add('drag-over')
  })

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over')
  })

  zone.addEventListener('drop', (e) => {
    e.preventDefault()
    zone.classList.remove('drag-over')
    const file = e.dataTransfer.files[0]
    if (file) handler(file)
  })

  input.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) handler(file)
  })
}

function switchTab(tabName) {
  currentTab = tabName

  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabName)
  })

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === `tab-content-${tabName}`)
  })
}

function setAllEntities(enabled) {
  Object.keys(entityConfig).forEach(key => {
    entityConfig[key].enabled = enabled
  })
  saveConfig()
  renderEntityCards()
}

async function checkPresidioHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    const data = await response.json()
    if (data.status === 'ok') {
      console.log('Presidio backend connected')
    }
  } catch (e) {
    console.error('Failed to connect to Presidio backend:', e)
    showError('Cannot connect to Presidio backend. Make sure it is running.')
  }
}

// Get enabled entities
function getEnabledEntities() {
  return Object.entries(entityConfig)
    .filter(([_, entity]) => entity.enabled)
    .map(([key, _]) => key)
}

// TEXT REDACTION
async function handleRedact() {
  const text = elements.inputText?.value?.trim()
  if (!text) {
    showError('Please enter text to redact')
    return
  }

  const enabledEntities = getEnabledEntities()
  if (enabledEntities.length === 0) {
    showError('Please enable at least one entity type')
    return
  }

  // Show loading state
  elements.btnRedact.disabled = true
  elements.btnRedact.innerHTML = '<span class="btn-icon">⏳</span> Redacting...'

  try {
    const response = await fetch(`${API_BASE_URL}/api/redact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        config: {
          entities: enabledEntities,
          strategy: redactionStrategy,
          language: language,
          scoreThreshold: confidenceThreshold
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Redaction failed')
    }

    const result = await response.json()

    // Display results
    elements.redactedText.value = result.redactedText

    // Show mapping
    if (result.mapping && Object.keys(result.mapping).length > 0) {
      elements.mappingContainer?.classList.remove('hidden')
      elements.mappingContent.innerHTML = Object.entries(result.mapping)
        .map(([token, original]) => `
          <div class="mapping-row">
            <span class="mapping-token">${escapeHtml(token)}</span>
            <span class="mapping-arrow">→</span>
            <span class="mapping-original">${escapeHtml(original)}</span>
          </div>
        `).join('')
    } else {
      elements.mappingContainer?.classList.add('hidden')
    }

    // Show stats
    if (result.stats && elements.statsDisplay) {
      elements.statsDisplay.innerHTML = `
        <div class="stat">
          <span class="stat-label">Matches:</span>
          <span class="stat-value">${result.stats.matchCount}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Types:</span>
          <span class="stat-value">${result.stats.types?.join(', ') || 'None'}</span>
        </div>
      `
      elements.statsDisplay.classList.remove('hidden')
    }

  } catch (e) {
    console.error('Redaction error:', e)
    showError(e.message)
  } finally {
    elements.btnRedact.disabled = false
    elements.btnRedact.innerHTML = '<span class="btn-icon">🛡️</span> Redact Data'
  }
}

function handleCopy() {
  const text = elements.redactedText?.value
  if (!text) {
    showError('Nothing to copy')
    return
  }

  navigator.clipboard.writeText(text).then(() => {
    const btn = elements.btnCopy
    const originalHTML = btn.innerHTML
    btn.innerHTML = '<span class="btn-icon">✓</span> Copied!'
    setTimeout(() => btn.innerHTML = originalHTML, 2000)
  }).catch(e => {
    console.error('Copy failed:', e)
    showError('Failed to copy to clipboard')
  })
}

function handleClear() {
  elements.inputText.value = ''
  elements.redactedText.value = ''
  elements.mappingContainer?.classList.add('hidden')
  elements.statsDisplay?.classList.add('hidden')
}

function handleCopyMapping() {
  const mappingText = elements.mappingContent?.innerText
  if (mappingText) {
    navigator.clipboard.writeText(mappingText).then(() => {
      const btn = document.getElementById('btn-copy-mapping')
      const originalText = btn.textContent
      btn.textContent = 'Copied!'
      setTimeout(() => btn.textContent = originalText, 2000)
    })
  }
}

// IMAGE REDACTION
function handleImageUpload(file) {
  if (!file.type.startsWith('image/')) {
    showError('Please upload an image file')
    return
  }

  uploadedImage = file

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    elements.originalImagePreview.innerHTML = `<img src="${e.target.result}" alt="Original">`
    elements.redactedImagePreview.innerHTML = '<p style="color: var(--text-muted)">Click "Redact Image" to process</p>'
    elements.imageUploadZone.classList.add('hidden')
    elements.imagePreviewContainer.classList.remove('hidden')
    elements.btnDownloadImage.disabled = true
  }
  reader.readAsDataURL(file)
}

async function handleRedactImage() {
  if (!uploadedImage) {
    showError('Please upload an image first')
    return
  }

  const enabledEntities = getEnabledEntities()
  if (enabledEntities.length === 0) {
    showError('Please enable at least one entity type')
    return
  }

  elements.btnRedactImage.disabled = true
  elements.btnRedactImage.innerHTML = '<span class="btn-icon">⏳</span> Processing...'

  try {
    const formData = new FormData()
    formData.append('image', uploadedImage)
    formData.append('entities', JSON.stringify(enabledEntities))
    formData.append('strategy', redactionStrategy)
    formData.append('language', language)
    formData.append('scoreThreshold', confidenceThreshold.toString())

    const response = await fetch(`${API_BASE_URL}/api/redact/image`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Image redaction failed')
    }

    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)

    elements.redactedImagePreview.innerHTML = `<img src="${imageUrl}" alt="Redacted">`
    elements.btnDownloadImage.disabled = false
    elements.btnDownloadImage.onclick = () => {
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = `redacted_${uploadedImage.name}`
      a.click()
    }

  } catch (e) {
    console.error('Image redaction error:', e)
    showError(e.message)
  } finally {
    elements.btnRedactImage.disabled = false
    elements.btnRedactImage.innerHTML = '<span class="btn-icon">🛡️</span> Redact Image'
  }
}

function handleDownloadImage() {
  // Handled in handleRedactImage
}

function handleClearImage() {
  uploadedImage = null
  elements.originalImagePreview.innerHTML = ''
  elements.redactedImagePreview.innerHTML = ''
  elements.imagePreviewContainer.classList.add('hidden')
  elements.imageUploadZone.classList.remove('hidden')
  elements.imageInput.value = ''
  elements.btnDownloadImage.disabled = true
}

// PDF REDACTION
function handlePdfUpload(file) {
  if (file.type !== 'application/pdf') {
    showError('Please upload a PDF file')
    return
  }

  uploadedPdf = file

  // Show preview
  elements.pdfFilename.textContent = file.name
  elements.pdfPages.textContent = 'Analyzing...'
  elements.pdfUploadZone.classList.add('hidden')
  elements.pdfPreviewContainer.classList.remove('hidden')
  elements.pdfProgress.classList.add('hidden')
  elements.btnDownloadPdf.disabled = true

  // Try to get page count (basic check)
  elements.pdfPages.textContent = `${(file.size / 1024).toFixed(1)} KB`
}

async function handleRedactPdf() {
  if (!uploadedPdf) {
    showError('Please upload a PDF first')
    return
  }

  const enabledEntities = getEnabledEntities()
  if (enabledEntities.length === 0) {
    showError('Please enable at least one entity type')
    return
  }

  elements.btnRedactPdf.disabled = true
  elements.btnRedactPdf.innerHTML = '<span class="btn-icon">⏳</span> Processing...'
  elements.pdfProgress.classList.remove('hidden')
  elements.pdfProgressFill.style.width = '0%'
  elements.pdfProgressText.textContent = 'Uploading PDF...'

  try {
    const formData = new FormData()
    formData.append('pdf', uploadedPdf)
    formData.append('entities', JSON.stringify(enabledEntities))
    formData.append('strategy', redactionStrategy)
    formData.append('language', language)
    formData.append('scoreThreshold', confidenceThreshold.toString())

    // Simulate progress
    let progress = 0
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 5, 90)
      elements.pdfProgressFill.style.width = `${progress}%`
      elements.pdfProgressText.textContent = `Processing... ${progress}%`
    }, 500)

    const response = await fetch(`${API_BASE_URL}/api/redact/pdf`, {
      method: 'POST',
      body: formData
    })

    clearInterval(progressInterval)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'PDF redaction failed')
    }

    elements.pdfProgressFill.style.width = '100%'
    elements.pdfProgressText.textContent = 'Complete!'

    const blob = await response.blob()
    const pdfUrl = URL.createObjectURL(blob)

    elements.btnDownloadPdf.disabled = false
    elements.btnDownloadPdf.onclick = () => {
      const a = document.createElement('a')
      a.href = pdfUrl
      a.download = `redacted_${uploadedPdf.name}`
      a.click()
    }

  } catch (e) {
    console.error('PDF redaction error:', e)
    showError(e.message)
    elements.pdfProgress.classList.add('hidden')
  } finally {
    elements.btnRedactPdf.disabled = false
    elements.btnRedactPdf.innerHTML = '<span class="btn-icon">🛡️</span> Redact PDF'
  }
}

function handleDownloadPdf() {
  // Handled in handleRedactPdf
}

function handleClearPdf() {
  uploadedPdf = null
  elements.pdfPreviewContainer.classList.add('hidden')
  elements.pdfUploadZone.classList.remove('hidden')
  elements.pdfInput.value = ''
  elements.pdfProgress.classList.add('hidden')
  elements.btnDownloadPdf.disabled = true
}

// UTILITIES
function insertTestData() {
  elements.inputText.value = `Dear Support Team,

My name is John Smith and I'm writing about my recent order.

Contact Information:
- Email: john.smith@company.com
- Phone: (555) 123-4567
- Address: 123 Main Street, Seattle, WA 98101

Payment Details:
- Credit Card: 4532-1234-5678-9010
- SSN (for verification): 123-45-6789

I placed the order on January 15, 2024 and the tracking shows it was delivered to the wrong address at 192.168.1.100 (our office network).

Please contact me at your earliest convenience.

Best regards,
John Smith
CEO, Acme Corporation`
}

function showError(message) {
  // Create toast notification
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 4000)
}

// Add animation styles
const style = document.createElement('style')
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`
document.head.appendChild(style)

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// CUSTOM RECOGNIZERS
function setupCustomRecognizers() {
  // Deny-list add button
  document.getElementById('btn-add-deny-list')?.addEventListener('click', handleAddDenyList)

  // Pattern add button
  document.getElementById('btn-add-pattern')?.addEventListener('click', handleAddPattern)
}

async function loadCustomRecognizers() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recognizers`)
    if (response.ok) {
      const data = await response.json()
      customRecognizers = data.custom || []
      renderCustomRecognizers()
    }
  } catch (e) {
    console.warn('Could not load custom recognizers:', e)
  }
}

async function handleAddDenyList() {
  const nameInput = document.getElementById('deny-list-name')
  const entityInput = document.getElementById('deny-list-entity')
  const wordsInput = document.getElementById('deny-list-words')

  const name = nameInput?.value?.trim()
  const entityType = entityInput?.value?.trim().toUpperCase()
  const wordsText = wordsInput?.value?.trim()

  if (!name || !entityType || !wordsText) {
    showError('Please fill in all fields for deny-list recognizer')
    return
  }

  const denyList = wordsText.split(',').map(w => w.trim()).filter(w => w.length > 0)
  if (denyList.length === 0) {
    showError('Please enter at least one word to block')
    return
  }

  const btn = document.getElementById('btn-add-deny-list')
  btn.disabled = true
  btn.innerHTML = '<span class="btn-icon">⏳</span> Adding...'

  try {
    const response = await fetch(`${API_BASE_URL}/api/recognizers/deny-list`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        supported_entity: entityType,
        deny_list: denyList
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add recognizer')
    }

    // Clear inputs
    nameInput.value = ''
    entityInput.value = ''
    wordsInput.value = ''

    // Reload recognizers
    await loadCustomRecognizers()

    // Also add to entity config dynamically
    if (!entityConfig[entityType]) {
      entityConfig[entityType] = {
        name: entityType.replace(/_/g, ' '),
        icon: '🏷️',
        enabled: true
      }
      renderEntityCards()
    }

    showSuccess(`Added deny-list recognizer: ${name}`)

  } catch (e) {
    console.error('Failed to add deny-list:', e)
    showError(e.message)
  } finally {
    btn.disabled = false
    btn.innerHTML = '<span class="btn-icon">➕</span> Add Deny-List'
  }
}

async function handleAddPattern() {
  const nameInput = document.getElementById('pattern-name')
  const entityInput = document.getElementById('pattern-entity')
  const regexInput = document.getElementById('pattern-regex')

  const name = nameInput?.value?.trim()
  const entityType = entityInput?.value?.trim().toUpperCase()
  const regexText = regexInput?.value?.trim()

  if (!name || !entityType || !regexText) {
    showError('Please fill in all fields for pattern recognizer')
    return
  }

  const patterns = regexText.split('\n').map(p => p.trim()).filter(p => p.length > 0)
  if (patterns.length === 0) {
    showError('Please enter at least one regex pattern')
    return
  }

  const btn = document.getElementById('btn-add-pattern')
  btn.disabled = true
  btn.innerHTML = '<span class="btn-icon">⏳</span> Adding...'

  try {
    const response = await fetch(`${API_BASE_URL}/api/recognizers/pattern`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        supported_entity: entityType,
        patterns: patterns.map(p => ({ regex: p, score: 0.8 }))
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to add recognizer')
    }

    // Clear inputs
    nameInput.value = ''
    entityInput.value = ''
    regexInput.value = ''

    // Reload recognizers
    await loadCustomRecognizers()

    // Also add to entity config dynamically
    if (!entityConfig[entityType]) {
      entityConfig[entityType] = {
        name: entityType.replace(/_/g, ' '),
        icon: '🔤',
        enabled: true
      }
      renderEntityCards()
    }

    showSuccess(`Added pattern recognizer: ${name}`)

  } catch (e) {
    console.error('Failed to add pattern:', e)
    showError(e.message)
  } finally {
    btn.disabled = false
    btn.innerHTML = '<span class="btn-icon">➕</span> Add Pattern'
  }
}

async function handleRemoveRecognizer(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/recognizers/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove recognizer')
    }

    // Reload recognizers
    await loadCustomRecognizers()
    showSuccess(`Removed recognizer: ${name}`)

  } catch (e) {
    console.error('Failed to remove recognizer:', e)
    showError(e.message)
  }
}

function renderCustomRecognizers() {
  const container = document.getElementById('custom-recognizers-list')
  const countEl = document.getElementById('recognizer-count')

  if (!container) return

  if (customRecognizers.length === 0) {
    container.innerHTML = '<p class="no-recognizers">No custom recognizers added yet</p>'
    if (countEl) countEl.textContent = '0 active'
    return
  }

  if (countEl) countEl.textContent = `${customRecognizers.length} active`

  container.innerHTML = customRecognizers.map(rec => {
    const icon = rec.type === 'deny_list' ? '📋' : '🔤'
    const typeLabel = rec.type === 'deny_list' ? 'Deny List' : 'Pattern'
    const details = rec.type === 'deny_list'
      ? `${rec.deny_list?.length || 0} words`
      : `${rec.patterns?.length || 0} patterns`

    return `
      <div class="recognizer-item" data-name="${escapeHtml(rec.name)}">
        <span class="recognizer-type">${icon}</span>
        <div class="recognizer-info">
          <div class="recognizer-name">${escapeHtml(rec.name)}</div>
          <div class="recognizer-meta">
            <span class="recognizer-entity">${escapeHtml(rec.supported_entity)}</span>
            <span class="recognizer-details">${typeLabel} • ${details}</span>
          </div>
        </div>
        <button class="btn-remove" onclick="handleRemoveRecognizer('${escapeHtml(rec.name)}')">Remove</button>
      </div>
    `
  }).join('')
}

function showSuccess(message) {
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #22c55e;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// Make handleRemoveRecognizer globally accessible for onclick
window.handleRemoveRecognizer = handleRemoveRecognizer
