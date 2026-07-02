const fs = require('fs');
const path = require('path');

const pages = [
  // Employer
  { path: 'employer', title: 'Employer Dashboard Overview', role: 'employer' },
  { path: 'employer/assignments/create', title: 'Create Assignment', role: 'employer' },
  { path: 'employer/assignments', title: 'Assignment List', role: 'employer' },
  { path: 'employer/assignments/[id]', title: 'Assignment Details', role: 'employer' },
  { path: 'employer/assignments/[id]/edit', title: 'Edit Assignment', role: 'employer' },
  { path: 'employer/workers', title: 'Assigned Workers', role: 'employer' },
  { path: 'employer/workers/[id]', title: 'Worker Profile', role: 'employer' },
  { path: 'employer/notifications', title: 'Notifications Center', role: 'employer' },
  { path: 'employer/profile', title: 'Profile Management', role: 'employer' },
  { path: 'employer/settings', title: 'Settings', role: 'employer' },
  
  // Worker
  { path: 'worker', title: 'Worker Dashboard Overview', role: 'worker' },
  { path: 'worker/nearby', title: 'Nearby Jobs', role: 'worker' },
  { path: 'worker/available', title: 'Available Assignments', role: 'worker' },
  { path: 'worker/assignments', title: 'My Assignments', role: 'worker' },
  { path: 'worker/assignments/[id]', title: 'Assignment Details', role: 'worker' },
  { path: 'worker/history', title: 'Assignment History', role: 'worker' },
  { path: 'worker/notifications', title: 'Notifications Center', role: 'worker' },
  { path: 'worker/profile', title: 'Profile Management', role: 'worker' },
  { path: 'worker/settings', title: 'Settings', role: 'worker' },
];

const template = (title) => `'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">${title}</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards for scaffolding */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metric {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">---</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Main Content Area</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Detailed implementation for ${title} will go here, using OpenAPI contracts.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
`;

pages.forEach(({ path: routePath, title }) => {
  const dir = path.join(__dirname, 'src/app', routePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(title));
  console.log(`Created ${routePath}`);
});
