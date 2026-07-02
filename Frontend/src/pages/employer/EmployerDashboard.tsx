import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { useEmployerProfile } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  TrendingUp,
  PlusCircle,
  Clock,
  CheckCircle
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuthStore();
  const { profile, isLoading } = useEmployerProfile(user?.id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Mock stats - will be replaced with actual API data
  const stats = [
    {
      title: 'Active Jobs',
      value: '3',
      icon: Briefcase,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Workers',
      value: '24',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending Assignments',
      value: '5',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Completed Jobs',
      value: '12',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentJobs = [
    {
      id: '1',
      title: 'Farm Harvesting Work',
      workersNeeded: 5,
      workersHired: 3,
      status: 'OPEN',
    },
    {
      id: '2',
      title: 'Construction Site Work',
      workersNeeded: 3,
      workersHired: 3,
      status: 'IN_PROGRESS',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {profile?.employerName || 'Employer'}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your jobs and workers efficiently
            </p>
          </div>
          <Button onClick={() => navigate(ROUTES.EMPLOYER.CREATE_JOB)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
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

        {/* Recent Jobs */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Workers: {job.workersHired}/{job.workersNeeded}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'OPEN'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => navigate(ROUTES.EMPLOYER.JOBS)}>
                View All Jobs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <button
                  onClick={() => navigate(ROUTES.EMPLOYER.CREATE_JOB)}
                  className="flex items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Briefcase className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Post a New Job</p>
                    <p className="text-sm text-muted-foreground">Find workers for your project</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate(ROUTES.EMPLOYER.WORKERS)}
                  className="flex items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Users className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Find Workers</p>
                    <p className="text-sm text-muted-foreground">Search nearby workers</p>
                  </div>
                </button>
                <button
                  onClick={() => navigate(ROUTES.EMPLOYER.ASSIGNMENTS)}
                  className="flex items-center gap-3 rounded-lg border-2 border-dashed p-4 transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Calendar className="h-6 w-6 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Manage Assignments</p>
                    <p className="text-sm text-muted-foreground">Track worker assignments</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerDashboard;
