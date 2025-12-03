// Data Redactor - Content Script
// Full-featured redaction engine with CRM bridge and Gem templates

;(function () {
  'use strict'

  // ============================================
  // CONFIGURATION
  // ============================================

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
  let currentCustomerData = null
  let lastRedactionResult = null
  let isPanelVisible = false

  // Load config
  chrome.storage.sync.get('redactorConfig', (result) => {
    if (result.redactorConfig) {
      config = { ...DEFAULT_CONFIG, ...result.redactorConfig }
      updateIndicatorState()
    }
  })

  // Listen for config changes
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.redactorConfig) {
      config = { ...DEFAULT_CONFIG, ...changes.redactorConfig.newValue }
      updateIndicatorState()
      updatePreview()
    }
    if (area === 'local' && changes.bridge_customer_current) {
      currentCustomerData = changes.bridge_customer_current.newValue
      updateCustomerCard()
      updatePreview()
    }
  })

  // ============================================
  // PATTERN DEFINITIONS
  // ============================================

  const PATTERNS = {
    email: {
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      token: (idx) => `[EMAIL_${idx}]`,
      description: 'Email addresses',
    },
    phone: {
      regex: /(?:\+?1[-.\s]?)?(?:\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/g,
      token: (idx) => `[PHONE_${idx}]`,
      description: 'Phone numbers',
    },
    ssn: {
      regex: /\b\d{3}-\d{2}-\d{4}\b/g,
      token: (idx) => `[SSN_${idx}]`,
      description: 'Social Security Numbers',
    },
    creditCard: {
      regex: /\b(?:\d{4}[-\s]?){3,4}\d{1,4}\b|\b\d{13,19}\b/g,
      token: (idx) => `[CARD_${idx}]`,
      description: 'Credit card numbers',
    },
    ipv4: {
      regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?\b/g,
      token: (idx) => `[IP_${idx}]`,
      formatPreserving: (value) => {
        const parts = value.split('.')
        return parts.map((p, i) => (i === 0 ? '10' : Math.floor(Math.random() * 256))).join('.')
      },
      description: 'IPv4 addresses',
    },
    ipv6: {
      regex: /(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}/g,
      token: (idx) => `[IPV6_${idx}]`,
      description: 'IPv6 addresses',
    },
    macAddress: {
      regex: /(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})/g,
      token: (idx) => `[MAC_${idx}]`,
      description: 'MAC addresses',
    },
    awsKey: {
      regex: /\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b/g,
      token: (idx) => `[AWS_KEY_${idx}]`,
      description: 'AWS Access Keys',
    },
    apiKey: {
      regex: /(?:api[_-]?key|apikey|api_secret|access[_-]?token|bearer)['":\s]*[=:]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
      token: (idx) => `[API_KEY_${idx}]`,
      description: 'API Keys',
    },
  }

  // ============================================
  // GEM TEMPLATES
  // ============================================

  const GEM_TEMPLATES = [
    {
      id: 'troubleshoot',
      name: 'Troubleshooting',
      icon: '🔧',
      description: 'Step-by-step issue diagnosis',
      prompt: `I'm a support engineer helping a customer with a technical issue.

**Customer Context:**
- Customer: {customer_name}
- Company: {customer_company}
- Account: {customer_account}
- Case: {case_number}

**Issue:**
{case_subject}

{case_description}

Please help me troubleshoot this issue step by step. Consider:
1. Common causes for this type of issue
2. Diagnostic questions to ask the customer
3. Step-by-step resolution steps
4. When to escalate`,
    },
    {
      id: 'escalation',
      name: 'Escalation Summary',
      icon: '🚨',
      description: 'Generate escalation docs',
      prompt: `Generate a professional escalation summary for the following case:

**Customer Information:**
- Customer: {customer_name}
- Company: {customer_company}
- Account ID: {customer_account}
- Case Number: {case_number}
- Priority: {case_priority}

**Issue Summary:**
{case_subject}

**Detailed Description:**
{case_description}

**Additional Context:**
{additional_context}

Please create an escalation document that includes:
1. Executive Summary (2-3 sentences)
2. Business Impact
3. Timeline of Events
4. Troubleshooting Completed
5. Current Status
6. Recommended Next Steps
7. Resources Required`,
    },
    {
      id: 'customer_response',
      name: 'Customer Response',
      icon: '✉️',
      description: 'Draft professional emails',
      prompt: `Draft a professional customer response email.

**Customer:** {customer_name}
**Company:** {customer_company}
**Issue:** {case_subject}

**Context:**
{case_description}

**What we need to communicate:**
{additional_context}

Please draft a professional, empathetic email that:
- Acknowledges their concern
- Explains the situation clearly
- Provides next steps
- Sets appropriate expectations
- Maintains a helpful, professional tone`,
    },
    {
      id: 'kb_article',
      name: 'KB Article',
      icon: '📚',
      description: 'Create knowledge base articles',
      prompt: `Based on this support case, draft a knowledge base article.

**Issue:** {case_subject}

**Problem Description:**
{case_description}

**Resolution:**
{additional_context}

Create a knowledge base article with:
1. Title (clear, searchable)
2. Problem Statement
3. Symptoms
4. Root Cause
5. Solution (step-by-step)
6. Prevention/Best Practices
7. Related Articles (suggest topics)`,
    },
    {
      id: 'analysis',
      name: 'Issue Analysis',
      icon: '🔍',
      description: 'Deep dive root cause',
      prompt: `Perform a detailed analysis of this support issue.

**Customer:** {customer_name} at {customer_company}
**Issue:** {case_subject}

**Description:**
{case_description}

Please analyze:
1. What is the likely root cause?
2. What information do we need to confirm?
3. What are the possible solutions?
4. What is the recommended approach?
5. What preventive measures should be suggested?`,
    },
    {
      id: 'custom',
      name: 'Custom Prompt',
      icon: '✏️',
      description: 'Build your own prompt',
      prompt: `{additional_context}

**Customer Context (for reference):**
- Customer: {customer_name}
- Company: {customer_company}
- Case: {case_number}`,
    },
  ]

  // ============================================
  // REDACTION ENGINE
  // ============================================

  class RedactionEngine {
    constructor() {
      this.mapping = new Map()
      this.reverseMapping = new Map()
      this.counters = {}
      this.customEntities = []
    }

    reset() {
      this.mapping.clear()
      this.reverseMapping.clear()
      this.counters = {}
    }

    addCustomEntity(value, type = 'ENTITY') {
      if (value && value.trim()) {
        this.customEntities.push({ value: value.trim(), type: type.toUpperCase() })
      }
    }

    clearCustomEntities() {
      this.customEntities = []
    }

    getCounter(type) {
      if (!this.counters[type]) this.counters[type] = 0
      return ++this.counters[type]
    }

    redact(text) {
      if (!text) return { redactedText: '', mapping: {}, hasRedactions: false, count: 0 }

      this.reset()
      let result = text

      // Process regex patterns
      for (const [type, patternConfig] of Object.entries(PATTERNS)) {
        if (!config.patterns[type]?.enabled) continue

        const strategy = config.patterns[type]?.strategy || 'token'
        patternConfig.regex.lastIndex = 0

        result = result.replace(patternConfig.regex, (match) => {
          if (this.mapping.has(match)) return this.mapping.get(match)

          const idx = this.getCounter(type)
          let replacement = strategy === 'formatPreserving' && patternConfig.formatPreserving
            ? patternConfig.formatPreserving(match)
            : patternConfig.token(idx)

          this.mapping.set(match, replacement)
          this.reverseMapping.set(replacement, match)
          return replacement
        })
      }

      // Process custom entities (customer names, company names)
      for (const entity of this.customEntities) {
        const escapedValue = entity.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`\\b${escapedValue}\\b`, 'gi')

        result = result.replace(regex, (match) => {
          const key = match.toLowerCase()
          if (this.mapping.has(key)) return this.mapping.get(key)

          const idx = this.getCounter(entity.type)
          const replacement = `[${entity.type}_${idx}]`

          this.mapping.set(key, replacement)
          this.mapping.set(match, replacement)
          this.reverseMapping.set(replacement, match)
          return replacement
        })
      }

      // Process config custom entities
      for (const [entityType, entities] of Object.entries(config.customEntities || {})) {
        if (!Array.isArray(entities)) continue
        for (const entity of entities) {
          if (!entity) continue
          const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`\\b${escapedEntity}\\b`, 'gi')

          result = result.replace(regex, (match) => {
            if (this.mapping.has(match.toLowerCase())) return this.mapping.get(match.toLowerCase())
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
        reverseMapping: Object.fromEntries(this.reverseMapping),
        hasRedactions: this.mapping.size > 0,
        count: this.mapping.size,
      }
    }

    getMapping() {
      return Object.fromEntries(this.mapping)
    }
  }

  const engine = new RedactionEngine()

  // ============================================
  // TEMPLATE ENGINE
  // ============================================

  function processTemplate(templateId, customerData, additionalContext = '') {
    const template = GEM_TEMPLATES.find(t => t.id === templateId)
    if (!template) return ''

    let prompt = template.prompt

    const replacements = {
      '{customer_name}': customerData?.customer?.name || '[CUSTOMER]',
      '{customer_email}': customerData?.customer?.email || '[EMAIL]',
      '{customer_phone}': customerData?.customer?.phone || '[PHONE]',
      '{customer_company}': customerData?.customer?.company || '[COMPANY]',
      '{customer_account}': customerData?.customer?.accountId || '[ACCOUNT]',
      '{case_number}': customerData?.caseNumber || '[CASE]',
      '{case_subject}': customerData?.context?.subject || '[Subject not provided]',
      '{case_description}': customerData?.context?.description || '[Description not provided]',
      '{case_priority}': customerData?.context?.priority || 'Normal',
      '{case_product}': customerData?.context?.product || '[Product]',
      '{additional_context}': additionalContext || '[Add your specific question or context here]',
    }

    for (const [placeholder, value] of Object.entries(replacements)) {
      prompt = prompt.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
    }

    return prompt
  }

  // ============================================
  // UI CREATION
  // ============================================

  function createUI() {
    // Create indicator button
    const indicator = document.createElement('div')
    indicator.id = 'redactor-indicator'
    indicator.className = 'redactor-indicator'
    indicator.innerHTML = `
      <span class="status-dot"></span>
      <span class="indicator-text">Redactor</span>
    `
    document.body.appendChild(indicator)

    // Create toast
    const toast = document.createElement('div')
    toast.id = 'redactor-toast'
    toast.className = 'redactor-toast'
    document.body.appendChild(toast)

    // Create main panel
    const panel = document.createElement('div')
    panel.id = 'redactor-panel'
    panel.className = 'redactor-panel'
    panel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title">
          <span class="panel-icon">🛡️</span>
          <span>Data Redactor</span>
          <span class="panel-badge" id="panel-badge">No Data</span>
        </div>
        <button class="panel-close" id="panel-close">×</button>
      </div>

      <div class="panel-body">
        <!-- Customer Card -->
        <div class="customer-card" id="customer-card">
          <div class="customer-card-header">
            <span class="customer-card-title" id="customer-card-title">👤 Customer Context</span>
            <button class="customer-refresh-btn" id="customer-refresh" title="Refresh">↻</button>
          </div>
          <div class="customer-fields" id="customer-fields">
            <div class="no-data-msg">No customer data loaded. Capture from your CRM.</div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="panel-tabs">
          <button class="panel-tab active" data-tab="templates">📋 Templates</button>
          <button class="panel-tab" data-tab="manual">✏️ Manual</button>
          <button class="panel-tab" data-tab="history">📜 History</button>
        </div>

        <!-- Templates Tab -->
        <div class="tab-content active" data-tab="templates">
          <div class="section-title">Select Gem Template</div>
          <div class="template-grid" id="template-grid"></div>

          <div class="section-title">Additional Context</div>
          <textarea class="redactor-textarea" id="additional-context" placeholder="Add specific details, questions, or context..."></textarea>

          <div class="section-title">Preview (Redacted)</div>
          <textarea class="redactor-textarea preview" id="preview-textarea" readonly></textarea>

          <div class="section-title">Redaction Mapping</div>
          <div class="mapping-container" id="mapping-container">No redactions applied</div>

          <div class="button-group">
            <button class="redactor-btn secondary" id="copy-btn">📋 Copy</button>
            <button class="redactor-btn primary" id="insert-btn">▶ Insert</button>
          </div>
        </div>

        <!-- Manual Tab -->
        <div class="tab-content" data-tab="manual">
          <div class="section-title">Enter Text to Redact</div>
          <textarea class="redactor-textarea" id="manual-input" placeholder="Paste any text here to redact PII..."></textarea>

          <div class="section-title">Redacted Output</div>
          <textarea class="redactor-textarea preview" id="manual-output" readonly></textarea>

          <div class="button-group">
            <button class="redactor-btn secondary" id="manual-copy-btn">📋 Copy</button>
            <button class="redactor-btn primary" id="manual-insert-btn">▶ Insert</button>
          </div>
        </div>

        <!-- History Tab -->
        <div class="tab-content" data-tab="history">
          <div class="section-title">Recent Customers</div>
          <div class="history-list" id="history-list">
            <div class="no-data-msg">No history yet</div>
          </div>
          <button class="redactor-btn secondary" id="clear-history-btn">🗑️ Clear History</button>
        </div>

        <!-- Status Message -->
        <div class="status-message" id="status-message"></div>
      </div>
    `
    document.body.appendChild(panel)

    // Build template grid
    buildTemplateGrid()

    // Attach event listeners
    attachEventListeners()

    // Load initial data
    loadCustomerData()
    loadHistory()
  }

  function buildTemplateGrid() {
    const grid = document.getElementById('template-grid')
    grid.innerHTML = GEM_TEMPLATES.map(t => `
      <div class="template-option ${t.id === config.selectedTemplate ? 'selected' : ''}" data-template="${t.id}">
        <span class="template-icon">${t.icon}</span>
        <div class="template-info">
          <div class="template-name">${t.name}</div>
          <div class="template-desc">${t.description}</div>
        </div>
      </div>
    `).join('')
  }

  function attachEventListeners() {
    const indicator = document.getElementById('redactor-indicator')
    const panel = document.getElementById('redactor-panel')
    const closeBtn = document.getElementById('panel-close')

    // Indicator click - toggle panel
    indicator.addEventListener('click', (e) => {
      if (e.shiftKey) {
        // Shift+click toggles enabled
        config.enabled = !config.enabled
        chrome.storage.sync.set({ redactorConfig: config })
        updateIndicatorState()
        showToast(config.enabled ? 'Redactor Enabled' : 'Redactor Disabled')
      } else {
        togglePanel()
      }
    })

    // Close button
    closeBtn.addEventListener('click', () => togglePanel(false))

    // Tab switching
    document.querySelectorAll('.panel-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'))
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'))
        tab.classList.add('active')
        document.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active')
      })
    })

    // Template selection
    document.getElementById('template-grid').addEventListener('click', (e) => {
      const option = e.target.closest('.template-option')
      if (option) {
        document.querySelectorAll('.template-option').forEach(o => o.classList.remove('selected'))
        option.classList.add('selected')
        config.selectedTemplate = option.dataset.template
        chrome.storage.sync.set({ redactorConfig: config })
        updatePreview()
      }
    })

    // Additional context updates preview
    document.getElementById('additional-context').addEventListener('input', updatePreview)

    // Manual redaction
    document.getElementById('manual-input').addEventListener('input', (e) => {
      const result = engine.redact(e.target.value)
      document.getElementById('manual-output').value = result.redactedText
    })

    // Button handlers
    document.getElementById('copy-btn').addEventListener('click', () => {
      const text = document.getElementById('preview-textarea').value
      navigator.clipboard.writeText(text)
      showToast('Copied to clipboard!')
    })

    document.getElementById('insert-btn').addEventListener('click', () => {
      const text = document.getElementById('preview-textarea').value
      insertIntoInput(text)
    })

    document.getElementById('manual-copy-btn').addEventListener('click', () => {
      const text = document.getElementById('manual-output').value
      navigator.clipboard.writeText(text)
      showToast('Copied to clipboard!')
    })

    document.getElementById('manual-insert-btn').addEventListener('click', () => {
      const text = document.getElementById('manual-output').value
      insertIntoInput(text)
    })

    // Refresh customer data
    document.getElementById('customer-refresh').addEventListener('click', () => {
      loadCustomerData()
      showToast('Customer data refreshed')
    })

    // Clear history
    document.getElementById('clear-history-btn').addEventListener('click', async () => {
      if (confirm('Clear all customer history?')) {
        await chrome.storage.local.set({ bridge_customer_history: [] })
        await chrome.storage.local.remove('bridge_customer_current')
        currentCustomerData = null
        updateCustomerCard()
        loadHistory()
        showToast('History cleared')
      }
    })
  }

  // ============================================
  // UI UPDATES
  // ============================================

  function togglePanel(show = null) {
    const panel = document.getElementById('redactor-panel')
    isPanelVisible = show !== null ? show : !isPanelVisible
    panel.classList.toggle('visible', isPanelVisible)
  }

  function updateIndicatorState() {
    const indicator = document.getElementById('redactor-indicator')
    if (indicator) {
      indicator.classList.toggle('disabled', !config.enabled)
    }
  }

  function showToast(message, duration = 2000) {
    const toast = document.getElementById('redactor-toast')
    toast.textContent = message
    toast.classList.add('visible')
    setTimeout(() => toast.classList.remove('visible'), duration)
  }

  function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('status-message')
    statusEl.textContent = message
    statusEl.className = `status-message visible ${type}`
    if (type !== 'error') {
      setTimeout(() => statusEl.classList.remove('visible'), 3000)
    }
  }

  async function loadCustomerData() {
    try {
      const result = await chrome.storage.local.get('bridge_customer_current')
      currentCustomerData = result.bridge_customer_current || null
      updateCustomerCard()
      updatePreview()
    } catch (e) {
      console.error('[Data Redactor] Error loading customer data:', e)
    }
  }

  function updateCustomerCard() {
    const card = document.getElementById('customer-card')
    const badge = document.getElementById('panel-badge')
    const fields = document.getElementById('customer-fields')
    const title = document.getElementById('customer-card-title')

    if (currentCustomerData && (currentCustomerData.customer?.name || currentCustomerData.customer?.email)) {
      card.classList.remove('no-data')
      badge.classList.add('has-data')
      badge.textContent = 'Customer Loaded'
      title.innerHTML = '👤 Customer Context <span class="status-dot-inline"></span>'

      // Add customer as custom entity for redaction
      engine.clearCustomEntities()
      if (currentCustomerData.customer?.name) {
        engine.addCustomEntity(currentCustomerData.customer.name, 'CUSTOMER')
      }
      if (currentCustomerData.customer?.company) {
        engine.addCustomEntity(currentCustomerData.customer.company, 'COMPANY')
      }

      // Show redacted preview of customer data
      const c = currentCustomerData.customer
      fields.innerHTML = `
        ${c.name ? `<div class="customer-field"><span class="field-label">Name:</span><span class="field-value redacted">[CUSTOMER_1]</span></div>` : ''}
        ${c.email ? `<div class="customer-field"><span class="field-label">Email:</span><span class="field-value redacted">[EMAIL_1]</span></div>` : ''}
        ${c.phone ? `<div class="customer-field"><span class="field-label">Phone:</span><span class="field-value redacted">[PHONE_1]</span></div>` : ''}
        ${c.company ? `<div class="customer-field"><span class="field-label">Company:</span><span class="field-value redacted">[COMPANY_1]</span></div>` : ''}
        ${currentCustomerData.caseNumber ? `<div class="customer-field"><span class="field-label">Case:</span><span class="field-value">${escapeHtml(currentCustomerData.caseNumber)}</span></div>` : ''}
        <div class="customer-field"><span class="field-label">Source:</span><span class="field-value">${escapeHtml(currentCustomerData.source || 'Unknown')}</span></div>
      `
    } else {
      card.classList.add('no-data')
      badge.classList.remove('has-data')
      badge.textContent = 'No Data'
      title.textContent = '👤 Customer Context'
      fields.innerHTML = '<div class="no-data-msg">No customer data loaded. Capture from your CRM.</div>'
    }
  }

  function updatePreview() {
    const previewArea = document.getElementById('preview-textarea')
    const additionalContext = document.getElementById('additional-context')?.value || ''

    if (!currentCustomerData) {
      previewArea.value = 'Load customer data from your CRM first, or use the Manual tab.'
      return
    }

    // Generate template with customer data
    let prompt = processTemplate(config.selectedTemplate, currentCustomerData, additionalContext)

    // Setup custom entities for redaction
    engine.clearCustomEntities()
    if (currentCustomerData.customer?.name) {
      engine.addCustomEntity(currentCustomerData.customer.name, 'CUSTOMER')
    }
    if (currentCustomerData.customer?.company) {
      engine.addCustomEntity(currentCustomerData.customer.company, 'COMPANY')
    }

    // Redact the prompt
    lastRedactionResult = engine.redact(prompt)
    previewArea.value = lastRedactionResult.redactedText

    // Update mapping display
    updateMappingDisplay()
  }

  function updateMappingDisplay() {
    const container = document.getElementById('mapping-container')
    if (!lastRedactionResult || !lastRedactionResult.hasRedactions) {
      container.innerHTML = '<div class="no-data-msg">No redactions applied</div>'
      return
    }

    container.innerHTML = Object.entries(lastRedactionResult.mapping)
      .map(([original, token]) => `
        <div class="mapping-item">
          <span class="mapping-original" title="${escapeHtml(original)}">${escapeHtml(original.substring(0, 20))}${original.length > 20 ? '...' : ''}</span>
          <span class="mapping-arrow">→</span>
          <span class="mapping-token">${escapeHtml(token)}</span>
        </div>
      `).join('')
  }

  async function loadHistory() {
    try {
      const result = await chrome.storage.local.get('bridge_customer_history')
      const history = result.bridge_customer_history || []
      const container = document.getElementById('history-list')

      if (history.length === 0) {
        container.innerHTML = '<div class="no-data-msg">No history yet</div>'
        return
      }

      container.innerHTML = history.map(h => `
        <div class="history-item" data-id="${h.id}">
          <div class="history-item-name">${escapeHtml(h.customer?.name || 'Unknown')}</div>
          <div class="history-item-meta">${escapeHtml(h.customer?.company || '')} • ${new Date(h.capturedAt).toLocaleDateString()}</div>
        </div>
      `).join('')

      // Attach click handlers
      container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', async () => {
          const history = (await chrome.storage.local.get('bridge_customer_history')).bridge_customer_history || []
          const selected = history.find(h => h.id === item.dataset.id)
          if (selected) {
            await chrome.storage.local.set({ bridge_customer_current: selected })
            currentCustomerData = selected
            updateCustomerCard()
            updatePreview()
            showToast('Customer loaded from history')
            document.querySelector('[data-tab="templates"]').click()
          }
        })
      })
    } catch (e) {
      console.error('[Data Redactor] Error loading history:', e)
    }
  }

  // ============================================
  // INPUT FIELD HANDLING
  // ============================================

  function getInputField() {
    // ChatGPT
    const chatgptInput = document.querySelector('textarea[data-id="root"], textarea#prompt-textarea, div[contenteditable="true"][data-testid]')
    if (chatgptInput) return chatgptInput

    // Claude
    const claudeInput = document.querySelector('div[contenteditable="true"].ProseMirror, textarea.ProseMirror')
    if (claudeInput) return claudeInput

    // Gemini
    const geminiInput = document.querySelector('div[contenteditable="true"][role="textbox"], rich-textarea div[contenteditable="true"]')
    if (geminiInput) return geminiInput

    // Copilot
    const copilotInput = document.querySelector('textarea[name="searchbox"]')
    if (copilotInput) return copilotInput

    // Generic fallback
    return document.querySelector('textarea:not([readonly]), div[contenteditable="true"]')
  }

  function insertIntoInput(text) {
    const input = getInputField()
    if (!input) {
      showToast('Could not find input field', 'error')
      return false
    }

    if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
      input.value = text
      input.dispatchEvent(new Event('input', { bubbles: true }))
    } else {
      // contenteditable
      input.focus()
      input.innerHTML = ''
      document.execCommand('insertText', false, text)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }

    showToast('Prompt inserted!')
    togglePanel(false)
    return true
  }

  function redactCurrentInput() {
    if (!config.enabled) {
      showToast('Redactor is disabled')
      return { success: false, error: 'Disabled' }
    }

    const input = getInputField()
    if (!input) {
      showToast('No input field found')
      return { success: false, error: 'No input field' }
    }

    let text = input.tagName === 'TEXTAREA' || input.tagName === 'INPUT'
      ? input.value
      : input.textContent || input.innerText

    if (!text) {
      showToast('No text to redact')
      return { success: false, error: 'No text' }
    }

    const result = engine.redact(text)

    if (result.hasRedactions) {
      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        input.value = result.redactedText
      } else {
        input.textContent = result.redactedText
      }
      input.dispatchEvent(new Event('input', { bubbles: true }))
      chrome.storage.local.set({ lastMapping: result.mapping })
      showToast(`Redacted ${result.count} item(s)`)
      return { success: true, count: result.count, mapping: result.mapping }
    } else {
      showToast('No sensitive data found')
      return { success: true, count: 0 }
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  // Handle paste events for auto-redact
  document.addEventListener('paste', (e) => {
    if (!config.enabled || !config.autoRedact) return

    const input = getInputField()
    if (!input || !input.contains(document.activeElement)) return

    const pastedText = e.clipboardData.getData('text')
    if (!pastedText) return

    const result = engine.redact(pastedText)

    if (result.hasRedactions) {
      e.preventDefault()

      if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
        const start = input.selectionStart
        const end = input.selectionEnd
        input.value = input.value.slice(0, start) + result.redactedText + input.value.slice(end)
        input.selectionStart = input.selectionEnd = start + result.redactedText.length
      } else {
        document.execCommand('insertText', false, result.redactedText)
      }

      input.dispatchEvent(new Event('input', { bubbles: true }))
      chrome.storage.local.set({ lastMapping: result.mapping })
      showToast(`Redacted ${result.count} item(s)`)
    }
  })

  // Keyboard shortcut: Ctrl+Shift+R to redact current input
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault()
      redactCurrentInput()
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault()
      togglePanel()
    }
  })

  // Listen for messages from popup/background
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'redactNow') {
      const result = redactCurrentInput()
      sendResponse(result)
      return true
    }

    if (msg.action === 'togglePanel') {
      togglePanel()
      sendResponse({ success: true })
      return true
    }

    if (msg.action === 'customerDataUpdated') {
      currentCustomerData = msg.data
      updateCustomerCard()
      updatePreview()
      if (msg.data) {
        showToast('Customer data received!')
      }
      sendResponse({ success: true })
      return true
    }

    if (msg.action === 'getStatus') {
      sendResponse({
        enabled: config.enabled,
        hasCustomer: !!currentCustomerData,
        customerName: currentCustomerData?.customer?.name || null
      })
      return true
    }
  })

  // ============================================
  // UTILITIES
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function initialize() {
    createUI()
    updateIndicatorState()
    console.log('[Data Redactor] Extension loaded. Ctrl+Shift+R to redact, Ctrl+Shift+D to toggle panel.')
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }

})()
