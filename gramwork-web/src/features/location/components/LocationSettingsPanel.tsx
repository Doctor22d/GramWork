'use client';

import { useLocationStore } from '../store/useLocationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Switch } from '@/shared/components/ui/switch';
import { Button } from '@/shared/components/ui/button';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const RADII = [2, 5, 10, 25];

export function LocationSettingsPanel() {
  const { 
    serviceRadiusKm, setServiceRadius, 
    autoUpdateEnabled, setAutoUpdate,
    permissionState
  } = useLocationStore();

  const handleSaveRadius = (r: number) => {
    setServiceRadius(r);
    // Persist via backend API theoretically, but OpenAPI lacks dedicated radius endpoint.
    // The radius is sent dynamically via 'nearbyRequest' in the worker flows.
    toast.success(`Service radius updated to ${r} km`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location & Privacy Settings</CardTitle>
        <CardDescription>Configure how we track your location and find nearby jobs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Service Area (Geofencing)</h3>
          <p className="text-xs text-muted-foreground">Select how far you are willing to travel for assignments.</p>
          <div className="flex flex-wrap gap-2">
            {RADII.map((r) => (
              <Button
                key={r}
                variant={serviceRadiusKm === r ? "default" : "outline"}
                onClick={() => handleSaveRadius(r)}
                className="w-24"
              >
                {serviceRadiusKm === r && <Check className="mr-2 h-4 w-4" />}
                {r} km
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Privacy Settings</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-update" className="flex flex-col space-y-1">
              <span>Automatic Background Sync</span>
              <span className="font-normal text-xs text-muted-foreground">
                Sync location to the backend every 15-30 minutes while the app is open.
              </span>
            </Label>
            <Switch 
              id="auto-update"
              checked={autoUpdateEnabled}
              onCheckedChange={(c) => {
                setAutoUpdate(c);
                toast(c ? 'Background sync enabled' : 'Background sync disabled');
              }}
              disabled={permissionState !== 'granted'}
            />
          </div>
          {permissionState !== 'granted' && (
            <p className="text-xs text-destructive">
              * Location permission is required to enable background sync.
            </p>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
