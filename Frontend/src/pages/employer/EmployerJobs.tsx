import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/config/constants';
import { PlusCircle, MapPin, Users, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils';

const EmployerJobs = () => {
  const navigate = useNavigate();

  // Mock data - will be replaced with actual API calls
  const jobs = [
    {
      id: '1',
      title: 'Farm Harvesting Work',
      category: 'FARMING',
      location: 'Haridwar',
      requiredWorkers: 5,
      hiredWorkers: 3,
      wage: 700,
      status: 'OPEN',
      urgency: 'HIGH',
      startDate: '2024-01-20',
    },
    {
      id: '2',
      title: 'Construction Site Work',
      category: 'CONSTRUCTION',
      location: 'Dehradun',
      requiredWorkers: 3,
      hiredWorkers: 3,
      wage: 800,
      status: 'IN_PROGRESS',
      urgency: 'MEDIUM',
      startDate: '2024-01-15',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Jobs</h1>
            <p className="text-muted-foreground mt-2">Manage your job postings</p>
          </div>
          <Button onClick={() => navigate(ROUTES.EMPLOYER.CREATE_JOB)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          <button className="px-4 py-2 border-b-2 border-primary font-medium">All Jobs</button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground">Open</button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
            In Progress
          </button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Completed
          </button>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{job.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.urgency === 'HIGH'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {job.urgency}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mb-4">
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
                        {job.hiredWorkers}/{job.requiredWorkers}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Daily Wage</p>
                      <p className="text-sm font-medium">{formatCurrency(job.wage)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Start Date</p>
                      <p className="text-sm font-medium">{job.startDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button size="sm" onClick={() => navigate(`${ROUTES.EMPLOYER.JOBS}/${job.id}`)}>
                    View Details
                  </Button>
                  {job.status === 'OPEN' && (
                    <Button size="sm" variant="outline">
                      Find Workers
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployerJobs;
