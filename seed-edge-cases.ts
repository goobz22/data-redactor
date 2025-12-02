/**
 * Seed script to populate the database with mock edge cases
 */
import {
  saveEdgeCase,
  type EdgeCaseReport,
} from './packages/api/db/client'

const mockEdgeCases: Omit<EdgeCaseReport, '_id' | 'id' | 'created_at' | 'updated_at'>[] = [
  {
    pattern_name: 'ipv4',
    report_type: 'false-positive',
    full_sample_text: `Application version: 1.2.3.4
Release date: 2024-11-30
Build number: 5678`,
    problematic_value: '1.2.3.4',
    expected_behavior: 'should-not-match',
    context: 'Version numbers should not be matched as IP addresses',
    submitted_by: 'developer@example.com',
    votes: 12,
    status: 'open',
  },
  {
    pattern_name: 'email',
    report_type: 'false-negative',
    full_sample_text: `Contact: user+tag@subdomain.example.co.uk
Support: admin@internal-server.local`,
    problematic_value: 'user+tag@subdomain.example.co.uk',
    expected_behavior: 'should-match',
    context: 'Email with plus addressing and multiple subdomains not detected',
    submitted_by: 'tester@company.com',
    votes: 8,
    status: 'open',
  },
  {
    pattern_name: 'phone',
    report_type: 'false-positive',
    full_sample_text: `Order ID: 555-1234-5678
Invoice: INV-2024-001
Customer: John Doe`,
    problematic_value: '555-1234-5678',
    expected_behavior: 'should-not-match',
    context: 'Order IDs formatted like phone numbers incorrectly matched',
    submitted_by: 'qa@example.com',
    votes: 15,
    status: 'fixed',
  },
  {
    pattern_name: 'ssn',
    report_type: 'false-negative',
    full_sample_text: `Employee SSN: 123 45 6789 (spaces instead of dashes)
Tax ID: 987-65-4321
DOB: 01/15/1990`,
    problematic_value: '123 45 6789',
    expected_behavior: 'should-match',
    context: 'SSN with spaces instead of dashes not detected',
    submitted_by: 'security@company.com',
    votes: 20,
    status: 'open',
  },
  {
    pattern_name: 'creditCard',
    report_type: 'false-positive',
    full_sample_text: `Device IMEI: 1234567890123456
Serial: 9876543210987654
Tracking: 4532-1234-5678-9999`,
    problematic_value: '4532-1234-5678-9999',
    expected_behavior: 'should-not-match',
    context: 'Tracking numbers formatted like credit cards',
    submitted_by: 'support@shop.com',
    votes: 5,
    status: 'open',
  },
  {
    pattern_name: 'ipv4',
    report_type: 'false-positive',
    full_sample_text: `Docker image: nginx:1.21.3.4
Python version: 3.10.2.1
Database schema: v2.5.1.0`,
    problematic_value: '1.21.3.4',
    expected_behavior: 'should-not-match',
    context: 'Software versions in Docker tags matched as IPs',
    submitted_by: 'devops@tech.io',
    votes: 18,
    status: 'open',
  },
  {
    pattern_name: 'email',
    report_type: 'false-negative',
    full_sample_text: `International emails:
françoise@société.fr
müller@münchen.de
日本@example.jp`,
    problematic_value: 'françoise@société.fr',
    expected_behavior: 'should-match',
    context: 'International characters in email addresses not detected',
    submitted_by: 'intl@global.com',
    votes: 10,
    status: 'wont-fix',
  },
  {
    pattern_name: 'macAddress',
    report_type: 'false-negative',
    full_sample_text: `Network interfaces:
eth0: 00-1B-44-11-3A-B8
eth1: 001b44113ab8 (no separators)
wlan0: 00:1B:44:11:3A:B8`,
    problematic_value: '001b44113ab8',
    expected_behavior: 'should-match',
    context: 'MAC address without separators not detected',
    submitted_by: 'netadmin@corp.net',
    votes: 7,
    status: 'open',
  },
  {
    pattern_name: 'hostname',
    report_type: 'false-positive',
    full_sample_text: `File paths:
C:\\Users\\admin.local\\Documents
D:\\Projects\\api.staging.backup
E:\\Data\\mail.example.old`,
    problematic_value: 'admin.local',
    expected_behavior: 'should-not-match',
    context: 'Windows paths with periods matched as hostnames',
    submitted_by: 'sysadmin@windows.com',
    votes: 6,
    status: 'open',
  },
  {
    pattern_name: 'uuid',
    report_type: 'false-positive',
    full_sample_text: `Test data patterns:
00000000-0000-0000-0000-000000000000
ffffffff-ffff-ffff-ffff-ffffffffffff
12345678-1234-1234-1234-123456789012`,
    problematic_value: '00000000-0000-0000-0000-000000000000',
    expected_behavior: 'should-not-match',
    context: 'Test/placeholder UUIDs should be ignored',
    submitted_by: 'qa@testing.org',
    votes: 3,
    status: 'wont-fix',
  },
  {
    pattern_name: 'phone',
    report_type: 'false-negative',
    full_sample_text: `International numbers:
UK: +44 20 7946 0958
Germany: +49 30 12345678
Australia: +61 2 9876 5432`,
    problematic_value: '+44 20 7946 0958',
    expected_behavior: 'should-match',
    context: 'International phone format with spaces not detected',
    submitted_by: 'global@worldwide.com',
    votes: 14,
    status: 'open',
  },
  {
    pattern_name: 'filePath',
    report_type: 'false-negative',
    full_sample_text: `Error stack trace:
  at Module.load (/home/user/.npm/lib/index.js:45)
  at Function.loadConfig (../../../config/settings.json)
  at startup (node_modules/framework/init.js:12)`,
    problematic_value: '/home/user/.npm/lib/index.js',
    expected_behavior: 'should-match',
    context: 'Hidden directory paths not detected',
    submitted_by: 'devtools@example.com',
    votes: 9,
    status: 'fixed',
  },
]

async function seedEdgeCases() {
  console.log('🌱 Seeding edge cases...\n')

  for (const [index, edgeCase] of mockEdgeCases.entries()) {
    try {
      const result = await saveEdgeCase(edgeCase as EdgeCaseReport)
      console.log(
        `✅ [${index + 1}/${mockEdgeCases.length}] Created edge case: ${edgeCase.pattern_name} (${edgeCase.report_type}) - ID: ${result.id}`
      )
    } catch (error) {
      console.error(
        `❌ [${index + 1}/${mockEdgeCases.length}] Failed to create edge case:`,
        error
      )
    }
  }

  console.log('\n✨ Seeding complete!')
  console.log(
    `\n📊 Summary:\n   - Total edge cases: ${mockEdgeCases.length}\n   - Patterns covered: ${[...new Set(mockEdgeCases.map(e => e.pattern_name))].length}\n   - Open issues: ${mockEdgeCases.filter(e => e.status === 'open').length}\n   - Fixed issues: ${mockEdgeCases.filter(e => e.status === 'fixed').length}\n   - Won't fix: ${mockEdgeCases.filter(e => e.status === 'wont-fix').length}`
  )
}

seedEdgeCases()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
