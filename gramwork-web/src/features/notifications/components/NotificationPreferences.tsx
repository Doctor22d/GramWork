'use client';

import { useNotificationStore } from '../store/useNotificationStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Switch } from '@/shared/components/ui/switch';
import { Label } from '@/shared/components/ui/label';

export function NotificationPreferencesPanel() {
  const { preferences, updatePreferences } = useNotificationStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you want to receive alerts and system events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Global Settings</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="toasts-enabled" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal text-xs text-muted-foreground">Receive real-time popup alerts.</span>
            </Label>
            <Switch 
              id="toasts-enabled"
              checked={preferences.toastsEnabled}
              onCheckedChange={(c) => updatePreferences({ toastsEnabled: c })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled" className="flex flex-col space-y-1">
              <span>Notification Sounds</span>
              <span className="font-normal text-xs text-muted-foreground">Play a sound on new alerts.</span>
            </Label>
            <Switch 
              id="sound-enabled"
              checked={preferences.soundEnabled}
              onCheckedChange={(c) => updatePreferences({ soundEnabled: c })}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-medium">Categories</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="cat-assignments" className="flex flex-col space-y-1">
              <span>Assignments</span>
              <span className="font-normal text-xs text-muted-foreground">Acceptance, updates, and completions.</span>
            </Label>
            <Switch 
              id="cat-assignments"
              checked={preferences.categories.assignments}
              onCheckedChange={(c) => updatePreferences({ categories: { ...preferences.categories, assignments: c } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cat-jobs" className="flex flex-col space-y-1">
              <span>Jobs & Nearby Work</span>
              <span className="font-normal text-xs text-muted-foreground">New jobs posted near your location.</span>
            </Label>
            <Switch 
              id="cat-jobs"
              checked={preferences.categories.jobs}
              onCheckedChange={(c) => updatePreferences({ categories: { ...preferences.categories, jobs: c } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cat-payments" className="flex flex-col space-y-1">
              <span>Payments</span>
              <span className="font-normal text-xs text-muted-foreground">Wage deposits and payment status.</span>
            </Label>
            <Switch 
              id="cat-payments"
              checked={preferences.categories.payments}
              onCheckedChange={(c) => updatePreferences({ categories: { ...preferences.categories, payments: c } })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cat-system" className="flex flex-col space-y-1">
              <span>System & Admin</span>
              <span className="font-normal text-xs text-muted-foreground">Critical alerts and announcements.</span>
            </Label>
            <Switch 
              id="cat-system"
              checked={preferences.categories.system}
              onCheckedChange={(c) => updatePreferences({ categories: { ...preferences.categories, system: c } })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
