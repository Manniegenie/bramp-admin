import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Filter, Search } from 'lucide-react';

export function AuditAndMonitoring() {
  // Mock data for audit logs
  const auditLogs = [
    {
      id: 1,
      timestamp: '2025-09-21 10:30:45',
      user: 'admin@example.com',
      action: 'User Login',
      ip: '192.168.1.1',
      status: 'Success',
    },
    // Add more mock data as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Audit & Monitoring</h1>
        <div className="flex space-x-4">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Events Today</h3>
          <p className="text-3xl font-bold">247</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Security Alerts</h3>
          <p className="text-3xl font-bold text-red-600">3</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-3xl font-bold">42</p>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Audit Log</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'Success' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}