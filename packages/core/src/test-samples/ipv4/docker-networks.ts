import { TestSample } from '../../types'

export const ipv4DockerNetworks: TestSample = {
  id: 'ipv4-docker-networks',
  name: 'Docker Network Inspection',
  content: `CONTAINER ID   IMAGE          STATUS    PORTS                    NETWORKS
a1b2c3d4e5f6   nginx:latest   Up 5min   0.0.0.0:8080->80/tcp    bridge
Container IP: 172.17.0.2
Gateway: 172.17.0.1

CONTAINER ID   IMAGE          STATUS    PORTS                    NETWORKS
b6c7d8e9f0a1   postgres:14    Up 10min  0.0.0.0:5432->5432/tcp  app-net
Container IP: 172.18.0.3
Gateway: 172.18.0.1

Host bridge interface: 172.17.0.1/16`,
  expectedMatches: [
    {
      value: '0.0.0.0',
      shouldMatch: true,
      startIndex: 104,
      endIndex: 111,
      reason: 'Bind address for port mapping',
    },
    {
      value: '172.17.0.2',
      shouldMatch: true,
      startIndex: 164,
      endIndex: 174,
      reason: 'Container bridge IP',
    },
    {
      value: '172.17.0.1',
      shouldMatch: true,
      startIndex: 185,
      endIndex: 195,
      reason: 'Bridge gateway IP',
    },
    {
      value: '0.0.0.0',
      shouldMatch: true,
      startIndex: 295,
      endIndex: 302,
      reason: 'Bind address for port mapping',
    },
    {
      value: '172.18.0.3',
      shouldMatch: true,
      startIndex: 361,
      endIndex: 371,
      reason: 'Container custom network IP',
    },
    {
      value: '172.18.0.1',
      shouldMatch: true,
      startIndex: 382,
      endIndex: 392,
      reason: 'Custom network gateway',
    },
    {
      value: '172.17.0.1',
      shouldMatch: true,
      startIndex: 420,
      endIndex: 430,
      reason: 'Host bridge interface IP',
    },
  ],
  category: 'network',
}
