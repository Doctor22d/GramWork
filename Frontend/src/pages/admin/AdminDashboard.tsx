import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Users, 
  Briefcase, 
  Wallet, 
  TrendingUp,
  Activity,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - will be replaced with actual API calls
  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Jobs',
      value: '89',
      change: '+5%',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Payments',
      value: '₹4.2M',
      change: '+18%',
      icon: Wallet,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Platform Growth',
      value: '+24%',
      change: 'This month',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivities = [
    { id: 1, type: 'USER_REGISTERED', message: 'New employer registered', time: '5 min ago' },
    { id: 2, type: 'JOB_POSTED', message: 'New job posted in Haridwar', time: '12 min ago' },
    { id: 3, type: 'PAYMENT_COMPLETED', message: 'Payment of ₹7,000 completed', time: '1 hour ago' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Monitor platform performance and manage users</p>
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
                  <p className="text-xs text-muted-foreground mt-1">{stat.change} from last month</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>API Services</span>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>Database</span>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span>WebSocket</span>
                </div>
                <span className="text-sm font-medium text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span>Payment Gateway</span>
                </div>
                <span className="text-sm font-medium text-yellow-600">Degraded</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <p className="text-2xl font-bold">856</p>
                <p className="text-sm text-muted-foreground">Workers</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <p className="text-2xl font-bold">378</p>
                <p className="text-sm text-muted-foreground">Employers</p>
              </div>
              <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                <Briefcase className="h-8 w-8 text-purple-600 mb-2" />
                <p className="text-2xl font-bold">89</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
