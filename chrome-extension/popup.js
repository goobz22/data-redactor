// Data Redactor - Popup Script
// Handles popup UI interactions and configuration

const DEFAULT_CONFIG = {
  enabled: true,
  showIndicator: true,
  autoRedact: false,
  showPanel: true,
  patterns: {
    email: { enabled: true, strategy: 'token' },
    phone: { enabled: true, strategy: 'token' },
    ssn: { enabled: true, strategy: 'token' },
    creditCard: { enabled: true, strategy: 'token' },
    ipv4: { enabled: true, strategy: 'formatPreserving' },
    ipv6: { enabled: true, strategy: 'token' },
    macAddress: { enabled: true, strategy: 'token' },
    awsKey: { enabled: true, strategy: 'token' },
    apiKey: { enabled: true, strategy: 'token' },
  },
  customEntities: {
    companyNames: [],
    customerNames: [],
  },
  selectedTemplate: 'troubleshoot',
}

let config = { ...DEFAULT_CONFIG }

// DOM Elements
const enabledToggle = document.getElementById('enabled')
const autoRedactToggle = document.getElementById('autoRedact')
const redactBtn = document.getElementById('redactBtn')
const copyBtn = document.getElementById('copyBtn')
const statusEl = document.getElementById('status')
const mappingEl = document.getElementById('mapping')
const customerCard = document.getElementById('customer-card')
const customerTitle = document.getElementById('customer-title')
const customerBadge = document.getElementById('customer-badge')
const customerInfo = document.getElementById('customer-info')
const historyList = document.getElementById('history-list')

// ============================================
// INITIALIZATION
// ============================================

// Load config
chrome.storage.sync.get('redactorConfig', (result) => {
  config = { ...DEFAULT_CONFIG, ...result.redactorConfig }
  updateUI()
})

// Load last mapping
chrome.storage.local.get('lastMapping', (result) => {
  if (result.lastMapping && Object.keys(result.lastMapping).length > 0) {
    renderMapping(result.lastMapping)
  }
})

// Load customer data
loadCustomerData()
loadHistory()

// ============================================
// UI UPDATES
// ============================================

function updateUI() {
  enabledToggle.checked = config.enabled
  autoRedactToggle.checked = config.autoRedact

  document.querySelectorAll('[data-pattern]').forEach((el) => {
    const pattern = el.dataset.pattern
    el.checked = config.patterns[pattern]?.enabled ?? true
  })
}

function saveConfig() {
  chrome.storage.sync.set({ redactorConfig: config })
}

function showStatus(msg, type = 'info') {
  statusEl.textContent = msg
  statusEl.className = `status visible ${type}`
  setTimeout(() => statusEl.classList.remove('visible'), 3000)
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function renderMapping(mapping) {
  if (!mapping || Object.keys(mapping).length === 0) {
    mappingEl.innerHTML = 'No redactions yet'
    return
  }

  mappingEl.innerHTML = Object.entries(mapping)
    .map(([orig, redacted]) =>
      `<div class="mapping-item">
        <span class="mapping-orig" title="${escapeHtml(orig)}">${escapeHtml(orig.substring(0, 20))}${orig.length > 20 ? '...' : ''}</span>
        <span class="mapping-arrow">→</span>
        <span class="mapping-redacted">${escapeHtml(redacted)}</span>
      </div>`
    ).join('')
}

async function loadCustomerData() {
  try {
    const result = await chrome.storage.local.get('bridge_customer_current')
    const customerData = result.bridge_customer_current

    if (customerData && (customerData.customer?.name || customerData.customer?.email)) {
      customerCard.classList.remove('no-data')
      customerTitle.textContent = '👤 ' + (customerData.customer.name || 'Customer Loaded')
      customerBadge.style.display = 'inline-block'

      customerInfo.innerHTML = `
        ${customerData.customer.name ? `<div class="customer-info-row"><span class="customer-info-label">Name:</span><span class="customer-info-value">[CUSTOMER_1]</span></div>` : ''}
        ${customerData.customer.email ? `<div class="customer-info-row"><span class="customer-info-label">Email:</span><span class="customer-info-value">[EMAIL_1]</span></div>` : ''}
        ${customerData.customer.phone ? `<div class="customer-info-row"><span class="customer-info-label">Phone:</span><span class="customer-info-value">[PHONE_1]</span></div>` : ''}
        ${customerData.customer.company ? `<div class="customer-info-row"><span class="customer-info-label">Company:</span><span class="customer-info-value">[COMPANY_1]</span></div>` : ''}
        ${customerData.caseNumber ? `<div class="customer-info-row"><span class="customer-info-label">Case:</span><span class="customer-info-value">${escapeHtml(customerData.caseNumber)}</span></div>` : ''}
        <div class="customer-info-row"><span class="customer-info-label">Source:</span><span class="customer-info-value" style="color:#666">${escapeHtml(customerData.source || 'Unknown')}</span></div>
        <div class="customer-info-row"><span class="customer-info-label">Captured:</span><span class="customer-info-value" style="color:#666">${new Date(customerData.capturedAt).toLocaleString()}</span></div>
      `
    } else {
      customerCard.classList.add('no-data')
      customerTitle.textContent = '👤 No Customer Loaded'
      customerBadge.style.display = 'none'
      customerInfo.innerHTML = '<p class="no-data">Capture customer data from your CRM to see it here.</p>'
    }
  } catch (e) {
    console.error('Error loading customer data:', e)
  }
}

async function loadHistory() {
  try {
    const result = await chrome.storage.local.get('bridge_customer_history')
    const history = result.bridge_customer_history || []

    if (history.length === 0) {
      historyList.innerHTML = '<p class="no-data">No history yet</p>'
      return
    }

    historyList.innerHTML = history.map(h => `
      <div class="history-item" data-id="${h.id}">
        <div class="history-item-name">${escapeHtml(h.customer?.name || 'Unknown')}</div>
        <div class="history-item-meta">${escapeHtml(h.customer?.company || '')} • ${new Date(h.capturedAt).toLocaleDateString()}</div>
      </div>
    `).join('')

    // Attach click handlers
    historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', async () => {
        const history = (await chrome.storage.local.get('bridge_customer_history')).bridge_customer_history || []
        const selected = history.find(h => h.id === item.dataset.id)
        if (selected) {
          await chrome.storage.local.set({ bridge_customer_current: selected })
          loadCustomerData()
          showStatus('Customer loaded from history', 'success')
          // Switch to customer tab
          document.querySelector('[data-tab="customer"]').click()
        }
      })
    })
  } catch (e) {
    console.error('Error loading history:', e)
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'))
    tab.classList.add('active')
    document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active')
  })
})

// Toggle handlers
enabledToggle.addEventListener('change', () => {
  config.enabled = enabledToggle.checked
  saveConfig()
  showStatus(config.enabled ? 'Redactor enabled' : 'Redactor disabled', 'info')
})

autoRedactToggle.addEventListener('change', () => {
  config.autoRedact = autoRedactToggle.checked
  saveConfig()
})

// Pattern toggles
document.querySelectorAll('[data-pattern]').forEach((el) => {
  el.addEventListener('change', () => {
    const pattern = el.dataset.pattern
    if (!config.patterns[pattern]) {
      config.patterns[pattern] = { enabled: true, strategy: 'token' }
    }
    config.patterns[pattern].enabled = el.checked
    saveConfig()
  })
})

// Redact button
redactBtn.addEventListener('click', async () => {
  if (!config.enabled) {
    showStatus('Redactor is disabled', 'error')
    return
  }

  redactBtn.disabled = true
  redactBtn.innerHTML = '<span>⏳</span><span>Redacting...</span>'

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    chrome.tabs.sendMessage(tab.id, { action: 'redactNow' }, (response) => {
      redactBtn.disabled = false
      redactBtn.innerHTML = '<span>🛡️</span><span>Redact Now</span>'

      if (chrome.runtime.lastError) {
        showStatus('Not on a supported AI chat page', 'error')
        return
      }

      if (response?.success) {
        if (response.count > 0) {
          showStatus(`Redacted ${response.count} item(s)`, 'success')
          renderMapping(response.mapping)
          chrome.storage.local.set({ lastMapping: response.mapping })
        } else {
          showStatus('No sensitive data found', 'info')
        }
      } else {
        showStatus(response?.error || 'Redaction failed', 'error')
      }
    })
  } catch (err) {
    redactBtn.disabled = false
    redactBtn.innerHTML = '<span>🛡️</span><span>Redact Now</span>'
    showStatus('Error: ' + err.message, 'error')
  }
})

// Copy mapping button
copyBtn.addEventListener('click', async () => {
  const result = await chrome.storage.local.get('lastMapping')
  const mapping = result.lastMapping || {}

  if (Object.keys(mapping).length === 0) {
    showStatus('No mapping to copy', 'info')
    return
  }

  const text = Object.entries(mapping)
    .map(([orig, redacted]) => `${orig} -> ${redacted}`)
    .join('\n')

  await navigator.clipboard.writeText(text)
  showStatus('Mapping copied!', 'success')
})

// Customer refresh button
document.getElementById('refreshCustomer').addEventListener('click', () => {
  loadCustomerData()
  showStatus('Customer data refreshed', 'info')
})

// Clear customer button
document.getElementById('clearCustomer').addEventListener('click', async () => {
  await chrome.storage.local.remove('bridge_customer_current')
  loadCustomerData()
  showStatus('Customer data cleared', 'info')

  // Notify content script
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.tabs.sendMessage(tab.id, { action: 'customerDataUpdated', data: null })
  } catch (e) {
    // Ignore errors if no content script is available
  }
})

// Clear history button
document.getElementById('clearHistory').addEventListener('click', async () => {
  if (confirm('Clear all customer history?')) {
    await chrome.storage.local.set({ bridge_customer_history: [] })
    loadHistory()
    showStatus('History cleared', 'info')
  }
})

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local') {
    if (changes.lastMapping) {
      renderMapping(changes.lastMapping.newValue)
    }
    if (changes.bridge_customer_current) {
      loadCustomerData()
    }
    if (changes.bridge_customer_history) {
      loadHistory()
    }
  }
})

console.log('[Data Redactor] Popup loaded')
