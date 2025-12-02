import { TestSample } from '../../types'

export const macAddressNetworkConfig: TestSample = {
  id: 'mac-address-network-config',
  name: 'MAC Addresses in Network Config',
  content: `# Network Configuration
iface eth0 inet static
  address 192.168.1.10
  hwaddr 00:1B:44:11:3A:B8

# DHCP Reservations
host server1 {
  hardware ethernet A4:5E:60:E2:91:3F;
  fixed-address 10.0.0.50;
}

# ARP Table
10.0.0.100 at 08:00:27:12:34:56 on en0`,
  expectedMatches: [
    {
      value: '192.168.1.10',
      shouldMatch: true,
      startIndex: 58,
      endIndex: 70,
      reason: 'IP address in config',
    },
    {
      value: '00:1B:44:11:3A:B8',
      shouldMatch: true,
      startIndex: 82,
      endIndex: 99,
      reason: 'Hardware address (MAC)',
    },
    {
      value: 'A4:5E:60:E2:91:3F',
      shouldMatch: true,
      startIndex: 161,
      endIndex: 178,
      reason: 'MAC in DHCP reservation',
    },
    {
      value: '10.0.0.50',
      shouldMatch: true,
      startIndex: 196,
      endIndex: 205,
      reason: 'Fixed IP address',
    },
    {
      value: '10.0.0.100',
      shouldMatch: true,
      startIndex: 222,
      endIndex: 232,
      reason: 'IP in ARP table',
    },
    {
      value: '08:00:27:12:34:56',
      shouldMatch: true,
      startIndex: 236,
      endIndex: 253,
      reason: 'MAC in ARP table',
    },
  ],
  category: 'config',
}
