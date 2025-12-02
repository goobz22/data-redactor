import { TestSample } from '../../types'

export const ipv4KubernetesPods: TestSample = {
  id: 'ipv4-kubernetes-pods',
  name: 'Kubernetes Pod IPs',
  content: `NAME                     READY   STATUS    RESTARTS   AGE   IP            NODE
web-app-7d8f9c-xk2qp     1/1     Running   0          5d    10.244.1.15   worker-1
api-service-5b6c7d-p9w3  1/1     Running   0          3d    10.244.2.23   worker-2
database-8e9f0a-r5t7     1/1     Running   0          10d   10.244.1.45   worker-1

Service ClusterIP: 10.96.0.1
Pod CIDR: 10.244.0.0/16
Node Internal IP: 192.168.1.50`,
  expectedMatches: [
    {
      value: '10.244.1.15',
      shouldMatch: true,
      startIndex: 142,
      endIndex: 153,
      reason: 'Pod IP on worker-1',
    },
    {
      value: '10.244.2.23',
      shouldMatch: true,
      startIndex: 230,
      endIndex: 241,
      reason: 'Pod IP on worker-2',
    },
    {
      value: '10.244.1.45',
      shouldMatch: true,
      startIndex: 317,
      endIndex: 328,
      reason: 'Database pod IP',
    },
    {
      value: '10.96.0.1',
      shouldMatch: true,
      startIndex: 363,
      endIndex: 372,
      reason: 'Kubernetes service cluster IP',
    },
    {
      value: '10.244.0.0',
      shouldMatch: true,
      startIndex: 385,
      endIndex: 395,
      reason: 'Pod CIDR network address',
    },
    {
      value: '192.168.1.50',
      shouldMatch: true,
      startIndex: 419,
      endIndex: 431,
      reason: 'Node internal IP',
    },
  ],
  category: 'network',
}
