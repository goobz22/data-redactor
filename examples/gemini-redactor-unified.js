// ==UserScript==
// @name         Gemini Redactor - Unified CRM Bridge + Data Protection
// @namespace    https://github.com/goobz22/data-redactor
// @version      1.0.0
// @description  Complete solution: CRM data bridge, automatic PII redaction, Gem templates, and Google Docs export
// @author       Data Redactor Team
// @match        https://gemini.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      *.googleusercontent.com
// ==/UserScript==

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    // Google Apps Script Web App URL (for Google Docs export)
    // Replace with your deployed script URL
    WEB_APP_URL: "",

    // Panel position
    panelPosition: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'

    // Auto-insert redacted content when customer data is loaded
    autoInsert: false,

    // Show redaction preview before inserting
    showPreview: true,
  };

  // ============================================
  // GEM TEMPLATES
  // Customize these for your support organization
  // ============================================

  const DEFAULT_TEMPLATES = [
    {
      id: 'troubleshoot',
      name: '🔧 Troubleshooting',
      description: 'Step-by-step troubleshooting assistance',
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
      name: '🚨 Escalation Summary',
      description: 'Generate escalation documentation',
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
      name: '✉️ Customer Response',
      description: 'Draft a professional customer email',
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
      id: 'documentation',
      name: '📚 KB Article',
      description: 'Draft a knowledge base article',
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
      name: '🔍 Issue Analysis',
      description: 'Deep dive analysis of the issue',
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
      name: '✏️ Custom Prompt',
      description: 'Build your own prompt with customer context',
      prompt: `{additional_context}

**Customer Context (for reference):**
- Customer: {customer_name}
- Company: {customer_company}
- Case: {case_number}`,
    },
  ];

  // ============================================
  // BROWSER BRIDGE MODULE
  // Reads customer data from CRM extractor
  // ============================================

  const CustomerBridge = {
    STORAGE_KEY: 'bridge_customer_current',
    HISTORY_KEY: 'bridge_customer_history',
    MAX_HISTORY: 20,

    save(customerData) {
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
      };
      GM_setValue(this.STORAGE_KEY, capture);
      this._addToHistory(capture);
      console.log('[CustomerBridge] Saved customer:', capture.id);
      return capture.id;
    },

    get() {
      return GM_getValue(this.STORAGE_KEY, null);
    },

    getHistory() {
      return GM_getValue(this.HISTORY_KEY, []);
    },

    clear() {
      GM_setValue(this.STORAGE_KEY, null);
    },

    hasData() {
      const data = this.get();
      return data !== null && (data.customer?.name || data.customer?.email);
    },

    _generateId() {
      return 'cap_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    _addToHistory(capture) {
      let history = this.getHistory();
      history = history.filter(h => h.id !== capture.id);
      history.unshift(capture);
      history = history.slice(0, this.MAX_HISTORY);
      GM_setValue(this.HISTORY_KEY, history);
    }
  };

  // ============================================
  // REDACTION ENGINE
  // Detects and redacts PII patterns
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
      regex: /\b(?:\d{4}[-\s]?){3,4}\d{1,4}\b/g,
      token: (idx) => `[CARD_${idx}]`,
      description: 'Credit card numbers',
    },
    ipv4: {
      regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/\d{1,2})?\b/g,
      token: (idx) => `[IP_${idx}]`,
      description: 'IP addresses',
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
      regex: /\b(?:api[_-]?key|apikey|api_secret|access[_-]?token)['":\s]*[=:]\s*['"]?([a-zA-Z0-9_\-]{20,})['"]?/gi,
      token: (idx) => `[API_KEY_${idx}]`,
      description: 'API Keys',
    },
  };

  class RedactionEngine {
    constructor() {
      this.mapping = new Map();
      this.reverseMapping = new Map();
      this.counters = {};
      this.customEntities = [];
      this.enabledPatterns = Object.keys(PATTERNS);
    }

    reset() {
      this.mapping.clear();
      this.reverseMapping.clear();
      this.counters = {};
    }

    setEnabledPatterns(patterns) {
      this.enabledPatterns = patterns;
    }

    addCustomEntity(value, type = 'ENTITY') {
      if (value && value.trim()) {
        this.customEntities.push({ value: value.trim(), type: type.toUpperCase() });
      }
    }

    clearCustomEntities() {
      this.customEntities = [];
    }

    getCounter(type) {
      if (!this.counters[type]) {
        this.counters[type] = 0;
      }
      return ++this.counters[type];
    }

    redact(text) {
      if (!text) return { redactedText: '', mapping: {}, hasRedactions: false };

      this.reset();
      let result = text;

      // Process regex patterns
      for (const [type, patternConfig] of Object.entries(PATTERNS)) {
        if (!this.enabledPatterns.includes(type)) continue;

        // Reset regex lastIndex
        patternConfig.regex.lastIndex = 0;

        result = result.replace(patternConfig.regex, (match) => {
          if (this.mapping.has(match)) {
            return this.mapping.get(match);
          }

          const idx = this.getCounter(type);
          const replacement = patternConfig.token(idx);

          this.mapping.set(match, replacement);
          this.reverseMapping.set(replacement, match);
          return replacement;
        });
      }

      // Process custom entities
      for (const entity of this.customEntities) {
        const escapedValue = entity.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedValue}\\b`, 'gi');

        result = result.replace(regex, (match) => {
          const key = match.toLowerCase();
          if (this.mapping.has(key)) {
            return this.mapping.get(key);
          }

          const idx = this.getCounter(entity.type);
          const replacement = `[${entity.type}_${idx}]`;

          this.mapping.set(key, replacement);
          this.mapping.set(match, replacement);
          this.reverseMapping.set(replacement, match);
          return replacement;
        });
      }

      return {
        redactedText: result,
        mapping: Object.fromEntries(this.mapping),
        reverseMapping: Object.fromEntries(this.reverseMapping),
        hasRedactions: this.mapping.size > 0,
        count: this.mapping.size,
      };
    }

    // Restore original values from tokens
    restore(text) {
      let result = text;
      for (const [token, original] of this.reverseMapping) {
        result = result.replace(new RegExp(token.replace(/[[\]]/g, '\\$&'), 'g'), original);
      }
      return result;
    }

    getMapping() {
      return Object.fromEntries(this.mapping);
    }
  }

  const redactionEngine = new RedactionEngine();

  // ============================================
  // TEMPLATE ENGINE
  // Processes templates with customer data
  // ============================================

  const TemplateEngine = {
    templates: [...DEFAULT_TEMPLATES],

    loadCustomTemplates() {
      const custom = GM_getValue('custom_templates', []);
      this.templates = [...DEFAULT_TEMPLATES, ...custom];
    },

    saveCustomTemplate(template) {
      const custom = GM_getValue('custom_templates', []);
      custom.push(template);
      GM_setValue('custom_templates', custom);
      this.loadCustomTemplates();
    },

    getTemplate(id) {
      return this.templates.find(t => t.id === id);
    },

    processTemplate(templateId, customerData, additionalContext = '') {
      const template = this.getTemplate(templateId);
      if (!template) return '';

      let prompt = template.prompt;

      // Replace placeholders with customer data
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
      };

      for (const [placeholder, value] of Object.entries(replacements)) {
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
      }

      return prompt;
    },
  };

  // ============================================
  // STYLES
  // ============================================

  GM_addStyle(`
    /* Main Panel */
    .gemini-redactor-panel {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
      font-family: "Google Sans", Roboto, -apple-system, sans-serif;
      width: 380px;
      max-height: 85vh;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .gemini-redactor-panel.collapsed {
      width: auto;
      max-height: none;
      border-radius: 28px;
    }

    .gemini-redactor-panel.collapsed .panel-body {
      display: none;
    }

    /* Header */
    .redactor-header {
      background: linear-gradient(135deg, #1a73e8 0%, #4285f4 50%, #8ab4f8 100%);
      color: white;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
    }

    .redactor-header:hover {
      background: linear-gradient(135deg, #1557b0 0%, #1a73e8 50%, #4285f4 100%);
    }

    .redactor-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 15px;
    }

    .redactor-title-icon {
      font-size: 20px;
    }

    .redactor-badge {
      background: rgba(255, 255, 255, 0.25);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
    }

    .redactor-badge.has-data {
      background: #34a853;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .redactor-toggle-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-size: 14px;
    }

    .redactor-toggle-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    /* Body */
    .panel-body {
      max-height: calc(85vh - 60px);
      overflow-y: auto;
    }

    /* Customer Card */
    .customer-card {
      margin: 12px;
      padding: 14px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e8f0fe 100%);
      border-radius: 12px;
      border-left: 4px solid #1a73e8;
    }

    .customer-card.no-data {
      border-left-color: #9aa0a6;
      background: #f8f9fa;
    }

    .customer-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .customer-card-title {
      font-weight: 600;
      font-size: 13px;
      color: #1a73e8;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .customer-card.no-data .customer-card-title {
      color: #5f6368;
    }

    .customer-refresh-btn {
      background: none;
      border: none;
      color: #1a73e8;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      font-size: 14px;
      transition: all 0.2s;
    }

    .customer-refresh-btn:hover {
      background: rgba(26, 115, 232, 0.1);
      transform: rotate(180deg);
    }

    .customer-fields {
      display: grid;
      gap: 6px;
    }

    .customer-field {
      display: flex;
      font-size: 12px;
    }

    .customer-field-label {
      color: #5f6368;
      min-width: 70px;
    }

    .customer-field-value {
      color: #202124;
      font-weight: 500;
      word-break: break-all;
    }

    .customer-field-value.redacted {
      color: #1a73e8;
      font-family: monospace;
      background: #e8f0fe;
      padding: 1px 4px;
      border-radius: 3px;
    }

    /* Tabs */
    .redactor-tabs {
      display: flex;
      border-bottom: 1px solid #e8eaed;
      background: #fafafa;
    }

    .redactor-tab {
      flex: 1;
      padding: 10px;
      background: none;
      border: none;
      color: #5f6368;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .redactor-tab:hover {
      color: #1a73e8;
      background: #e8f0fe;
    }

    .redactor-tab.active {
      color: #1a73e8;
      border-bottom: 2px solid #1a73e8;
      background: white;
    }

    /* Tab Content */
    .tab-content {
      display: none;
      padding: 12px;
    }

    .tab-content.active {
      display: block;
    }

    /* Template Selector */
    .template-selector {
      display: grid;
      gap: 8px;
      margin-bottom: 12px;
    }

    .template-option {
      padding: 10px 12px;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .template-option:hover {
      border-color: #1a73e8;
      background: #f8f9fa;
    }

    .template-option.selected {
      border-color: #1a73e8;
      background: #e8f0fe;
    }

    .template-option-name {
      font-weight: 500;
      font-size: 13px;
      color: #202124;
    }

    .template-option-desc {
      font-size: 11px;
      color: #5f6368;
    }

    /* Text Areas */
    .redactor-textarea {
      width: 100%;
      min-height: 100px;
      padding: 10px;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      resize: vertical;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .redactor-textarea:focus {
      outline: none;
      border-color: #1a73e8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
    }

    .redactor-textarea.preview {
      background: #f8f9fa;
      font-family: "Google Sans Mono", monospace;
      font-size: 12px;
      min-height: 150px;
    }

    /* Labels */
    .field-label {
      font-size: 12px;
      font-weight: 500;
      color: #5f6368;
      margin-bottom: 6px;
      display: block;
    }

    /* Buttons */
    .redactor-btn {
      padding: 10px 16px;
      border-radius: 8px;
      border: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .redactor-btn.primary {
      background: #1a73e8;
      color: white;
      width: 100%;
    }

    .redactor-btn.primary:hover {
      background: #1557b0;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(26, 115, 232, 0.3);
    }

    .redactor-btn.secondary {
      background: #f8f9fa;
      color: #1a73e8;
      border: 1px solid #e8eaed;
    }

    .redactor-btn.secondary:hover {
      background: #e8f0fe;
      border-color: #1a73e8;
    }

    .redactor-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }

    .button-group {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .button-group .redactor-btn {
      flex: 1;
    }

    /* Status Messages */
    .status-message {
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 12px;
      margin-top: 12px;
      display: none;
      align-items: center;
      gap: 8px;
    }

    .status-message.visible {
      display: flex;
    }

    .status-message.success {
      background: #e6f4ea;
      color: #137333;
    }

    .status-message.error {
      background: #fce8e6;
      color: #c5221f;
    }

    .status-message.info {
      background: #e8f0fe;
      color: #1967d2;
    }

    /* Pattern Toggle Section */
    .patterns-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }

    .pattern-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      padding: 6px 8px;
      background: #f8f9fa;
      border-radius: 6px;
      cursor: pointer;
    }

    .pattern-toggle:hover {
      background: #e8f0fe;
    }

    .pattern-toggle input {
      width: 14px;
      height: 14px;
    }

    /* Mapping Display */
    .mapping-container {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 10px;
      margin-top: 12px;
      max-height: 150px;
      overflow-y: auto;
    }

    .mapping-item {
      display: flex;
      font-size: 11px;
      font-family: monospace;
      padding: 4px 0;
      border-bottom: 1px solid #e8eaed;
    }

    .mapping-item:last-child {
      border-bottom: none;
    }

    .mapping-original {
      color: #c5221f;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .mapping-arrow {
      color: #5f6368;
      margin: 0 8px;
    }

    .mapping-token {
      color: #1a73e8;
      font-weight: 500;
    }

    /* History List */
    .history-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .history-item {
      padding: 10px;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .history-item:hover {
      border-color: #1a73e8;
      background: #f8f9fa;
    }

    .history-item-name {
      font-weight: 500;
      font-size: 13px;
      color: #202124;
    }

    .history-item-meta {
      font-size: 11px;
      color: #5f6368;
      margin-top: 2px;
    }

    /* Section Titles */
    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #5f6368;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 12px 0 8px 0;
    }

    /* Scrollbar */
    .panel-body::-webkit-scrollbar,
    .history-list::-webkit-scrollbar,
    .mapping-container::-webkit-scrollbar {
      width: 6px;
    }

    .panel-body::-webkit-scrollbar-track,
    .history-list::-webkit-scrollbar-track,
    .mapping-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .panel-body::-webkit-scrollbar-thumb,
    .history-list::-webkit-scrollbar-thumb,
    .mapping-container::-webkit-scrollbar-thumb {
      background: #dadce0;
      border-radius: 3px;
    }

    .panel-body::-webkit-scrollbar-thumb:hover,
    .history-list::-webkit-scrollbar-thumb:hover,
    .mapping-container::-webkit-scrollbar-thumb:hover {
      background: #bdc1c6;
    }
  `);

  // ============================================
  // UI COMPONENTS
  // ============================================

  let panel = null;
  let isCollapsed = GM_getValue('panelCollapsed', false);
  let selectedTemplate = 'troubleshoot';
  let currentCustomerData = null;
  let lastRedactionResult = null;

  function createElement(tag, className = '', content = '') {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.textContent = content;
    return el;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function showStatus(message, type = 'info') {
    const statusEl = panel.querySelector('.status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message visible ${type}`;

    if (type !== 'error') {
      setTimeout(() => {
        statusEl.classList.remove('visible');
      }, 3000);
    }
  }

  function updateCustomerCard() {
    currentCustomerData = CustomerBridge.get();
    const card = panel.querySelector('.customer-card');
    const badge = panel.querySelector('.redactor-badge');
    const fieldsContainer = card.querySelector('.customer-fields');

    if (currentCustomerData && (currentCustomerData.customer?.name || currentCustomerData.customer?.email)) {
      card.classList.remove('no-data');
      badge.classList.add('has-data');
      badge.textContent = 'Customer Loaded';

      // Add customer as custom entity for redaction
      redactionEngine.clearCustomEntities();
      if (currentCustomerData.customer?.name) {
        redactionEngine.addCustomEntity(currentCustomerData.customer.name, 'CUSTOMER');
      }
      if (currentCustomerData.customer?.company) {
        redactionEngine.addCustomEntity(currentCustomerData.customer.company, 'COMPANY');
      }

      // Redact customer data for display
      const redacted = {
        name: currentCustomerData.customer.name ? redactionEngine.redact(currentCustomerData.customer.name).redactedText : '',
        email: currentCustomerData.customer.email ? redactionEngine.redact(currentCustomerData.customer.email).redactedText : '',
        phone: currentCustomerData.customer.phone ? redactionEngine.redact(currentCustomerData.customer.phone).redactedText : '',
        company: currentCustomerData.customer.company ? redactionEngine.redact(currentCustomerData.customer.company).redactedText : '',
        case: currentCustomerData.caseNumber || '',
      };

      fieldsContainer.innerHTML = `
        ${redacted.name ? `<div class="customer-field"><span class="customer-field-label">Name:</span><span class="customer-field-value redacted">${escapeHtml(redacted.name)}</span></div>` : ''}
        ${redacted.email ? `<div class="customer-field"><span class="customer-field-label">Email:</span><span class="customer-field-value redacted">${escapeHtml(redacted.email)}</span></div>` : ''}
        ${redacted.phone ? `<div class="customer-field"><span class="customer-field-label">Phone:</span><span class="customer-field-value redacted">${escapeHtml(redacted.phone)}</span></div>` : ''}
        ${redacted.company ? `<div class="customer-field"><span class="customer-field-label">Company:</span><span class="customer-field-value redacted">${escapeHtml(redacted.company)}</span></div>` : ''}
        ${redacted.case ? `<div class="customer-field"><span class="customer-field-label">Case:</span><span class="customer-field-value">${escapeHtml(redacted.case)}</span></div>` : ''}
        <div class="customer-field"><span class="customer-field-label">Source:</span><span class="customer-field-value">${escapeHtml(currentCustomerData.source || 'Unknown')}</span></div>
      `;

      card.querySelector('.customer-card-title').innerHTML = '👤 Customer Context <span style="color:#34a853">●</span>';
    } else {
      card.classList.add('no-data');
      badge.classList.remove('has-data');
      badge.textContent = 'No Data';
      fieldsContainer.innerHTML = '<div style="color:#5f6368;font-size:12px;text-align:center;padding:8px;">No customer data loaded. Capture from your CRM.</div>';
      card.querySelector('.customer-card-title').innerHTML = '👤 Customer Context';
    }
  }

  function updatePreview() {
    const previewArea = panel.querySelector('.preview-textarea');
    const additionalContext = panel.querySelector('.additional-context')?.value || '';

    if (!currentCustomerData) {
      previewArea.value = 'Load customer data from your CRM first.';
      return;
    }

    // Generate template with customer data
    let prompt = TemplateEngine.processTemplate(selectedTemplate, currentCustomerData, additionalContext);

    // Redact the entire prompt
    redactionEngine.clearCustomEntities();
    if (currentCustomerData.customer?.name) {
      redactionEngine.addCustomEntity(currentCustomerData.customer.name, 'CUSTOMER');
    }
    if (currentCustomerData.customer?.company) {
      redactionEngine.addCustomEntity(currentCustomerData.customer.company, 'COMPANY');
    }

    lastRedactionResult = redactionEngine.redact(prompt);
    previewArea.value = lastRedactionResult.redactedText;

    // Update mapping display
    updateMappingDisplay();
  }

  function updateMappingDisplay() {
    const container = panel.querySelector('.mapping-container');
    if (!lastRedactionResult || !lastRedactionResult.hasRedactions) {
      container.innerHTML = '<div style="color:#5f6368;font-size:11px;text-align:center;">No redactions applied</div>';
      return;
    }

    const items = Object.entries(lastRedactionResult.mapping)
      .map(([original, token]) => `
        <div class="mapping-item">
          <span class="mapping-original" title="${escapeHtml(original)}">${escapeHtml(original.substring(0, 25))}${original.length > 25 ? '...' : ''}</span>
          <span class="mapping-arrow">→</span>
          <span class="mapping-token">${escapeHtml(token)}</span>
        </div>
      `).join('');

    container.innerHTML = items;
  }

  function getGeminiInputField() {
    // Try multiple selectors for Gemini's input
    const selectors = [
      'div[contenteditable="true"][role="textbox"]',
      'div.ql-editor[contenteditable="true"]',
      'div[contenteditable="true"].ProseMirror',
      'textarea[aria-label*="prompt"]',
      'div[contenteditable="true"]',
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  function insertIntoGemini(text) {
    const input = getGeminiInputField();
    if (!input) {
      showStatus('Could not find Gemini input field', 'error');
      return false;
    }

    if (input.tagName === 'TEXTAREA') {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      // contenteditable
      input.focus();
      input.innerHTML = '';
      // Use insertText for better compatibility
      document.execCommand('insertText', false, text);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    showStatus('Prompt inserted into Gemini!', 'success');
    return true;
  }

  function createPanel() {
    panel = createElement('div', 'gemini-redactor-panel');
    if (isCollapsed) panel.classList.add('collapsed');

    // Header
    const header = createElement('div', 'redactor-header');
    header.innerHTML = `
      <div class="redactor-title">
        <span class="redactor-title-icon">🛡️</span>
        <span>Gemini Redactor</span>
        <span class="redactor-badge">No Data</span>
      </div>
      <button class="redactor-toggle-btn">${isCollapsed ? '▲' : '▼'}</button>
    `;

    header.addEventListener('click', (e) => {
      if (e.target.closest('.redactor-toggle-btn')) return;
      togglePanel();
    });

    header.querySelector('.redactor-toggle-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    panel.appendChild(header);

    // Body
    const body = createElement('div', 'panel-body');

    // Customer Card
    const customerCard = createElement('div', 'customer-card no-data');
    customerCard.innerHTML = `
      <div class="customer-card-header">
        <div class="customer-card-title">👤 Customer Context</div>
        <button class="customer-refresh-btn" title="Refresh customer data">↻</button>
      </div>
      <div class="customer-fields">
        <div style="color:#5f6368;font-size:12px;text-align:center;padding:8px;">No customer data loaded. Capture from your CRM.</div>
      </div>
    `;

    customerCard.querySelector('.customer-refresh-btn').addEventListener('click', () => {
      updateCustomerCard();
      showStatus('Customer data refreshed', 'info');
    });

    body.appendChild(customerCard);

    // Tabs
    const tabs = createElement('div', 'redactor-tabs');
    tabs.innerHTML = `
      <button class="redactor-tab active" data-tab="templates">📋 Templates</button>
      <button class="redactor-tab" data-tab="manual">✏️ Manual</button>
      <button class="redactor-tab" data-tab="settings">⚙️ Settings</button>
    `;

    tabs.querySelectorAll('.redactor-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.querySelectorAll('.redactor-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        body.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        body.querySelector(`.tab-content[data-tab="${tab.dataset.tab}"]`).classList.add('active');
      });
    });

    body.appendChild(tabs);

    // Templates Tab
    const templatesTab = createElement('div', 'tab-content active');
    templatesTab.dataset.tab = 'templates';
    templatesTab.innerHTML = `
      <div class="section-title">Select Template</div>
      <div class="template-selector">
        ${TemplateEngine.templates.map(t => `
          <div class="template-option ${t.id === selectedTemplate ? 'selected' : ''}" data-template="${t.id}">
            <div>
              <div class="template-option-name">${t.name}</div>
              <div class="template-option-desc">${t.description}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <label class="field-label">Additional Context (optional)</label>
      <textarea class="redactor-textarea additional-context" placeholder="Add specific details, questions, or context for this request..."></textarea>

      <label class="field-label" style="margin-top:12px;">Preview (Redacted)</label>
      <textarea class="redactor-textarea preview preview-textarea" readonly></textarea>

      <div class="section-title">Redaction Mapping</div>
      <div class="mapping-container">
        <div style="color:#5f6368;font-size:11px;text-align:center;">No redactions applied</div>
      </div>

      <div class="button-group">
        <button class="redactor-btn secondary copy-btn">📋 Copy</button>
        <button class="redactor-btn primary insert-btn">▶ Insert</button>
      </div>

      <div class="status-message"></div>
    `;

    // Template selection
    templatesTab.querySelectorAll('.template-option').forEach(opt => {
      opt.addEventListener('click', () => {
        templatesTab.querySelectorAll('.template-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedTemplate = opt.dataset.template;
        updatePreview();
      });
    });

    // Additional context updates preview
    templatesTab.querySelector('.additional-context').addEventListener('input', () => {
      updatePreview();
    });

    // Copy button
    templatesTab.querySelector('.copy-btn').addEventListener('click', () => {
      const preview = templatesTab.querySelector('.preview-textarea');
      navigator.clipboard.writeText(preview.value);
      showStatus('Copied to clipboard!', 'success');
    });

    // Insert button
    templatesTab.querySelector('.insert-btn').addEventListener('click', () => {
      const preview = templatesTab.querySelector('.preview-textarea');
      insertIntoGemini(preview.value);
    });

    body.appendChild(templatesTab);

    // Manual Tab
    const manualTab = createElement('div', 'tab-content');
    manualTab.dataset.tab = 'manual';
    manualTab.innerHTML = `
      <label class="field-label">Enter text to redact</label>
      <textarea class="redactor-textarea manual-input" placeholder="Paste any text here to redact PII before sending to Gemini..."></textarea>

      <label class="field-label" style="margin-top:12px;">Redacted Output</label>
      <textarea class="redactor-textarea preview manual-output" readonly></textarea>

      <div class="button-group">
        <button class="redactor-btn secondary manual-copy-btn">📋 Copy</button>
        <button class="redactor-btn primary manual-insert-btn">▶ Insert</button>
      </div>
    `;

    manualTab.querySelector('.manual-input').addEventListener('input', (e) => {
      const result = redactionEngine.redact(e.target.value);
      manualTab.querySelector('.manual-output').value = result.redactedText;
    });

    manualTab.querySelector('.manual-copy-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(manualTab.querySelector('.manual-output').value);
      showStatus('Copied to clipboard!', 'success');
    });

    manualTab.querySelector('.manual-insert-btn').addEventListener('click', () => {
      insertIntoGemini(manualTab.querySelector('.manual-output').value);
    });

    body.appendChild(manualTab);

    // Settings Tab
    const settingsTab = createElement('div', 'tab-content');
    settingsTab.dataset.tab = 'settings';
    settingsTab.innerHTML = `
      <div class="section-title">Enabled Patterns</div>
      <div class="patterns-grid">
        ${Object.entries(PATTERNS).map(([key, pattern]) => `
          <label class="pattern-toggle">
            <input type="checkbox" data-pattern="${key}" checked>
            <span>${pattern.description}</span>
          </label>
        `).join('')}
      </div>

      <div class="section-title" style="margin-top:16px;">Customer History</div>
      <div class="history-list">
        ${CustomerBridge.getHistory().length === 0 ?
          '<div style="color:#5f6368;font-size:12px;text-align:center;padding:12px;">No history yet</div>' :
          CustomerBridge.getHistory().map(h => `
            <div class="history-item" data-id="${h.id}">
              <div class="history-item-name">${escapeHtml(h.customer?.name || 'Unknown')}</div>
              <div class="history-item-meta">${escapeHtml(h.customer?.company || '')} • ${new Date(h.capturedAt).toLocaleDateString()}</div>
            </div>
          `).join('')
        }
      </div>

      <div class="button-group">
        <button class="redactor-btn secondary clear-history-btn">🗑️ Clear History</button>
      </div>
    `;

    // Pattern toggles
    settingsTab.querySelectorAll('[data-pattern]').forEach(toggle => {
      toggle.addEventListener('change', () => {
        const enabled = Array.from(settingsTab.querySelectorAll('[data-pattern]:checked')).map(el => el.dataset.pattern);
        redactionEngine.setEnabledPatterns(enabled);
        updatePreview();
      });
    });

    // History item click
    settingsTab.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const history = CustomerBridge.getHistory();
        const selected = history.find(h => h.id === item.dataset.id);
        if (selected) {
          GM_setValue(CustomerBridge.STORAGE_KEY, selected);
          updateCustomerCard();
          updatePreview();
          showStatus('Customer loaded from history', 'success');

          // Switch to templates tab
          tabs.querySelector('[data-tab="templates"]').click();
        }
      });
    });

    // Clear history
    settingsTab.querySelector('.clear-history-btn').addEventListener('click', () => {
      if (confirm('Clear all customer history?')) {
        GM_setValue(CustomerBridge.HISTORY_KEY, []);
        CustomerBridge.clear();
        updateCustomerCard();
        settingsTab.querySelector('.history-list').innerHTML = '<div style="color:#5f6368;font-size:12px;text-align:center;padding:12px;">No history yet</div>';
        showStatus('History cleared', 'info');
      }
    });

    body.appendChild(settingsTab);

    panel.appendChild(body);
    document.body.appendChild(panel);

    // Initial data load
    TemplateEngine.loadCustomTemplates();
    updateCustomerCard();
    updatePreview();

    // Listen for bridge updates
    if (typeof GM_addValueChangeListener !== 'undefined') {
      GM_addValueChangeListener(CustomerBridge.STORAGE_KEY, (key, oldVal, newVal, remote) => {
        if (remote) {
          updateCustomerCard();
          updatePreview();
          showStatus('Customer data updated!', 'info');
        }
      });
    }
  }

  function togglePanel() {
    isCollapsed = !isCollapsed;
    panel.classList.toggle('collapsed');
    panel.querySelector('.redactor-toggle-btn').textContent = isCollapsed ? '▲' : '▼';
    GM_setValue('panelCollapsed', isCollapsed);
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function initialize() {
    console.log('[Gemini Redactor] Initializing...');
    createPanel();
    console.log('[Gemini Redactor] Ready! Customer data:', CustomerBridge.hasData() ? 'Available' : 'None');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();
