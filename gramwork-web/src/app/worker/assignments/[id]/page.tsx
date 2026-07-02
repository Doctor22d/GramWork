'use client';

import { AssignmentDetailsMap } from '@/features/maps/components/AssignmentDetailsMap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';

export default function AssignmentDetailsPage({ params }: { params: { id: string } }) {
  // In a real flow, fetch assignment details from backend using params.id
  // Mocking coordinates for demonstration of Route Visualization
  const mockAssignmentLat = 20.6;
  const mockAssignmentLng = 78.97;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignment Details</h1>
        <p className="text-muted-foreground mt-1">View comprehensive details and calculate your route.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Location & Route Details</CardTitle>
              <CardDescription>Map showing route from your current location to the job site.</CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentDetailsMap 
                assignmentLat={mockAssignmentLat} 
                assignmentLng={mockAssignmentLng} 
                address="Example Village, District Center"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Wage</p>
                  <p className="text-2xl font-bold text-green-600">₹450 / day</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">Farm Labor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
