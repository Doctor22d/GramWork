'use client';
'use client';

import { EmployerLocationPicker } from '@/features/maps/components/EmployerLocationPicker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';

export default function CreateAssignmentPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
        <p className="text-muted-foreground mt-1">Post a new job and find nearby workers instantly.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Location</CardTitle>
          <CardDescription>Drag the pin or search for an address to set the exact assignment location.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployerLocationPicker 
            onSave={(lat, lng, address) => {
              console.log('Saved to backend DTO structure:', { latitude: lat, longitude: lng, locationName: address });
              // Would sync to Form State here
            }} 
          />
        </CardContent>
      </Card>
      
      {/* Other form fields like Title, Wage, Workers Needed, etc. would go here */}
    </motion.div>
  );
}

