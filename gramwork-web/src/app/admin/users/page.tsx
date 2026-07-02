'use client';

import { AdminTable } from '@/features/admin/components/AdminTable';
import { Badge } from '@/shared/components/ui/badge';
import { motion } from 'framer-motion';

const MOCK_USERS = [
  { id: 'U-001', email: 'admin@gramwork.in', role: 'ADMIN', lastLogin: '2023-10-15 10:30 AM', status: 'Active' },
  { id: 'E-012', email: 'employer@farm.in', role: 'EMPLOYER', lastLogin: '2023-10-14 09:15 AM', status: 'Active' },
  { id: 'W-001', email: 'ramesh@worker.in', role: 'WORKER', lastLogin: '2023-10-15 11:00 AM', status: 'Active' },
];

export default function UserManagementPage() {
  const columns = [
    { header: 'ID', accessorKey: 'id' as const },
    { header: 'Email', accessorKey: 'email' as const },
    { 
      header: 'Role', 
      accessorKey: 'role' as const,
      cell: (row: typeof MOCK_USERS[0]) => (
        <Badge variant={row.role === 'ADMIN' ? 'destructive' : row.role === 'EMPLOYER' ? 'default' : 'secondary'}>
          {row.role}
        </Badge>
      )
    },
    { header: 'Last Login', accessorKey: 'lastLogin' as const },
    { 
      header: 'Status', 
      accessorKey: 'status' as const,
      cell: (row: typeof MOCK_USERS[0]) => (
        <Badge variant={row.status === 'Active' ? 'default' : 'secondary'}>
          {row.status}
        </Badge>
      )
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage global system access and authentication states.</p>
      </div>

      <AdminTable 
        data={MOCK_USERS} 
        columns={columns} 
        searchPlaceholder="Search users by email, ID, or role..." 
      />
    </motion.div>
  );
}
