'use client';

import { AdminTable } from '@/features/admin/components/AdminTable';
import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'framer-motion';

const MOCK_ASSIGNMENTS = [
  { id: 'A-101', title: 'Farm Harvest', employer: 'E-012', worker: 'W-001', wage: 450, status: 'IN_PROGRESS', date: '2023-10-12' },
  { id: 'A-102', title: 'Construction Labor', employer: 'E-045', worker: 'Pending', wage: 600, status: 'OPEN', date: '2023-10-15' },
  { id: 'A-103', title: 'Loading Goods', employer: 'E-088', worker: 'W-002', wage: 400, status: 'COMPLETED', date: '2023-10-10' },
];

export default function AssignmentMonitoringPage() {
  const columns = [
    { header: 'Assignment ID', accessorKey: 'id' as const },
    { header: 'Title', accessorKey: 'title' as const },
    { header: 'Employer ID', accessorKey: 'employer' as const },
    { header: 'Worker ID', accessorKey: 'worker' as const },
    { header: 'Wage (₹)', accessorKey: 'wage' as const },
    { header: 'Date', accessorKey: 'date' as const },
    { 
      header: 'Status', 
      accessorKey: 'status' as const,
      cell: (row: typeof MOCK_ASSIGNMENTS[0]) => {
        const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          'OPEN': 'secondary',
          'IN_PROGRESS': 'default',
          'COMPLETED': 'outline',
          'CANCELLED': 'destructive'
        };
        return (
          <Badge variant={variantMap[row.status] || 'default'}>
            {row.status}
          </Badge>
        );
      }
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignment Monitoring</h1>
        <p className="text-muted-foreground mt-1">Track and manage all system-wide assignments and job postings.</p>
      </div>

      <AdminTable 
        data={MOCK_ASSIGNMENTS} 
        columns={columns} 
        searchPlaceholder="Search assignments by ID, title, or employer..." 
      />
    </motion.div>
  );
}
