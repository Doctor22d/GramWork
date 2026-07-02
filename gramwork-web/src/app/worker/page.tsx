'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LocationBanner } from '@/features/location/components/LocationBanner';
import { LeafletMap } from '@/features/location/components/LeafletMap';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>

      <LocationBanner />
      
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Location & Service Area</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <LeafletMap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Location must be active to fetch nearby assignments.</p>
            {/* The nearby jobs list will be mapped here using useGeolocation() hooks */}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
