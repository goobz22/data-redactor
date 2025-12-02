/**
 * Test Samples Index
 *
 * Central export point for all 60 test samples (5 per pattern × 12 patterns)
 */

import { TestSample } from '../types'

// IPv4 Samples
import { ipv4ApacheLog } from './ipv4/apache-log'
import { ipv4CidrNotation } from './ipv4/cidr-notation'
import { ipv4FalsePositives } from './ipv4/false-positives'
import { ipv4DockerNetworks } from './ipv4/docker-networks'
import { ipv4KubernetesPods } from './ipv4/kubernetes-pods'

// Email Samples
import { emailStandardFormats } from './email/standard-formats'
import { emailPlusAddressing } from './email/plus-addressing'
import { emailInternational } from './email/international'
import { emailFalsePositives } from './email/false-positives'
import { emailEdgeCases } from './email/edge-cases'

// Phone Samples
import { phoneUSFormats } from './phone/us-formats'
import { phoneInternational } from './phone/international'
import { phoneVanityNumbers } from './phone/vanity-numbers'
import { phoneFalsePositives } from './phone/false-positives'
import { phoneParentheses } from './phone/parentheses'

// SSN Samples
import { ssnStandardFormat } from './ssn/standard-format'
import { ssnFalsePositives } from './ssn/false-positives'
import { ssnContextAware } from './ssn/context-aware'
import { ssnMasked } from './ssn/masked'
import { ssnEdgeCases } from './ssn/edge-cases'

// Credit Card Samples
import { creditCardVisa } from './credit-card/visa'
import { creditCardMastercard } from './credit-card/mastercard'
import { creditCardAmex } from './credit-card/amex'
import { creditCardNoSpaces } from './credit-card/no-spaces'
import { creditCardFalsePositives } from './credit-card/false-positives'

// MAC Address Samples
import { macAddressColonFormat } from './mac-address/colon-format'
import { macAddressDashFormat } from './mac-address/dash-format'
import { macAddressCiscoFormat } from './mac-address/cisco-format'
import { macAddressLowercase } from './mac-address/lowercase'
import { macAddressNetworkConfig } from './mac-address/network-config'

// Hostname Samples
import { hostnameFQDN } from './hostname/fqdn'
import { hostnameSubdomains } from './hostname/subdomains'
import { hostnameURLs } from './hostname/urls'
import { hostnameDNSRecords } from './hostname/dns-records'
import { hostnameFalsePositives } from './hostname/false-positives'

// Ticket Samples
import { ticketCaseFormat } from './ticket/case-format'
import { ticketHashFormat } from './ticket/ticket-hash'
import { ticketJiraFormat } from './ticket/jira-format'
import { ticketSupportLogs } from './ticket/support-logs'
import { ticketFalsePositives } from './ticket/false-positives'

// Name Samples
import { nameFullNames } from './name/full-names'
import { nameFirstOnly } from './name/first-only'
import { nameLastOnly } from './name/last-only'
import { nameSupportTickets } from './name/support-tickets'
import { nameFalsePositives } from './name/false-positives'

// UUID Samples
import { uuidStandard } from './uuid/standard'
import { uuidUppercase } from './uuid/uppercase'
import { uuidLogFiles } from './uuid/log-files'
import { uuidAPIResponses } from './uuid/api-responses'
import { uuidFalsePositives } from './uuid/false-positives'

// File Path Samples
import { filePathWindows } from './file-path/windows'
import { filePathUnix } from './file-path/unix'
import { filePathRelative } from './file-path/relative'
import { filePathErrorLogs } from './file-path/error-logs'
import { filePathFalsePositives } from './file-path/false-positives'

// IPv6 Samples
import { ipv6Standard } from './ipv6/standard'
import { ipv6Compressed } from './ipv6/compressed'
import { ipv6NetworkConfig } from './ipv6/network-config'
import { ipv6Mixed } from './ipv6/mixed'
import { ipv6FalsePositives } from './ipv6/false-positives'

/**
 * All test samples indexed by ID
 */
export const ALL_TEST_SAMPLES: Record<string, TestSample> = {
  // IPv4
  'ipv4-apache-log': ipv4ApacheLog,
  'ipv4-cidr-notation': ipv4CidrNotation,
  'ipv4-false-positives': ipv4FalsePositives,
  'ipv4-docker-networks': ipv4DockerNetworks,
  'ipv4-kubernetes-pods': ipv4KubernetesPods,

  // Email
  'email-standard-formats': emailStandardFormats,
  'email-plus-addressing': emailPlusAddressing,
  'email-international': emailInternational,
  'email-false-positives': emailFalsePositives,
  'email-edge-cases': emailEdgeCases,

  // Phone
  'phone-us-formats': phoneUSFormats,
  'phone-international': phoneInternational,
  'phone-vanity-numbers': phoneVanityNumbers,
  'phone-false-positives': phoneFalsePositives,
  'phone-parentheses': phoneParentheses,

  // SSN
  'ssn-standard-format': ssnStandardFormat,
  'ssn-false-positives': ssnFalsePositives,
  'ssn-context-aware': ssnContextAware,
  'ssn-masked': ssnMasked,
  'ssn-edge-cases': ssnEdgeCases,

  // Credit Card
  'credit-card-visa': creditCardVisa,
  'credit-card-mastercard': creditCardMastercard,
  'credit-card-amex': creditCardAmex,
  'credit-card-no-spaces': creditCardNoSpaces,
  'credit-card-false-positives': creditCardFalsePositives,

  // MAC Address
  'mac-address-colon-format': macAddressColonFormat,
  'mac-address-dash-format': macAddressDashFormat,
  'mac-address-cisco-format': macAddressCiscoFormat,
  'mac-address-lowercase': macAddressLowercase,
  'mac-address-network-config': macAddressNetworkConfig,

  // Hostname
  'hostname-fqdn': hostnameFQDN,
  'hostname-subdomains': hostnameSubdomains,
  'hostname-urls': hostnameURLs,
  'hostname-dns-records': hostnameDNSRecords,
  'hostname-false-positives': hostnameFalsePositives,

  // Ticket
  'ticket-case-format': ticketCaseFormat,
  'ticket-ticket-hash': ticketHashFormat,
  'ticket-jira-format': ticketJiraFormat,
  'ticket-support-logs': ticketSupportLogs,
  'ticket-false-positives': ticketFalsePositives,

  // Name
  'name-full-names': nameFullNames,
  'name-first-only': nameFirstOnly,
  'name-last-only': nameLastOnly,
  'name-support-tickets': nameSupportTickets,
  'name-false-positives': nameFalsePositives,

  // UUID
  'uuid-standard': uuidStandard,
  'uuid-uppercase': uuidUppercase,
  'uuid-log-files': uuidLogFiles,
  'uuid-api-responses': uuidAPIResponses,
  'uuid-false-positives': uuidFalsePositives,

  // File Path
  'file-path-windows': filePathWindows,
  'file-path-unix': filePathUnix,
  'file-path-relative': filePathRelative,
  'file-path-error-logs': filePathErrorLogs,
  'file-path-false-positives': filePathFalsePositives,

  // IPv6
  'ipv6-standard': ipv6Standard,
  'ipv6-compressed': ipv6Compressed,
  'ipv6-network-config': ipv6NetworkConfig,
  'ipv6-mixed': ipv6Mixed,
  'ipv6-false-positives': ipv6FalsePositives,
}

/**
 * Get a test sample by ID
 */
export function getTestSample(id: string): TestSample | undefined {
  return ALL_TEST_SAMPLES[id]
}

/**
 * Get all test samples for a specific pattern
 */
export function getTestSamplesForPattern(patternName: string): TestSample[] {
  const prefix = patternName
    .toLowerCase()
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
  return Object.keys(ALL_TEST_SAMPLES)
    .filter(id => id.startsWith(prefix))
    .map(id => ALL_TEST_SAMPLES[id])
}

/**
 * Get all test sample IDs
 */
export function getAllTestSampleIds(): string[] {
  return Object.keys(ALL_TEST_SAMPLES)
}

/**
 * Get test samples by category
 */
export function getTestSamplesByCategory(
  category: TestSample['category']
): TestSample[] {
  return Object.values(ALL_TEST_SAMPLES).filter(
    sample => sample.category === category
  )
}
