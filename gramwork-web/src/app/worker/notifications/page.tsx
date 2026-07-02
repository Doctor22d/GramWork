'use client';

import { motion } from 'framer-motion';
import { NotificationList } from '@/features/notifications/components/NotificationList';
import { NotificationPreferencesPanel } from '@/features/notifications/components/NotificationPreferences';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Notifications Center</h1>
      </div>
      
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <NotificationList />
        </TabsContent>
        <TabsContent value="preferences">
          <NotificationPreferencesPanel />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
