# Browser Bridge Specification

The Browser Bridge enables seamless data transfer between your CRM extractor script and the Gemini Redactor UI using Tampermonkey's shared storage.

## Architecture Overview

```
┌─────────────────────────┐                    ┌─────────────────────────┐
│    CRM EXTRACTOR        │                    │    GEMINI REDACTOR      │
│    (your-crm.com)       │                    │    (gemini.google.com)  │
│                         │                    │                         │
│  CustomerBridge.save()  │───▶ GM_setValue ───│  CustomerBridge.get()   │
│                         │                    │                         │
│  • Extract customer     │    ┌──────────┐    │  • Load customer data   │
│  • One-click capture    │    │ Shared   │    │  • Auto-redact PII      │
│  • Visual confirmation  │    │ Storage  │    │  • Insert into prompt   │
│                         │    └──────────┘    │  • Gem templates        │
└─────────────────────────┘                    └─────────────────────────┘
```

## Bridge API

### Data Structure

```javascript
// Customer data schema stored in bridge
const CustomerData = {
  // Metadata
  id: "uuid-v4",                    // Unique identifier for this capture
  capturedAt: "2024-01-15T10:30:00Z", // ISO timestamp
  source: "salesforce",              // CRM identifier
  caseNumber: "00123456",            // Optional: support case number

  // Customer PII (will be redacted)
  customer: {
    name: "John Smith",
    email: "john.smith@acme.com",
    phone: "+1-555-123-4567",
    company: "Acme Corporation",
    accountId: "ACC-789012",
  },

  // Case/Ticket context (optional)
  context: {
    subject: "Cannot login to dashboard",
    description: "Customer reports 403 error when...",
    priority: "high",
    product: "Enterprise Dashboard",
    environment: "Production",
  },

  // Custom fields (flexible)
  custom: {
    // Add any CRM-specific fields here
    salesforceId: "003xxx",
    tier: "Enterprise",
  }
};
```

### Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `bridge_customer_current` | Object | Most recent customer capture |
| `bridge_customer_history` | Array | Last 20 captures (for quick access) |
| `bridge_preferences` | Object | User preferences for the bridge |
| `bridge_templates` | Array | Custom Gem templates |

---

## Integration Guide for CRM Extractor

### Step 1: Add Required Grants

Add these to your CRM extractor's userscript header:

```javascript
// ==UserScript==
// @name         Your CRM Extractor
// @namespace    https://github.com/goobz22/data-redactor  // MUST MATCH!
// @match        https://your-crm.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener  // Optional: for real-time sync
// ==/UserScript==
```

> **IMPORTANT**: The `@namespace` must be identical in both scripts for shared storage to work!

### Step 2: Add the Bridge Module

Copy this bridge module into your CRM extractor:

```javascript
// ============================================
// BROWSER BRIDGE MODULE
// Copy this into your CRM extractor script
// ============================================

const CustomerBridge = {
  STORAGE_KEY: 'bridge_customer_current',
  HISTORY_KEY: 'bridge_customer_history',
  MAX_HISTORY: 20,

  /**
   * Save customer data to the bridge
   * Call this when user clicks "Capture Customer" in your CRM
   *
   * @param {Object} customerData - The customer data object
   * @returns {string} - The generated capture ID
   */
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

    // Save as current
    GM_setValue(this.STORAGE_KEY, capture);

    // Add to history
    this._addToHistory(capture);

    console.log('[CustomerBridge] Saved customer:', capture.id);
    return capture.id;
  },

  /**
   * Get the current customer data from bridge
   * @returns {Object|null} - Customer data or null if none
   */
  get() {
    return GM_getValue(this.STORAGE_KEY, null);
  },

  /**
   * Get capture history
   * @returns {Array} - Array of recent captures
   */
  getHistory() {
    return GM_getValue(this.HISTORY_KEY, []);
  },

  /**
   * Clear the current customer (after use)
   */
  clear() {
    GM_setValue(this.STORAGE_KEY, null);
  },

  /**
   * Check if there's customer data available
   * @returns {boolean}
   */
  hasData() {
    const data = this.get();
    return data !== null && data.customer?.name;
  },

  // Private helpers
  _generateId() {
    return 'cap_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  _addToHistory(capture) {
    let history = this.getHistory();
    // Remove duplicate if exists
    history = history.filter(h => h.id !== capture.id);
    // Add to front
    history.unshift(capture);
    // Trim to max
    history = history.slice(0, this.MAX_HISTORY);
    GM_setValue(this.HISTORY_KEY, history);
  }
};
```

### Step 3: Call Bridge from Your Extractor

In your CRM extractor, when the user clicks capture:

```javascript
// Example: Salesforce
function captureCurrentCustomer() {
  // Extract data from your CRM's DOM
  const data = {
    source: 'salesforce',
    caseNumber: document.querySelector('.case-number')?.textContent,
    name: document.querySelector('.contact-name')?.textContent,
    email: document.querySelector('.contact-email')?.textContent,
    phone: document.querySelector('.contact-phone')?.textContent,
    company: document.querySelector('.account-name')?.textContent,
    accountId: document.querySelector('.account-id')?.textContent,
    context: {
      subject: document.querySelector('.case-subject')?.textContent,
      description: document.querySelector('.case-description')?.textContent,
      priority: document.querySelector('.case-priority')?.textContent,
      product: document.querySelector('.case-product')?.textContent,
    }
  };

  // Save to bridge
  const captureId = CustomerBridge.save(data);

  // Show confirmation to user
  showNotification(`✅ Customer captured! ID: ${captureId}`);
}

// Attach to your capture button
document.querySelector('#your-capture-button').addEventListener('click', captureCurrentCustomer);
```

### Step 4: Visual Indicator (Optional)

Add a badge to show when data is ready for Gemini:

```javascript
function updateBridgeIndicator() {
  const indicator = document.querySelector('.bridge-indicator');
  if (CustomerBridge.hasData()) {
    indicator.textContent = '🟢 Ready for Gemini';
    indicator.style.background = '#e6f4ea';
  } else {
    indicator.textContent = '⚪ No customer loaded';
    indicator.style.background = '#f1f3f4';
  }
}
```

---

## Example: Complete CRM Integration

Here's a minimal complete example for a generic CRM:

```javascript
// ==UserScript==
// @name         CRM Customer Extractor
// @namespace    https://github.com/goobz22/data-redactor
// @version      1.0.0
// @description  Extract customer data and send to Gemini Redactor
// @match        https://your-crm.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
  'use strict';

  // [Paste CustomerBridge module here]

  // Add capture button styles
  GM_addStyle(`
    .crm-capture-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      z-index: 9999;
      background: linear-gradient(135deg, #1a73e8, #4285f4);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .crm-capture-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(26, 115, 232, 0.5);
    }
    .crm-capture-btn.success {
      background: linear-gradient(135deg, #137333, #34a853);
    }
  `);

  // Create capture button
  const btn = document.createElement('button');
  btn.className = 'crm-capture-btn';
  btn.innerHTML = '📤 Capture for Gemini';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    // CUSTOMIZE THESE SELECTORS FOR YOUR CRM
    const data = {
      source: 'your-crm',
      name: document.querySelector('[data-field="contact_name"]')?.textContent?.trim(),
      email: document.querySelector('[data-field="contact_email"]')?.textContent?.trim(),
      phone: document.querySelector('[data-field="contact_phone"]')?.textContent?.trim(),
      company: document.querySelector('[data-field="account_name"]')?.textContent?.trim(),
      caseNumber: document.querySelector('[data-field="case_number"]')?.textContent?.trim(),
      context: {
        subject: document.querySelector('[data-field="case_subject"]')?.textContent?.trim(),
        description: document.querySelector('[data-field="case_description"]')?.textContent?.trim(),
      }
    };

    if (!data.name && !data.email) {
      alert('❌ Could not find customer data on this page');
      return;
    }

    CustomerBridge.save(data);

    btn.innerHTML = '✅ Captured!';
    btn.classList.add('success');

    setTimeout(() => {
      btn.innerHTML = '📤 Capture for Gemini';
      btn.classList.remove('success');
    }, 2000);
  });

})();
```

---

## Troubleshooting

### Data not appearing in Gemini?

1. **Check @namespace matches** - Both scripts must have identical `@namespace` values
2. **Check grants** - Both scripts need `GM_setValue` and `GM_getValue`
3. **Open console** - Look for `[CustomerBridge]` logs
4. **Check Tampermonkey storage** - Dashboard → Script → Storage tab

### Testing the bridge

Run in browser console on CRM page:
```javascript
// Check if data was saved
console.log(GM_getValue('bridge_customer_current'));
```

Run in browser console on Gemini page:
```javascript
// Check if data is available
console.log(GM_getValue('bridge_customer_current'));
```

---

## Next Steps

Once your CRM extractor is saving to the bridge, the Gemini Redactor UI will automatically:

1. Detect when customer data is available
2. Show a "Customer Loaded" indicator
3. Auto-populate the redacted customer context
4. Let you select a Gem template
5. Insert the redacted prompt with one click

See: [gemini-redactor-ui.md](./gemini-redactor-ui.md) for the Gemini side setup.
