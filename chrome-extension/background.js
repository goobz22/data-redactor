// Data Redactor - Background Service Worker
// Handles icon generation, message passing, and CRM bridge coordination

// ============================================
// ICON GENERATION
// ============================================

function generateIcon(size) {
  const canvas = new OffscreenCanvas(size, size)
  const ctx = canvas.getContext('2d')

  const s = size / 128 // Scale factor

  // Background - rounded square with Broadcom red gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size)
  gradient.addColorStop(0, '#CC092F')    // Broadcom red
  gradient.addColorStop(1, '#8B0000')    // Darker red

  ctx.beginPath()
  const radius = 20 * s
  ctx.roundRect(4 * s, 4 * s, size - 8 * s, size - 8 * s, radius)
  ctx.fillStyle = gradient
  ctx.fill()

  // Shield shape
  ctx.beginPath()
  const shieldX = size / 2
  const shieldTop = 24 * s
  const shieldWidth = 44 * s
  const shieldHeight = 56 * s

  ctx.moveTo(shieldX, shieldTop)
  ctx.lineTo(shieldX + shieldWidth, shieldTop + 12 * s)
  ctx.lineTo(shieldX + shieldWidth, shieldTop + shieldHeight * 0.6)
  ctx.quadraticCurveTo(shieldX + shieldWidth, shieldTop + shieldHeight, shieldX, shieldTop + shieldHeight + 16 * s)
  ctx.quadraticCurveTo(shieldX - shieldWidth, shieldTop + shieldHeight, shieldX - shieldWidth, shieldTop + shieldHeight * 0.6)
  ctx.lineTo(shieldX - shieldWidth, shieldTop + 12 * s)
  ctx.closePath()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.fill()

  // Inner shield gradient
  ctx.beginPath()
  const innerShieldWidth = 34 * s
  const innerShieldHeight = 46 * s
  const innerTop = 32 * s

  ctx.moveTo(shieldX, innerTop)
  ctx.lineTo(shieldX + innerShieldWidth, innerTop + 10 * s)
  ctx.lineTo(shieldX + innerShieldWidth, innerTop + innerShieldHeight * 0.6)
  ctx.quadraticCurveTo(shieldX + innerShieldWidth, innerTop + innerShieldHeight, shieldX, innerTop + innerShieldHeight + 12 * s)
  ctx.quadraticCurveTo(shieldX - innerShieldWidth, innerTop + innerShieldHeight, shieldX - innerShieldWidth, innerTop + innerShieldHeight * 0.6)
  ctx.lineTo(shieldX - innerShieldWidth, innerTop + 10 * s)
  ctx.closePath()

  const innerGradient = ctx.createLinearGradient(shieldX - innerShieldWidth, innerTop, shieldX + innerShieldWidth, innerTop + innerShieldHeight)
  innerGradient.addColorStop(0, '#CC092F')
  innerGradient.addColorStop(1, '#FF4D6D')
  ctx.fillStyle = innerGradient
  ctx.fill()

  // Gemini "G" letter
  ctx.fillStyle = 'white'
  ctx.font = `bold ${36 * s}px Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('G', shieldX, shieldTop + shieldHeight * 0.55)

  // Twin dots for Gemini (twins)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.arc(shieldX - 12 * s, shieldTop + 20 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(shieldX + 12 * s, shieldTop + 20 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()

  return ctx.getImageData(0, 0, size, size)
}

async function setIcon() {
  try {
    const imageData = {
      16: generateIcon(16),
      32: generateIcon(32),
      48: generateIcon(48),
      128: generateIcon(128)
    }
    await chrome.action.setIcon({ imageData })
  } catch (e) {
    console.log('[Data Redactor] Icon generation error:', e)
  }
}

// ============================================
// CRM BRIDGE - Cross-tab communication
// ============================================

const BRIDGE_STORAGE_KEY = 'bridge_customer_current'
const BRIDGE_HISTORY_KEY = 'bridge_customer_history'
const MAX_HISTORY = 20

// Bridge API for CRM extractors
const CustomerBridge = {
  async save(customerData) {
    const capture = {
      id: this._generateId(),
      capturedAt: new Date().toISOString(),
      source: customerData.source || 'unknown',
      caseNumber: customerData.caseNumber || null,
      customer: {
        name: customerData.name || customerData.customer?.name || '',
        email: customerData.email || customerData.customer?.email || '',
        phone: customerData.phone || customerData.customer?.phone || '',
        company: customerData.company || customerData.customer?.company || '',
        accountId: customerData.accountId || customerData.customer?.accountId || '',
      },
      context: customerData.context || {},
      custom: customerData.custom || {},
    }

    await chrome.storage.local.set({ [BRIDGE_STORAGE_KEY]: capture })
    await this._addToHistory(capture)

    // Notify all tabs that customer data is available
    this._broadcastUpdate(capture)

    console.log('[CustomerBridge] Saved customer:', capture.id)
    return capture.id
  },

  async get() {
    const result = await chrome.storage.local.get(BRIDGE_STORAGE_KEY)
    return result[BRIDGE_STORAGE_KEY] || null
  },

  async getHistory() {
    const result = await chrome.storage.local.get(BRIDGE_HISTORY_KEY)
    return result[BRIDGE_HISTORY_KEY] || []
  },

  async clear() {
    await chrome.storage.local.remove(BRIDGE_STORAGE_KEY)
    this._broadcastUpdate(null)
  },

  async hasData() {
    const data = await this.get()
    return data !== null && (data.customer?.name || data.customer?.email)
  },

  _generateId() {
    return 'cap_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  },

  async _addToHistory(capture) {
    let history = await this.getHistory()
    history = history.filter(h => h.id !== capture.id)
    history.unshift(capture)
    history = history.slice(0, MAX_HISTORY)
    await chrome.storage.local.set({ [BRIDGE_HISTORY_KEY]: history })
  },

  _broadcastUpdate(customerData) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'customerDataUpdated',
          data: customerData
        }).catch(() => {}) // Ignore errors for non-content-script tabs
      })
    })
  }
}

// ============================================
// MESSAGE HANDLERS
// ============================================

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle async operations
  if (message.action === 'saveCustomerData') {
    CustomerBridge.save(message.data).then(id => {
      sendResponse({ success: true, id })
    }).catch(err => {
      sendResponse({ success: false, error: err.message })
    })
    return true // Keep channel open for async
  }

  if (message.action === 'getCustomerData') {
    CustomerBridge.get().then(data => {
      sendResponse({ success: true, data })
    }).catch(err => {
      sendResponse({ success: false, error: err.message })
    })
    return true
  }

  if (message.action === 'getCustomerHistory') {
    CustomerBridge.getHistory().then(history => {
      sendResponse({ success: true, history })
    }).catch(err => {
      sendResponse({ success: false, error: err.message })
    })
    return true
  }

  if (message.action === 'clearCustomerData') {
    CustomerBridge.clear().then(() => {
      sendResponse({ success: true })
    }).catch(err => {
      sendResponse({ success: false, error: err.message })
    })
    return true
  }

  if (message.action === 'loadHistoryItem') {
    CustomerBridge.getHistory().then(async history => {
      const item = history.find(h => h.id === message.id)
      if (item) {
        await chrome.storage.local.set({ [BRIDGE_STORAGE_KEY]: item })
        CustomerBridge._broadcastUpdate(item)
        sendResponse({ success: true, data: item })
      } else {
        sendResponse({ success: false, error: 'Item not found' })
      }
    }).catch(err => {
      sendResponse({ success: false, error: err.message })
    })
    return true
  }

  // Handle keyboard command
  if (message.action === 'executeCommand') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: message.command })
      }
    })
    sendResponse({ success: true })
    return false
  }
})

// ============================================
// KEYBOARD COMMANDS
// ============================================

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      if (command === 'redact-input') {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'redactNow' })
      } else if (command === 'toggle-panel') {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'togglePanel' })
      }
    }
  })
})

// ============================================
// LIFECYCLE EVENTS
// ============================================

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Data Redactor] Extension installed/updated:', details.reason)
  setIcon()

  // Initialize default config if not exists
  chrome.storage.sync.get('redactorConfig', (result) => {
    if (!result.redactorConfig) {
      const defaultConfig = {
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
      chrome.storage.sync.set({ redactorConfig: defaultConfig })
    }
  })
})

chrome.runtime.onStartup.addListener(() => {
  setIcon()
})

// Initialize icon immediately
setIcon()

console.log('[Data Redactor] Background service worker loaded')
