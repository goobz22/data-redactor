# Data Redactor Chrome Extension

A Chrome extension for automatically redacting sensitive data before submitting to AI chat interfaces like Gemini, ChatGPT, and Claude.

## Features

- **Automatic PII Detection**: Email, phone, SSN, credit cards, IP addresses, MAC addresses, AWS keys, API keys
- **CRM Bridge**: Capture customer data from your CRM and use it in Gemini with automatic redaction
- **Gem Templates**: Pre-built templates for troubleshooting, escalation, customer response, KB articles, and more
- **Manual Redaction**: Paste any text and get redacted output
- **Keyboard Shortcuts**: `Ctrl+Shift+R` to redact, `Ctrl+Shift+D` to toggle panel

## Installation

### Development Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder

### Icons

The extension uses dynamically generated icons. If you want static icons:

1. Create PNG files at these sizes: 16x16, 32x32, 48x48, 128x128
2. Save them in the `icons/` folder as `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`

Or the extension will generate them automatically using the canvas API.

## File Structure

```
chrome-extension/
├── manifest.json      # Extension configuration
├── background.js      # Service worker (icon generation, CRM bridge)
├── content.js         # Content script (redaction engine, UI panel)
├── content.css        # Styles for the in-page panel
├── popup.html         # Extension popup UI
├── popup.js           # Popup logic
├── icons/             # Extension icons (optional if using dynamic)
└── README.md          # This file
```

## Usage

### Basic Redaction

1. Navigate to a supported AI chat (Gemini, ChatGPT, Claude, etc.)
2. Type or paste text containing sensitive data
3. Click the "Redactor" button or press `Ctrl+Shift+R`
4. The text is automatically redacted with tokens like `[EMAIL_1]`, `[PHONE_1]`

### CRM Bridge (Advanced)

1. Install the CRM extractor userscript for your CRM
2. Capture customer data from a case/ticket page
3. Open Gemini - the extension shows "Customer Loaded"
4. Select a Gem template
5. Click "Insert" - redacted prompt is inserted into Gemini

### Gem Templates

| Template | Use Case |
|----------|----------|
| 🔧 Troubleshooting | Step-by-step diagnosis |
| 🚨 Escalation Summary | Generate escalation docs |
| ✉️ Customer Response | Draft professional emails |
| 📚 KB Article | Create knowledge base articles |
| 🔍 Issue Analysis | Deep dive root cause |
| ✏️ Custom Prompt | Build your own with context |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+R` | Redact current input field |
| `Ctrl+Shift+D` | Toggle redactor panel |
| `Shift+Click` indicator | Toggle enabled/disabled |

## Supported Sites

- https://gemini.google.com/*
- https://chat.openai.com/*
- https://chatgpt.com/*
- https://claude.ai/*
- https://copilot.microsoft.com/*
- https://poe.com/*
- https://bard.google.com/*

## Privacy

- **100% Client-Side**: All redaction happens in your browser
- **No Data Sent**: Your data never leaves your machine
- **No Tracking**: Zero analytics or telemetry

## CRM Integration

See the [Browser Bridge documentation](../docs/browser-bridge.md) for details on integrating with your CRM's customer extraction script.

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Data Redactor card
4. Test your changes

## License

MIT License - See main repository for details.
