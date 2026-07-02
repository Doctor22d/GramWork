'use client';

import { AdminTable } from '@/features/admin/components/AdminTable';
import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'framer-motion';

const MOCK_WORKERS = [
  { id: 'W-001', name: 'Ramesh Kumar', phone: '+91 9876543210', village: 'Palghar', status: 'Active', jobsCompleted: 14, rating: 4.8 },
  { id: 'W-002', name: 'Suresh Singh', phone: '+91 8765432109', village: 'Boisar', status: 'Active', jobsCompleted: 3, rating: 4.2 },
  { id: 'W-003', name: 'Ganesh Patil', phone: '+91 7654321098', village: 'Dahanu', status: 'Inactive', jobsCompleted: 0, rating: 0 },
];

export default function WorkerManagementPage() {
  const columns = [
    { header: 'ID', accessorKey: 'id' as const },
    { header: 'Name', accessorKey: 'name' as const },
    { header: 'Phone', accessorKey: 'phone' as const },
    { header: 'Village', accessorKey: 'village' as const },
    { 
      header: 'Status', 
      accessorKey: 'status' as const,
      cell: (row: typeof MOCK_WORKERS[0]) => (
        <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Jobs Completed', accessorKey: 'jobsCompleted' as const },
    { header: 'Rating', accessorKey: 'rating' as const },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Worker Management</h1>
        <p className="text-muted-foreground mt-1">View, search, and manage registered laborers.</p>
      </div>

      <AdminTable 
        data={MOCK_WORKERS} 
        columns={columns} 
        searchPlaceholder="Search workers by name, village, or phone..." 
      />
    </motion.div>
  );
}
