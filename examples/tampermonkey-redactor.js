// ==UserScript==
// @name         Data Redactor - AI Input Sanitizer
// @namespace    https://github.com/goobz22/data-redactor
// @version      1.0.0
// @description  Automatically redact sensitive data before submitting to AI chat interfaces
// @author       Matthew Goluba
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://bard.google.com/*
// @match        https://gemini.google.com/*
// @match        https://copilot.microsoft.com/*
// @match        https://poe.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

;(function () {
  'use strict'

  // ============================================
  // Configuration
  // ============================================

  const DEFAULT_CONFIG = {
    enabled: true,
    showIndicator: true,
    autoRedact: false, // If true, redacts on paste automatically
    patterns: {
      email: { enabled: true, strategy: 'token' },
      phone: { enabled: true, strategy: 'token' },
      ssn: { enabled: true, strategy: 'token' },
      creditCard: { enabled: true, strategy: 'token' },
      ipv4: { enabled: true, strategy: 'formatPreserving' },
      ipv6: { enabled: true, strategy: 'token' },
      macAddress: { enabled: true, strategy: 'token' },
    },
    customEntities: {
      companyNames: [],
      customerNames: [],
    },
  }

  // Load config from storage or use defaults
  let config = GM_getValue('redactorConfig', DEFAULT_CONFIG)

  // ============================================
  // Pattern Definitions
  // ============================================

  const PATTERNS = {
    email: {
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      token: (idx) => `[EMAIL_${idx}]`,
    },
    phone: {
      regex:
        /(?:\+?1[-.\s]?)?(?:\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g,
      token: (idx) => `[PHONE_${idx}]`,
    },
    ssn: {
      regex: /\b\d{3}-\d{2}-\d{4}\b/g,
      token: (idx) => `[SSN_${idx}]`,
    },
    creditCard: {
      regex: /\b(?:\d{4}[-\s]?){3,4}\d{1,4}\b|\b\d{13,19}\b/g,
      token: (idx) => `[CARD_${idx}]`,
    },
    ipv4: {
      regex:
        /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?\b/g,
      token: (idx) => `[IPV4_${idx}]`,
      formatPreserving: (value) => {
        // Generate fake but valid-looking IP
        const parts = value.split('.')
        return parts
          .map((p, i) => {
            if (i === 0) return '10' // Private range
            return Math.floor(Math.random() * 256)
          })
          .join('.')
      },
    },
    ipv6: {
      regex: /(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}/g,
      token: (idx) => `[IPV6_${idx}]`,
    },
    macAddress: {
      regex:
        /(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/g,
      token: (idx) => `[MAC_${idx}]`,
    },
  }

  // ============================================
  // Redaction Engine
  // ============================================

  class RedactionEngine {
    constructor() {
      this.mapping = new Map()
      this.counters = {}
    }

    reset() {
      this.mapping.clear()
      this.counters = {}
    }

    getCounter(type) {
      if (!this.counters[type]) {
        this.counters[type] = 0
      }
      return ++this.counters[type]
    }

    redact(text) {
      this.reset()
      let result = text

      // Process each enabled pattern
      for (const [type, patternConfig] of Object.entries(PATTERNS)) {
        if (!config.patterns[type]?.enabled) continue

        const strategy = config.patterns[type]?.strategy || 'token'

        result = result.replace(patternConfig.regex, (match) => {
          // Check if already redacted
          if (this.mapping.has(match)) {
            return this.mapping.get(match)
          }

          const idx = this.getCounter(type)
          let replacement

          if (strategy === 'formatPreserving' && patternConfig.formatPreserving) {
            replacement = patternConfig.formatPreserving(match)
          } else {
            replacement = patternConfig.token(idx)
          }

          this.mapping.set(match, replacement)
          return replacement
        })
      }

      // Process custom entities (company names, customer names)
      for (const [entityType, entities] of Object.entries(config.customEntities || {})) {
        if (!Array.isArray(entities)) continue

        for (const entity of entities) {
          if (!entity) continue
          const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`\\b${escapedEntity}\\b`, 'gi')

          result = result.replace(regex, (match) => {
            if (this.mapping.has(match.toLowerCase())) {
              return this.mapping.get(match.toLowerCase())
            }

            const idx = this.getCounter(entityType)
            const replacement = `[${entityType.toUpperCase()}_${idx}]`
            this.mapping.set(match.toLowerCase(), replacement)
            return replacement
          })
        }
      }

      return {
        redactedText: result,
        mapping: Object.fromEntries(this.mapping),
        hasRedactions: this.mapping.size > 0,
      }
    }

    getMapping() {
      return Object.fromEntries(this.mapping)
    }
  }

  const engine = new RedactionEngine()

  // ============================================
  // UI Components
  // ============================================

  GM_addStyle(`
    .redactor-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      background: linear-gradient(135deg, #002868 0%, #bf0a30 100%);
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 2px solid #ffd700;
      transition: all 0.3s ease;
    }

    .redactor-indicator:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    }

    .redactor-indicator.disabled {
      background: #666;
      border-color: #888;
    }

    .redactor-indicator .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .redactor-indicator.enabled .status-dot {
      background: #22c55e;
    }

    .redactor-indicator.disabled .status-dot {
      background: #ef4444;
    }

    .redactor-panel {
      position: fixed;
      bottom: 70px;
      right: 20px;
      z-index: 10001;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      border: 3px solid #002868;
      width: 320px;
      max-height: 400px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: none;
    }

    .redactor-panel.visible {
      display: block;
    }

    .redactor-panel-header {
      background: linear-gradient(135deg, #002868 0%, #bf0a30 100%);
      color: white;
      padding: 12px 16px;
      font-weight: 700;
      font-size: 16px;
      border-bottom: 2px solid #ffd700;
    }

    .redactor-panel-content {
      padding: 16px;
    }

    .redactor-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .redactor-toggle label {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .redactor-switch {
      position: relative;
      width: 44px;
      height: 24px;
    }

    .redactor-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .redactor-switch .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 24px;
    }

    .redactor-switch .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .redactor-switch input:checked + .slider {
      background-color: #22c55e;
    }

    .redactor-switch input:checked + .slider:before {
      transform: translateX(20px);
    }

    .redactor-mapping {
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      max-height: 150px;
      overflow-y: auto;
    }

    .redactor-mapping-item {
      margin-bottom: 4px;
      color: #333;
    }

    .redactor-mapping-item .original {
      color: #bf0a30;
      font-weight: 600;
    }

    .redactor-mapping-item .arrow {
      color: #666;
      margin: 0 8px;
    }

    .redactor-mapping-item .redacted {
      color: #002868;
      font-weight: 600;
    }

    .redactor-btn {
      background: #002868;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      margin-top: 12px;
      width: 100%;
    }

    .redactor-btn:hover {
      background: #001a4d;
    }

    .redactor-section-title {
      font-size: 13px;
      font-weight: 700;
      color: #002868;
      margin: 12px 0 8px 0;
      text-transform: uppercase;
    }
  `)

  // Create indicator
  const indicator = document.createElement('div')
  indicator.className = 'redactor-indicator enabled'
  indicator.innerHTML = '<span class="status-dot"></span>Data Redactor'

  // Create settings panel
  const panel = document.createElement('div')
  panel.className = 'redactor-panel'
  panel.innerHTML = `
    <div class="redactor-panel-header">Data Redactor Settings</div>
    <div class="redactor-panel-content">
      <div class="redactor-toggle">
        <label>Enable Redaction</label>
        <label class="redactor-switch">
          <input type="checkbox" id="redactor-enabled" ${config.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
      <div class="redactor-toggle">
        <label>Auto-Redact on Paste</label>
        <label class="redactor-switch">
          <input type="checkbox" id="redactor-auto" ${config.autoRedact ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="redactor-section-title">Patterns</div>
      ${Object.entries(PATTERNS)
        .map(
          ([type]) => `
        <div class="redactor-toggle">
          <label>${type}</label>
          <label class="redactor-switch">
            <input type="checkbox" data-pattern="${type}" ${config.patterns[type]?.enabled ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
      `
        )
        .join('')}

      <div class="redactor-section-title">Last Redaction</div>
      <div class="redactor-mapping" id="redactor-mapping">
        No redactions yet
      </div>

      <button class="redactor-btn" id="redactor-copy-mapping">Copy Mapping</button>
    </div>
  `

  document.body.appendChild(indicator)
  document.body.appendChild(panel)

  // ============================================
  // Event Handlers
  // ============================================

  // Toggle panel visibility
  indicator.addEventListener('click', () => {
    panel.classList.toggle('visible')
  })

  // Enable/disable toggle
  document.getElementById('redactor-enabled').addEventListener('change', (e) => {
    config.enabled = e.target.checked
    indicator.className = `redactor-indicator ${config.enabled ? 'enabled' : 'disabled'}`
    GM_setValue('redactorConfig', config)
  })

  // Auto-redact toggle
  document.getElementById('redactor-auto').addEventListener('change', (e) => {
    config.autoRedact = e.target.checked
    GM_setValue('redactorConfig', config)
  })

  // Pattern toggles
  document.querySelectorAll('[data-pattern]').forEach((toggle) => {
    toggle.addEventListener('change', (e) => {
      const pattern = e.target.dataset.pattern
      if (!config.patterns[pattern]) {
        config.patterns[pattern] = { enabled: true, strategy: 'token' }
      }
      config.patterns[pattern].enabled = e.target.checked
      GM_setValue('redactorConfig', config)
    })
  })

  // Copy mapping button
  document.getElementById('redactor-copy-mapping').addEventListener('click', () => {
    const mapping = engine.getMapping()
    const text = Object.entries(mapping)
      .map(([orig, redacted]) => `${orig} -> ${redacted}`)
      .join('\n')
    navigator.clipboard.writeText(text || 'No redactions yet')
    alert('Mapping copied to clipboard!')
  })

  // Update mapping display
  function updateMappingDisplay() {
    const mappingEl = document.getElementById('redactor-mapping')
    const mapping = engine.getMapping()

    if (Object.keys(mapping).length === 0) {
      mappingEl.innerHTML = 'No redactions yet'
      return
    }

    mappingEl.innerHTML = Object.entries(mapping)
      .map(
        ([orig, redacted]) =>
          `<div class="redactor-mapping-item">
            <span class="original">${escapeHtml(orig)}</span>
            <span class="arrow">→</span>
            <span class="redacted">${escapeHtml(redacted)}</span>
          </div>`
      )
      .join('')
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // ============================================
  // Input Interception
  // ============================================

  // Find the main input field for the current AI chat
  function getInputField() {
    // ChatGPT
    const chatgptInput = document.querySelector(
      'textarea[data-id="root"], textarea#prompt-textarea, div[contenteditable="true"][data-testid]'
    )
    if (chatgptInput) return chatgptInput

    // Claude
    const claudeInput = document.querySelector(
      'div[contenteditable="true"].ProseMirror, textarea.ProseMirror'
    )
    if (claudeInput) return claudeInput

    // Gemini
    const geminiInput = document.querySelector('div[contenteditable="true"][role="textbox"]')
    if (geminiInput) return geminiInput

    // Generic fallback
    return document.querySelector(
      'textarea:not([readonly]), div[contenteditable="true"]'
    )
  }

  // Handle paste events
  document.addEventListener('paste', (e) => {
    if (!config.enabled || !config.autoRedact) return

    const input = getInputField()
    if (!input || !input.contains(document.activeElement)) return

    // Get pasted text
    const pastedText = e.clipboardData.getData('text')
    if (!pastedText) return

    // Redact the pasted text
    const result = engine.redact(pastedText)

    if (result.hasRedactions) {
      e.preventDefault()

      // Insert redacted text
      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        const start = input.selectionStart
        const end = input.selectionEnd
        const value = input.value
        input.value = value.slice(0, start) + result.redactedText + value.slice(end)
        input.selectionStart = input.selectionEnd = start + result.redactedText.length
      } else {
        // contenteditable
        document.execCommand('insertText', false, result.redactedText)
      }

      // Dispatch input event to trigger any listeners
      input.dispatchEvent(new Event('input', { bubbles: true }))

      updateMappingDisplay()

      console.log('[Data Redactor] Redacted pasted content:', result.mapping)
    }
  })

  // Add keyboard shortcut (Ctrl+Shift+R) to redact current input
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault()

      if (!config.enabled) {
        alert('Data Redactor is disabled')
        return
      }

      const input = getInputField()
      if (!input) {
        alert('No input field found')
        return
      }

      let text
      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        text = input.value
      } else {
        text = input.textContent || input.innerText
      }

      if (!text) {
        alert('No text to redact')
        return
      }

      const result = engine.redact(text)

      if (result.hasRedactions) {
        if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
          input.value = result.redactedText
        } else {
          input.textContent = result.redactedText
        }
        input.dispatchEvent(new Event('input', { bubbles: true }))

        updateMappingDisplay()
        console.log('[Data Redactor] Redacted input:', result.mapping)
      } else {
        console.log('[Data Redactor] No sensitive data detected')
      }
    }
  })

  console.log('[Data Redactor] Initialized. Press Ctrl+Shift+R to redact current input.')
})()
