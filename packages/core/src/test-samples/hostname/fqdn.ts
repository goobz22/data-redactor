import { TestSample } from '../../types'

export const hostnameFQDN: TestSample = {
  id: 'hostname-fqdn',
  name: 'Fully Qualified Domain Names',
  content: `Mail server: mail.example.com
Web server: www.company.org
API endpoint: api.service.net
Database: db.internal.local

FTP server: ftp.downloads.example.com
Admin portal: admin.secure.company.co.uk`,
  expectedMatches: [
    {
      value: 'mail.example.com',
      shouldMatch: true,
      startIndex: 13,
      endIndex: 29,
      reason: 'Mail server FQDN',
    },
    {
      value: 'www.company.org',
      shouldMatch: true,
      startIndex: 43,
      endIndex: 58,
      reason: 'Web server FQDN',
    },
    {
      value: 'api.service.net',
      shouldMatch: true,
      startIndex: 74,
      endIndex: 89,
      reason: 'API endpoint FQDN',
    },
    {
      value: 'db.internal.local',
      shouldMatch: true,
      startIndex: 101,
      endIndex: 118,
      reason: 'Internal database hostname',
    },
    {
      value: 'ftp.downloads.example.com',
      shouldMatch: true,
      startIndex: 133,
      endIndex: 158,
      reason: 'FTP server with subdomain',
    },
    {
      value: 'admin.secure.company.co.uk',
      shouldMatch: true,
      startIndex: 174,
      endIndex: 200,
      reason: 'Admin portal with .co.uk TLD',
    },
  ],
  category: 'config',
}
