'use client';
'use client';

import { NearbyJobs } from '@/features/maps/components/NearbyJobs';
import { motion } from 'framer-motion';

export default function AvailableAssignmentsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nearby Assignments</h1>
        <p className="text-muted-foreground mt-1">Discover jobs available within your configured service area.</p>
      </div>

      <NearbyJobs />
    </motion.div>
  );
}

