import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAuthStore } from '@/stores/authStore';
import { useWorkerProfile } from '@/hooks';
import { RequestUpdate, Availability } from '@/types';
import { Edit, Save, X } from 'lucide-react';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().min(18).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
  village: z.string().min(2).optional(),
  skill: z.string().min(2).optional(),
  yearsOfExperience: z.number().min(0).max(50).optional(),
  dailyWage: z.number().min(0).optional(),
  workingHours: z.string().optional(),
});

const WorkerProfile = () => {
  const { user } = useAuthStore();
  const { profile, isLoading, updateMutation, updateAvailabilityMutation } = useWorkerProfile(user?.id);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RequestUpdate>({
    resolver: zodResolver(updateProfileSchema),
    values: profile ? {
      name: profile.name,
      age: profile.age,
      phone: profile.phone,
      village: profile.village,
      skill: profile.skill,
      yearsOfExperience: profile.yearsOfExperience,
      dailyWage: profile.dailyWage,
      workingHours: profile.workingHours,
    } : undefined,
  });

  const onSubmit = (data: RequestUpdate) => {
    if (user?.id) {
      updateMutation.mutate(
        { userId: user.id, data },
        {
          onSuccess: () => {
            setIsEditing(false);
          },
        }
      );
    }
  };

  const handleAvailabilityChange = (status: Availability) => {
    if (user?.id) {
      updateAvailabilityMutation.mutate({ userId: user.id, status });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your personal information</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    disabled={!isEditing}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    disabled={!isEditing}
                  />
                  {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    disabled={!isEditing}
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village">Village</Label>
                  <Input
                    id="village"
                    {...register('village')}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Details */}
          <Card>
            <CardHeader>
              <CardTitle>Work Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="skill">Primary Skill</Label>
                  <Input
                    id="skill"
                    {...register('skill')}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    {...register('yearsOfExperience', { valueAsNumber: true })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyWage">Daily Wage (₹)</Label>
                  <Input
                    id="dailyWage"
                    type="number"
                    {...register('dailyWage', { valueAsNumber: true })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    {...register('workingHours')}
                    placeholder="e.g., 08:00-17:00"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Status */}
          <Card>
            <CardHeader>
              <CardTitle>Availability Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={profile?.availability === Availability.AVAILABLE ? 'default' : 'outline'}
                  onClick={() => handleAvailabilityChange(Availability.AVAILABLE)}
                >
                  Available
                </Button>
                <Button
                  type="button"
                  variant={profile?.availability === Availability.BUSY ? 'default' : 'outline'}
                  onClick={() => handleAvailabilityChange(Availability.BUSY)}
                >
                  Busy
                </Button>
                <Button
                  type="button"
                  variant={profile?.availability === Availability.UNAVAILABLE ? 'default' : 'outline'}
                  onClick={() => handleAvailabilityChange(Availability.UNAVAILABLE)}
                >
                  Unavailable
                </Button>
              </div>
            </CardContent>
          </Card>

          {isEditing && (
            <div className="flex gap-3">
              <Button type="submit" disabled={updateMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  reset();
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WorkerProfile;
