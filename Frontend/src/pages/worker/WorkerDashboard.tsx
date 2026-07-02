import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useWorkerProfile } from '@/hooks';
import { 
  Briefcase, 
  Calendar, 
  Wallet, 
  Star,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { formatCurrency } from '@/utils';

const WorkerDashboard = () => {
  const { user } = useAuthStore();
  const { profile, isLoading } = useWorkerProfile(user?.id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: 'Total Jobs',
      value: profile?.totalJobsCompleted || 0,
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Rating',
      value: `${profile?.rating || 0}/5`,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Daily Wage',
      value: formatCurrency(profile?.dailyWage || 0),
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Reliability',
      value: `${((profile?.reliabilityScore || 0) * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.name || 'Worker'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your work status
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Profile Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{profile?.village || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Skill</p>
                  <p className="text-sm text-muted-foreground">{profile?.skill || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.yearsOfExperience || 0} years
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Reviews</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.reviews || 0} reviews
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Current Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    profile?.availability === 'AVAILABLE'
                      ? 'bg-green-100 text-green-800'
                      : profile?.availability === 'BUSY'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {profile?.availability || 'UNAVAILABLE'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Working Hours</p>
                <p className="text-sm text-muted-foreground">
                  {profile?.workingHours || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Preferred Categories</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile?.preferredCategories?.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {category}
                    </span>
                  )) || <p className="text-sm text-muted-foreground">None set</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5">
                <Briefcase className="h-8 w-8 text-primary" />
                <span className="font-medium">Find Jobs</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="font-medium">View Attendance</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors hover:border-primary hover:bg-primary/5">
                <Wallet className="h-8 w-8 text-primary" />
                <span className="font-medium">Check Payments</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkerDashboard;
