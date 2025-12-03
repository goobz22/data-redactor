# Gem Template Customization Guide

This guide explains how to customize the Gem templates for your support organization.

## Overview

Gem templates are pre-built prompts that combine:
- **Customer context** (name, email, company, case details)
- **Automatic PII redaction** (all sensitive data is tokenized)
- **Structured prompts** optimized for specific support tasks

## Built-in Templates

| Template | Use Case |
|----------|----------|
| 🔧 Troubleshooting | Step-by-step issue diagnosis |
| 🚨 Escalation Summary | Generate escalation documentation |
| ✉️ Customer Response | Draft professional customer emails |
| 📚 KB Article | Create knowledge base articles |
| 🔍 Issue Analysis | Deep dive root cause analysis |
| ✏️ Custom Prompt | Build your own with customer context |

## Template Structure

Each template is a JavaScript object with this structure:

```javascript
{
  id: 'unique_id',           // Unique identifier (no spaces, lowercase)
  name: '🔧 Template Name',   // Display name (emoji optional)
  description: 'Short description shown in UI',
  prompt: `Your prompt template with {placeholders}...`
}
```

## Available Placeholders

Use these placeholders in your prompt templates. They'll be replaced with customer data (and automatically redacted):

| Placeholder | Description | Redacted As |
|-------------|-------------|-------------|
| `{customer_name}` | Customer's full name | `[CUSTOMER_1]` |
| `{customer_email}` | Customer's email | `[EMAIL_1]` |
| `{customer_phone}` | Customer's phone number | `[PHONE_1]` |
| `{customer_company}` | Company/organization name | `[COMPANY_1]` |
| `{customer_account}` | Account ID/number | (kept as-is) |
| `{case_number}` | Support case/ticket number | (kept as-is) |
| `{case_subject}` | Case subject line | (scanned for PII) |
| `{case_description}` | Full case description | (scanned for PII) |
| `{case_priority}` | Priority level | (kept as-is) |
| `{case_product}` | Product name | (kept as-is) |
| `{additional_context}` | User's custom input | (scanned for PII) |

## Adding Custom Templates

### Method 1: Edit the Script Directly

Find the `DEFAULT_TEMPLATES` array in the script and add your template:

```javascript
const DEFAULT_TEMPLATES = [
  // ... existing templates ...

  // Add your custom template
  {
    id: 'my_custom_template',
    name: '🎯 My Custom Template',
    description: 'Description for my team',
    prompt: `Your custom prompt here...

**Customer:** {customer_name}
**Company:** {customer_company}

{additional_context}
`
  },
];
```

### Method 2: Use the Template API (Runtime)

You can add templates dynamically using the TemplateEngine API:

```javascript
// In browser console or another script
TemplateEngine.saveCustomTemplate({
  id: 'runtime_template',
  name: '⚡ Runtime Template',
  description: 'Added at runtime',
  prompt: 'Your prompt...'
});
```

Custom templates are saved in Tampermonkey storage and persist across sessions.

## Example Templates for Support Organizations

### Technical Support - Product Configuration

```javascript
{
  id: 'product_config',
  name: '⚙️ Product Configuration',
  description: 'Help with product setup and configuration',
  prompt: `I'm helping a customer configure our product.

**Customer Details:**
- Customer: {customer_name}
- Company: {customer_company}
- Account: {customer_account}
- Product: {case_product}

**Configuration Request:**
{case_subject}

**Details:**
{case_description}

**Additional Notes:**
{additional_context}

Please provide:
1. Step-by-step configuration instructions
2. Best practices for this setup
3. Common pitfalls to avoid
4. Verification steps to confirm success`
}
```

### Billing/Account Support

```javascript
{
  id: 'billing_inquiry',
  name: '💳 Billing Inquiry',
  description: 'Handle billing and account questions',
  prompt: `I'm assisting with a billing/account inquiry.

**Account Information:**
- Customer: {customer_name}
- Company: {customer_company}
- Account ID: {customer_account}

**Inquiry:**
{case_subject}

**Details:**
{case_description}

Please help me:
1. Understand the billing/account issue
2. Identify the correct resolution
3. Draft appropriate customer communication
4. Note any follow-up actions needed`
}
```

### RMA/Return Process

```javascript
{
  id: 'rma_process',
  name: '📦 RMA Request',
  description: 'Process return/replacement requests',
  prompt: `Process an RMA/return request.

**Customer:** {customer_name}
**Company:** {customer_company}
**Account:** {customer_account}
**Case:** {case_number}

**Return Request:**
{case_description}

Please help determine:
1. Is this eligible for return/replacement?
2. What information do we need from the customer?
3. What are the next steps in the RMA process?
4. Draft confirmation message for customer`
}
```

### Security Incident Response

```javascript
{
  id: 'security_incident',
  name: '🔒 Security Incident',
  description: 'Handle security-related reports',
  prompt: `Handle a security-related support request.

**IMPORTANT: All customer data has been redacted for security.**

**Incident Report:**
- Customer: {customer_name}
- Company: {customer_company}
- Priority: {case_priority}
- Case: {case_number}

**Incident Description:**
{case_description}

**Additional Context:**
{additional_context}

Please provide:
1. Initial assessment of the security concern
2. Immediate recommended actions
3. Information to gather from the customer
4. Escalation criteria (if applicable)
5. Documentation requirements`
}
```

### Onboarding Assistance

```javascript
{
  id: 'onboarding',
  name: '🚀 New Customer Onboarding',
  description: 'Help onboard new customers',
  prompt: `Assist with new customer onboarding.

**New Customer:**
- Name: {customer_name}
- Company: {customer_company}
- Account: {customer_account}
- Product: {case_product}

**Onboarding Request:**
{case_description}

**Specific Questions:**
{additional_context}

Please provide:
1. Recommended onboarding checklist
2. Key resources and documentation to share
3. Common first-week questions and answers
4. Success metrics to track
5. 30/60/90 day milestones`
}
```

## Template Best Practices

### 1. Be Specific About Output Format

```javascript
// ❌ Vague
prompt: `Help me with this issue: {case_description}`

// ✅ Specific
prompt: `Analyze this issue and provide:
1. Root cause (2-3 sentences)
2. Immediate fix
3. Long-term prevention
4. Customer communication draft

Issue: {case_description}`
```

### 2. Include Context Boundaries

```javascript
// ✅ Clear what's redacted
prompt: `**Note: Customer PII has been replaced with tokens for privacy.**

Customer [CUSTOMER_1] from [COMPANY_1] reports...`
```

### 3. Match Your Team's Voice

```javascript
// Formal support org
prompt: `Please draft a professional response...`

// Casual/startup style
prompt: `Let's figure out how to help this customer...`
```

### 4. Include Guardrails

```javascript
prompt: `...

**Important:**
- Do not promise specific resolution times
- Escalate if the issue involves data loss
- Always verify account status before discussing billing`
```

## Sharing Templates Across Your Team

### Option 1: Shared Script File

Host a modified version of `gemini-redactor-unified.js` with your custom templates in a shared location. Team members install the same script.

### Option 2: Template Import/Export

```javascript
// Export templates
const myTemplates = GM_getValue('custom_templates', []);
console.log(JSON.stringify(myTemplates, null, 2));

// Import templates (run in console)
const templates = [/* paste exported templates */];
GM_setValue('custom_templates', templates);
```

### Option 3: Central Configuration Server

For enterprise deployments, you can modify the script to fetch templates from a central server:

```javascript
async function loadRemoteTemplates() {
  const response = await fetch('https://your-company.com/api/templates');
  const templates = await response.json();
  return [...DEFAULT_TEMPLATES, ...templates];
}
```

## Troubleshooting

### Template Not Showing

- Check the `id` is unique
- Ensure no JavaScript syntax errors in the template object
- Refresh the page after adding templates

### Placeholders Not Replacing

- Verify placeholder spelling matches exactly (case-sensitive)
- Check that customer data has the corresponding field
- Ensure the field isn't empty in your CRM capture

### Redaction Not Working

- Confirm the pattern is enabled in Settings tab
- Check the value matches the expected pattern format
- Customer names/companies require `CustomerBridge.save()` to include them

## Need Help?

- Check the [Browser Bridge documentation](./browser-bridge.md) for CRM integration
- See the main [Data Redactor README](../README.md) for pattern details
- Open an issue at https://github.com/goobz22/data-redactor/issues
