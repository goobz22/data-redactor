'use client';

import { useState, useEffect } from 'react';
import { DataRedactor, DEFAULT_CONFIG } from 'data-redactor-core';
import type { RedactorConfig } from 'data-redactor-core';

const containerStyle: React.CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '20px 10px',
  background: 'linear-gradient(135deg, #002868 0%, #BF0A30 100%)',
  minHeight: '100vh',
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '20px',
  background: 'linear-gradient(90deg, #BF0A30 0%, #FFFFFF 50%, #002868 100%)',
  padding: '20px 15px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  border: '3px solid #FFD700',
};

const titleStyle: React.CSSProperties = {
  fontSize: 'clamp(28px, 6vw, 48px)',
  fontWeight: '900',
  marginBottom: '12px',
  color: '#FFD700',
  textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
  letterSpacing: '1px',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: 'clamp(14px, 3vw, 20px)',
  color: '#FFFFFF',
  fontWeight: '700',
  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))',
  gap: '20px',
  marginBottom: '20px',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: 'clamp(16px, 4vw, 28px)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  border: '3px solid #FFD700',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'clamp(14px, 2.5vw, 16px)',
  fontWeight: '800',
  marginBottom: '10px',
  color: '#002868',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '150px',
  padding: '12px',
  fontSize: 'clamp(12px, 2vw, 14px)',
  fontFamily: 'monospace',
  border: '3px solid #002868',
  borderRadius: '8px',
  resize: 'vertical',
  boxSizing: 'border-box',
  backgroundColor: '#F8F9FA',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#BF0A30',
  color: '#FFFFFF',
  border: '2px solid #FFD700',
  borderRadius: '8px',
  padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 28px)',
  fontSize: 'clamp(12px, 2.5vw, 16px)',
  fontWeight: '800',
  cursor: 'pointer',
  marginRight: '8px',
  marginBottom: '8px',
  transition: 'all 0.3s',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
};

const secondaryButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#002868',
  border: '2px solid #BF0A30',
};

const successButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#FFD700',
  color: '#002868',
  border: '2px solid #002868',
};

const warningStyle: React.CSSProperties = {
  backgroundColor: '#FFD700',
  border: '3px solid #BF0A30',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  fontSize: '15px',
  color: '#002868',
  fontWeight: '700',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};

const configSectionStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: 'clamp(16px, 4vw, 28px)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
  marginBottom: '20px',
  border: '3px solid #FFD700',
};

const checkboxGroupStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))',
  gap: '12px',
  marginTop: '16px',
};

const patternCardStyle: React.CSSProperties = {
  backgroundColor: '#F0F4F8',
  border: '2px solid #BF0A30',
  borderRadius: '8px',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '15px',
  color: '#002868',
};

const selectStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '14px',
  borderRadius: '6px',
  border: '2px solid #002868',
  backgroundColor: '#FFFFFF',
  cursor: 'pointer',
  outline: 'none',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
  fontWeight: '600',
  color: '#002868',
};

const mappingStyle: React.CSSProperties = {
  backgroundColor: '#F8F9FA',
  padding: '16px',
  borderRadius: '8px',
  fontFamily: 'monospace',
  fontSize: '14px',
  maxHeight: '200px',
  overflowY: 'auto',
  border: '3px solid #002868',
  color: '#002868',
  fontWeight: '600',
};

const tabStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: 'clamp(10px, 2vw, 14px) clamp(12px, 3vw, 28px)',
  cursor: 'pointer',
  marginRight: '4px',
  marginBottom: '4px',
  transition: 'all 0.3s',
  fontWeight: '700',
  fontSize: 'clamp(12px, 2.5vw, 16px)',
  color: '#002868',
  backgroundColor: '#F0F4F8',
  borderRadius: '8px 8px 0 0',
  borderTop: '2px solid #BF0A30',
  borderRight: '2px solid #BF0A30',
  borderBottom: 'none',
  borderLeft: '2px solid #BF0A30',
};

const activeTabStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: 'clamp(10px, 2vw, 14px) clamp(12px, 3vw, 28px)',
  cursor: 'pointer',
  marginRight: '4px',
  marginBottom: '4px',
  transition: 'all 0.3s',
  fontWeight: '900',
  fontSize: 'clamp(12px, 2.5vw, 16px)',
  color: '#BF0A30',
  backgroundColor: '#FFFFFF',
  borderRadius: '8px 8px 0 0',
  borderTop: '3px solid #FFD700',
  borderRight: '3px solid #FFD700',
  borderBottom: 'none',
  borderLeft: '3px solid #FFD700',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'simple' | 'json' | 'output'>('simple');
  const [inputText, setInputText] = useState('');
  const [redactedText, setRedactedText] = useState('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<RedactorConfig>({
    patterns: {
      ipv4: {
        enabled: true,
        strategy: 'token',
        regex: '(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?(?![0-9])',
      },
      ipv6: {
        enabled: true,
        strategy: 'token',
        regex: '(?:[0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}',
      },
      macAddress: {
        enabled: true,
        strategy: 'token',
        regex: '(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})',
      },
      email: {
        enabled: true,
        strategy: 'token',
        regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      },
      phone: {
        enabled: true,
        strategy: 'token',
        regex: '(?<![A-Za-z0-9])(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\(\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\)|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?[A-Za-z]{7}|\\d{3}[-\\.\\s]?[A-Za-z]{3}[-\\.\\s]?[A-Za-z]{4})(?![A-Za-z0-9])',
      },
      ssn: {
        enabled: true,
        strategy: 'token',
        regex: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
      },
      creditCard: {
        enabled: true,
        strategy: 'token',
        regex: '(?<!\\d)(?:\\d{4}[-\\s]?){3,4}\\d{1,4}(?!\\d)|(?<!\\d)\\d{13,19}(?!\\d)',
      },
      creditCardLast4: {
        enabled: true,
        strategy: 'token',
        regex: '(?:(?:card|payment|account)\\s+)?(?:ending\\s+in\\s+|ends\\s+in\\s+|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)',
        flags: 'i',
      },
      hostname: {
        enabled: true,
        strategy: 'token',
        regex: '\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b',
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
        // Built from name databases (8849 names) - no default regex
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
  });
  const [jsonConfig, setJsonConfig] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [isEditingJson, setIsEditingJson] = useState(false);
  const [testInputs, setTestInputs] = useState<Record<string, string>>({
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
  });
  // Per-pattern format customization
  const [patternFormats, setPatternFormats] = useState<Record<string, {
    tokenFormat: string;
    maskChar: string;
    preserveStructure: boolean;
  }>>({
    ipv4: { tokenFormat: '[I_P_V4_{INDEX}]', maskChar: '*', preserveStructure: true },
    ipv6: { tokenFormat: '[I_P_V6_{INDEX}]', maskChar: '*', preserveStructure: true },
    macAddress: { tokenFormat: '[M_A_C_{INDEX}]', maskChar: '*', preserveStructure: true },
    email: { tokenFormat: '[E_M_A_I_L_{INDEX}]', maskChar: '*', preserveStructure: true },
    phone: { tokenFormat: '[P_H_O_N_E_{INDEX}]', maskChar: '*', preserveStructure: true },
    ssn: { tokenFormat: '[S_S_N_{INDEX}]', maskChar: '*', preserveStructure: true },
    creditCard: { tokenFormat: '[C_A_R_D_{INDEX}]', maskChar: '*', preserveStructure: true },
    creditCardLast4: { tokenFormat: '[C_A_R_D_L_A_S_T_4_{INDEX}]', maskChar: '*', preserveStructure: true },
    hostname: { tokenFormat: '[H_O_S_T_{INDEX}]', maskChar: '*', preserveStructure: true },
    ticketNumber: { tokenFormat: '[T_I_C_K_E_T_{INDEX}]', maskChar: '*', preserveStructure: true },
    name: { tokenFormat: '[N_A_M_E_{INDEX}]', maskChar: '*', preserveStructure: true },
  });

  // Sync JSON config with config state (but not while actively editing JSON)
  useEffect(() => {
    if (!isEditingJson) {
      setJsonConfig(JSON.stringify(config, null, 2));
    }
  }, [config, isEditingJson]);

  const handleRedact = () => {
    try {
      console.log('[UI] Starting redaction with input:', inputText);
      console.log('[UI] Config:', config);
      const redactor = new DataRedactor(config);
      console.log('[UI] DataRedactor created');
      const result = redactor.redact(inputText);
      console.log('[UI] Redaction result:', result);
      setRedactedText(result.redactedText);
      setMapping(result.mapping);
    } catch (error) {
      console.error('Redaction error:', error);
      alert(`Error: ${error}`);
    }
  };

  const handleClear = () => {
    setInputText('');
    setRedactedText('');
    setMapping({});
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(redactedText);
    alert('Copied to clipboard!');
  };

  const handleCopyMapping = () => {
    const mappingText = Object.entries(mapping)
      .map(([original, redacted]) => `${original} → ${redacted}`)
      .join('\n');
    navigator.clipboard.writeText(mappingText);
    alert('Mapping copied to clipboard!');
  };

  const togglePattern = (pattern: string, enabled: boolean) => {
    const newConfig = {
      ...config,
      patterns: {
        ...config.patterns,
        [pattern]: {
          ...(config.patterns?.[pattern as keyof typeof config.patterns] as any),
          enabled,
        },
      },
    };
    setConfig(newConfig);
    setJsonConfig(JSON.stringify(newConfig, null, 2));
  };

  const setStrategy = (pattern: string, strategy: 'token' | 'mask' | 'formatPreserving') => {
    const newConfig = {
      ...config,
      patterns: {
        ...config.patterns,
        [pattern]: {
          ...(config.patterns?.[pattern as keyof typeof config.patterns] as any),
          strategy,
        },
      },
    };
    setConfig(newConfig);
    setJsonConfig(JSON.stringify(newConfig, null, 2));
  };

  const handleJsonChange = (value: string) => {
    setIsEditingJson(true);
    setJsonConfig(value);
    setJsonError('');
    try {
      const parsed = JSON.parse(value);
      setConfig(parsed);
      setJsonError(''); // Clear error on successful parse
      // Delay to allow the config to update before we stop "editing"
      setTimeout(() => setIsEditingJson(false), 100);
    } catch (error) {
      setJsonError('Invalid JSON - will not apply until fixed');
      setIsEditingJson(false);
    }
  };

  const handleImportJson = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const parsed = JSON.parse(content);
            setConfig(parsed);
            setJsonConfig(JSON.stringify(parsed, null, 2));
            setJsonError('');
            alert('Configuration imported successfully!');
          } catch (error) {
            alert('Invalid JSON file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExportEditedJson = () => {
    const blob = new Blob([jsonConfig], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redactor-config-edited.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportDefaultJson = () => {
    const blob = new Blob([JSON.stringify(DEFAULT_CONFIG, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'redactor-config-default.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetConfig = () => {
    const defaultConfig: RedactorConfig = {
      patterns: {
        ipv4: {
          enabled: true,
          strategy: 'token',
          regex: '(?<![0-9])(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:/\\d{1,2})?(?![0-9])',
        },
        ipv6: {
          enabled: true,
          strategy: 'token',
          regex: '(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4})|(?:(?:[0-9a-fA-F]{1,4}:){1,7}:)|(?:::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})|(?:(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})',
        },
        macAddress: {
          enabled: true,
          strategy: 'token',
          regex: '(?:(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2})|(?:(?:[0-9A-Fa-f]{4}\\.){2}[0-9A-Fa-f]{4})',
        },
        email: {
          enabled: true,
          strategy: 'token',
          regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
        },
        phone: {
          enabled: true,
          strategy: 'token',
          regex: '(?<![A-Za-z0-9])(?:\\+?1[-\\.\\s]?)?(?:\\(\\d{3}\\)\\s?\\d{3}[-\\.\\s]?\\d{4}|\\(\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}\\)|\\d{3}[-\\.\\s]?\\d{3}[-\\.\\s]?\\d{4}|\\d{3}[-\\.\\s]?[A-Za-z]{7}|\\d{3}[-\\.\\s]?[A-Za-z]{3}[-\\.\\s]?[A-Za-z]{4})(?![A-Za-z0-9])',
        },
        ssn: {
          enabled: true,
          strategy: 'token',
          regex: '\\b\\d{3}-\\d{2}-\\d{4}\\b',
        },
        creditCard: {
          enabled: true,
          strategy: 'token',
          regex: '(?<!\\d)(?:\\d{4}[-\\s]?){3,4}\\d{1,4}(?!\\d)|(?<!\\d)\\d{13,19}(?!\\d)',
        },
        creditCardLast4: {
          enabled: true,
          strategy: 'token',
          regex: '(?:(?:card|payment|account)\\s+)?(?:ending\\s+in|ends\\s+in|last\\s+(?:4|four)(?:\\s+digits)?[\\s:]+)\\d{4}(?!\\d)|(?:\\*{4,})\\d{4}(?!\\d)',
          flags: 'i',
        },
        hostname: {
          enabled: true,
          strategy: 'token',
          regex: '\\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\\.)+[a-zA-Z]{2,}\\b',
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
          // Built from name databases (8849 names) - no default regex
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
    };
    setConfig(defaultConfig);
    setJsonConfig(JSON.stringify(defaultConfig, null, 2));
  };

  const handleInsertTestData = () => {
    setInputText(config.testData || '');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Data Redactor</h1>
        <p style={subtitleStyle}>
          Redact sensitive information before sending to AI systems
        </p>
        <p style={{ fontSize: '16px', color: '#FFFFFF', marginTop: '12px', fontWeight: '600', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          All processing happens in your browser. No data is sent to any server.
        </p>
      </header>

      <div style={configSectionStyle}>
        <div style={{ marginBottom: '20px' }}>
          <span
            style={activeTab === 'simple' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('simple')}
          >
            Simple Config
          </span>
          <span
            style={activeTab === 'json' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('json')}
          >
            JSON Editor
          </span>
          <span
            style={activeTab === 'output' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('output')}
          >
            Output Format
          </span>
        </div>

        {activeTab === 'simple' ? (
          <>
            <h2 style={{ ...labelStyle, fontSize: '18px', marginBottom: '16px' }}>
              Built-in Pattern Detection
            </h2>
            <div style={checkboxGroupStyle}>
              {Object.entries(config.patterns || {}).map(([key, value]) => {
                if (key === 'custom') return null;
                const patternConfig = value as any;
                return (
                  <div key={key} style={patternCardStyle}>
                    <label style={checkboxLabelStyle}>
                      <input
                        type="checkbox"
                        checked={patternConfig.enabled}
                        onChange={(e) => togglePattern(key, e.target.checked)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <span>{key}</span>
                    </label>
                    <select
                      value={patternConfig.strategy}
                      onChange={(e) => setStrategy(key, e.target.value as any)}
                      style={selectStyle}
                      disabled={!patternConfig.enabled}
                    >
                      <option value="token">Token</option>
                      <option value="mask">Mask</option>
                      <option value="formatPreserving">Format-Preserving</option>
                    </select>
                  </div>
                );
              })}
            </div>

            {config.customEntities && Object.keys(config.customEntities).length > 0 && (
              <>
                <h3 style={{ ...labelStyle, fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>
                  Custom Entities
                </h3>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {Object.entries(config.customEntities).map(([key, values]) => (
                    <div key={key} style={{ marginBottom: '8px' }}>
                      <strong>{key}:</strong> {Array.isArray(values) ? values.join(', ') : 'N/A'}
                    </div>
                  ))}
                </div>
              </>
            )}

            {config.patterns?.custom && config.patterns.custom.length > 0 && (
              <>
                <h3 style={{ ...labelStyle, fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>
                  Custom Patterns
                </h3>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {config.patterns.custom.map((pattern, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <strong>{pattern.name}:</strong> /{pattern.regex}/ ({pattern.strategy})
                    </div>
                  ))}
                </div>
              </>
            )}

            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              💡 <strong>Tip:</strong> Switch to JSON Editor tab to add custom entities (company names, customer names)
              and custom patterns (regex-based detection).
            </div>
          </>
        ) : activeTab === 'json' ? (
          <>
            <div style={warningStyle}>
              ⚠️ <strong>Security Note:</strong> Custom configurations are stored in browser memory only.
              No files are saved to disk unless you explicitly export them.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <button style={buttonStyle} onClick={handleImportJson}>
                📁 Import JSON
              </button>
              <button style={secondaryButtonStyle} onClick={handleExportEditedJson}>
                💾 Export Edited JSON
              </button>
              <button style={secondaryButtonStyle} onClick={handleExportDefaultJson}>
                📄 Export Default JSON
              </button>
              <button style={secondaryButtonStyle} onClick={handleResetConfig}>
                🔄 Reset to Default
              </button>
            </div>

            <label style={labelStyle}>Configuration JSON</label>
            {jsonError && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginBottom: '8px' }}>
                {jsonError}
              </div>
            )}
            <textarea
              style={{ ...textareaStyle, minHeight: '400px', fontSize: '13px' }}
              value={jsonConfig}
              onChange={(e) => handleJsonChange(e.target.value)}
              placeholder="Edit your configuration as JSON..."
            />

            <div style={{ marginTop: '16px', fontSize: '13px', color: '#666' }}>
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: '600', marginBottom: '8px' }}>
                  📖 Configuration Guide
                </summary>
                <pre style={{ backgroundColor: '#f8f8f8', padding: '12px', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "customEntities": {
    "companyNames": ["Acme Corp", "Your Company"],
    "customerNames": ["John Doe", "Jane Smith"],
    "projectNames": ["Project Alpha"]
  },
  "patterns": {
    "ipAddress": {
      "enabled": true,
      "strategy": "token" | "mask" | "formatPreserving"
    },
    "custom": [
      {
        "name": "caseId",
        "regex": "CASE-\\\\d{6}",
        "strategy": "token"
      }
    ]
  }
}`}
                </pre>
              </details>
            </div>
          </>
        ) : (
          <>
            <h2 style={{ ...labelStyle, fontSize: '20px', marginBottom: '16px', color: '#BF0A30' }}>
              Interactive Pattern Testing & Format Customization
            </h2>
            <p style={{ fontSize: '15px', color: '#002868', marginBottom: '20px', fontWeight: '600' }}>
              Test each pattern with custom input and configure the output format for each strategy.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(config.patterns || {}).map(([key, value]) => {
                if (key === 'custom') return null;
                const patternConfig = value as any;

                const testInput = testInputs[key] || '';
                const patternFormat = patternFormats[key] || {
                  tokenFormat: '[{TYPE}_{INDEX}]',
                  maskChar: '*',
                  preserveStructure: true
                };

                // Test with each strategy using per-pattern format options
                const testWithStrategy = (strategy: 'token' | 'mask' | 'formatPreserving') => {
                  try {
                    const testConfig = {
                      ...config,
                      formatOptions: {
                        tokenFormat: patternFormat.tokenFormat,
                        maskChar: patternFormat.maskChar,
                        preserveStructure: patternFormat.preserveStructure,
                      },
                      patterns: {
                        ...config.patterns,
                        [key]: {
                          ...(config.patterns?.[key as keyof typeof config.patterns] as any),
                          enabled: true,
                          strategy,
                        },
                      },
                    };
                    const redactor = new DataRedactor(testConfig);
                    const result = redactor.redact(testInput);
                    return result.redactedText || testInput;
                  } catch (error) {
                    return `Error: ${error}`;
                  }
                };

                const updatePatternFormat = (field: 'tokenFormat' | 'maskChar' | 'preserveStructure', value: string | boolean) => {
                  setPatternFormats({
                    ...patternFormats,
                    [key]: {
                      ...patternFormat,
                      [field]: value
                    }
                  });
                };

                const tokenOutput = testWithStrategy('token');
                const maskOutput = testWithStrategy('mask');
                const formatPreservingOutput = testWithStrategy('formatPreserving');

                const copyToClipboard = (text: string, label: string) => {
                  navigator.clipboard.writeText(text);
                  alert(`${label} copied to clipboard!`);
                };

                return (
                  <div key={key} style={{
                    backgroundColor: '#FFFFFF',
                    border: '3px solid #BF0A30',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}>
                    {/* Pattern Header */}
                    <div style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#002868', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {key}
                      </h3>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#002868', marginBottom: '6px', textTransform: 'uppercase' }}>
                        Test Input:
                      </label>
                      <input
                        type="text"
                        value={testInput}
                        onChange={(e) => setTestInputs({ ...testInputs, [key]: e.target.value })}
                        placeholder={`Enter ${key} to test...`}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          border: '2px solid #002868',
                          borderRadius: '8px',
                          backgroundColor: '#F8F9FA',
                          boxSizing: 'border-box',
                          fontWeight: '600',
                          color: '#002868',
                        }}
                      />
                    </div>

                    {/* Strategy Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                      {/* Token Strategy */}
                      <div style={{ backgroundColor: '#F0F4F8', padding: '16px', borderRadius: '10px', border: '3px solid #BF0A30', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#BF0A30', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                          Token Strategy
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#002868', marginBottom: '6px' }}>
                            Token Format:
                          </label>
                          <input
                            type="text"
                            value={patternFormat.tokenFormat}
                            onChange={(e) => updatePatternFormat('tokenFormat', e.target.value)}
                            placeholder="[PATTERN_{INDEX}]"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              border: '2px solid #002868',
                              borderRadius: '6px',
                              backgroundColor: '#fff',
                              boxSizing: 'border-box',
                              fontWeight: '600',
                              color: '#002868',
                            }}
                          />
                          <div style={{ fontSize: '11px', color: '#002868', marginTop: '4px', fontWeight: '600' }}>
                            Use <code>{'{INDEX}'}</code> for counter (e.g., [IP_{'{INDEX}'}] → [IP_1])
                          </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '10px', border: '2px solid #002868' }}>
                          <div style={{ fontSize: '12px', color: '#002868', marginBottom: '6px', fontWeight: '700' }}>Output:</div>
                          <code style={{ fontSize: '14px', color: '#BF0A30', display: 'block', wordBreak: 'break-all', fontWeight: '700' }}>
                            {tokenOutput}
                          </code>
                        </div>

                        <button
                          onClick={() => copyToClipboard(tokenOutput, 'Token output')}
                          style={{
                            width: '100%',
                            fontSize: '11px',
                            padding: '6px 10px',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          📋 Copy Token Output
                        </button>
                      </div>

                      {/* Mask Strategy */}
                      <div style={{ backgroundColor: '#F0F4F8', padding: '16px', borderRadius: '10px', border: '3px solid #002868', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <div style={{ fontSize: '14px', fontWeight: '800', color: '#002868', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>
                          Mask Strategy
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                            Mask Character:
                          </label>
                          <input
                            type="text"
                            value={patternFormat.maskChar}
                            onChange={(e) => updatePatternFormat('maskChar', e.target.value.slice(0, 1))}
                            maxLength={1}
                            placeholder="*"
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              fontSize: '12px',
                              fontFamily: 'monospace',
                              border: '1px solid #d1d5db',
                              borderRadius: '4px',
                              backgroundColor: '#fff',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px', fontSize: '11px', fontWeight: '600', color: '#374151' }}>
                          <input
                            type="checkbox"
                            checked={patternFormat.preserveStructure}
                            onChange={(e) => updatePatternFormat('preserveStructure', e.target.checked)}
                            style={{ cursor: 'pointer', width: '14px', height: '14px' }}
                          />
                          Preserve structure
                        </label>

                        <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Output:</div>
                          <code style={{ fontSize: '13px', color: '#dc2626', display: 'block', wordBreak: 'break-all', fontWeight: '600' }}>
                            {maskOutput}
                          </code>
                        </div>

                        <button
                          onClick={() => copyToClipboard(maskOutput, 'Mask output')}
                          style={{
                            width: '100%',
                            fontSize: '11px',
                            padding: '6px 10px',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          📋 Copy Mask Output
                        </button>
                      </div>

                      {/* Format-Preserving Strategy */}
                      <div style={{ backgroundColor: '#eff6ff', padding: '14px', borderRadius: '8px', border: '2px solid #2563eb' }}>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Format-Preserving
                        </div>

                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '10px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                          ℹ️ Automatically maintains input format with realistic fake data
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '6px', marginBottom: '8px' }}>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Output:</div>
                          <code style={{ fontSize: '13px', color: '#2563eb', display: 'block', wordBreak: 'break-all', fontWeight: '600' }}>
                            {formatPreservingOutput}
                          </code>
                        </div>

                        <button
                          onClick={() => copyToClipboard(formatPreservingOutput, 'Format-preserving output')}
                          style={{
                            width: '100%',
                            fontSize: '11px',
                            padding: '6px 10px',
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600',
                          }}
                        >
                          📋 Copy Format-Preserving Output
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#dbeafe', border: '1px solid #3b82f6', borderRadius: '6px' }}>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>
                <strong>ℹ️ Interactive Testing:</strong> The outputs shown above are generated in real-time using the core redaction engine.
                Modify the test input to see how different values are redacted. Each strategy runs independently and produces deterministic results.
              </div>
            </div>
          </>
        )}
      </div>

      <div style={gridStyle}>
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{...labelStyle, marginBottom: 0}}>Input Text</label>
            <button
              onClick={handleInsertTestData}
              style={{
                ...secondaryButtonStyle,
                fontSize: '12px',
                padding: '6px 12px',
                marginRight: 0,
                marginBottom: 0,
              }}
            >
              Insert Test Data
            </button>
          </div>
          <textarea
            style={textareaStyle}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text with sensitive data here..."
          />
        </div>

        <div style={panelStyle}>
          <label style={labelStyle}>Redacted Output</label>
          <textarea
            style={{ ...textareaStyle, backgroundColor: '#f8f8f8' }}
            value={redactedText}
            readOnly
            placeholder="Redacted text will appear here..."
          />
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button style={buttonStyle} onClick={handleRedact}>
          🔒 Redact Data
        </button>
        <button style={secondaryButtonStyle} onClick={handleCopy} disabled={!redactedText}>
          📋 Copy Output
        </button>
        <button style={secondaryButtonStyle} onClick={handleClear}>
          🗑️ Clear All
        </button>
      </div>

      {Object.keys(mapping).length > 0 && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label style={labelStyle}>Redaction Mapping (Keep this secure!)</label>
            <button style={{ ...buttonStyle, margin: 0, padding: '8px 16px', fontSize: '14px' }} onClick={handleCopyMapping}>
              📋 Copy Mapping
            </button>
          </div>
          <div style={mappingStyle}>
            {Object.entries(mapping).map(([original, redacted]) => (
              <div key={original} style={{ marginBottom: '4px' }}>
                <strong>{original}</strong> → {redacted}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
