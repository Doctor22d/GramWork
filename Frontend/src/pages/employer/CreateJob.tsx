import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useAuthStore } from '@/stores/authStore';
import { useEmployerProfile } from '@/hooks';
import { useJob } from '@/hooks';
import { jobPostingSchema, JobPostingFormData } from '@/utils/validation';
import { Category, UrgencyLevel } from '@/types';
import { ROUTES } from '@/config/constants';
import { ArrowLeft } from 'lucide-react';

const CreateJob = () => {
  const { user } = useAuthStore();
  const { profile } = useEmployerProfile(user?.id);
  const { createJobMutation } = useJob();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
  });

  const onSubmit = (data: JobPostingFormData) => {
    if (!user?.id || !profile) return;

    createJobMutation.mutate(
      {
        employerId: user.id,
        employerName: profile.employerName,
        ...data,
      },
      {
        onSuccess: () => {
          navigate(ROUTES.EMPLOYER.JOBS);
        },
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Post a New Job</h1>
            <p className="text-muted-foreground mt-2">Find the right workers for your project</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title*</Label>
                <Input
                  id="title"
                  placeholder="e.g., Farm Harvesting Work"
                  {...register('title')}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  rows={4}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Describe the work requirements..."
                  {...register('description')}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category*</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('category')}
                  >
                    <option value="">Select category</option>
                    {Object.values(Category).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requiredSkills">Required Skills</Label>
                  <Input
                    id="requiredSkills"
                    placeholder="e.g., Harvesting, Manual Labor"
                    {...register('requiredSkills')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Work Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="requiredWorkers">Workers Needed*</Label>
                  <Input
                    id="requiredWorkers"
                    type="number"
                    min="1"
                    {...register('requiredWorkers', { valueAsNumber: true })}
                  />
                  {errors.requiredWorkers && (
                    <p className="text-sm text-destructive">{errors.requiredWorkers.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wage">Daily Wage (₹)*</Label>
                  <Input
                    id="wage"
                    type="number"
                    min="0"
                    {...register('wage', { valueAsNumber: true })}
                  />
                  {errors.wage && <p className="text-sm text-destructive">{errors.wage.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" placeholder="e.g., 5 days" {...register('duration')} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="urgencyLevel">Urgency Level*</Label>
                  <select
                    id="urgencyLevel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('urgencyLevel')}
                  >
                    <option value="">Select urgency</option>
                    {Object.values(UrgencyLevel).map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.urgencyLevel && (
                    <p className="text-sm text-destructive">{errors.urgencyLevel.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date*</Label>
                  <Input id="startDate" type="datetime-local" {...register('startDate')} />
                  {errors.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  placeholder="Full address"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="village">Village</Label>
                  <Input id="village" {...register('village')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" {...register('pincode')} />
                  {errors.pincode && (
                    <p className="text-sm text-destructive">{errors.pincode.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude*</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    {...register('latitude', { valueAsNumber: true })}
                  />
                  {errors.latitude && (
                    <p className="text-sm text-destructive">{errors.latitude.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude*</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    {...register('longitude', { valueAsNumber: true })}
                  />
                  {errors.longitude && (
                    <p className="text-sm text-destructive">{errors.longitude.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={createJobMutation.isPending}>
              {createJobMutation.isPending ? 'Posting...' : 'Post Job'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateJob;
