import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils';

const AdminJobs = () => {
  // Mock data
  const jobs = [
    {
      id: '1',
      title: 'Farm Harvesting Work',
      employer: 'Rajesh Kumar',
      category: 'FARMING',
      location: 'Haridwar',
      workers: { required: 5, hired: 3 },
      wage: 700,
      status: 'OPEN',
      postedDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'Construction Site Work',
      employer: 'Builders Co.',
      category: 'CONSTRUCTION',
      location: 'Dehradun',
      workers: { required: 3, hired: 3 },
      wage: 800,
      status: 'IN_PROGRESS',
      postedDate: '2024-01-10',
    },
  ];

  const stats = [
    { label: 'Total Jobs', value: '234' },
    { label: 'Active Jobs', value: '89' },
    { label: 'Completed Jobs', value: '145' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground mt-2">Monitor all jobs on the platform</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Posted by {job.employer} • {job.category}
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

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Workers</p>
                        <p className="text-sm font-medium">
                          {job.workers.hired}/{job.workers.required}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Wage</p>
                        <p className="text-sm font-medium">{formatCurrency(job.wage)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Posted</p>
                        <p className="text-sm font-medium">{job.postedDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminJobs;
