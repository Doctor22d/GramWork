import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Clock, XCircle, Briefcase } from 'lucide-react';

const WorkerAssignments = () => {
  // Mock data - will be replaced with actual API calls
  const assignments = [
    {
      id: '1',
      jobTitle: 'Farm Harvesting Work',
      employer: 'Rajesh Kumar',
      status: 'IN_PROGRESS',
      startDate: '2024-01-15',
      wage: 700,
    },
    {
      id: '2',
      jobTitle: 'Construction Helper',
      employer: 'Builders Co.',
      status: 'PENDING',
      startDate: '2024-01-20',
      wage: 600,
    },
    {
      id: '3',
      jobTitle: 'Electrical Work',
      employer: 'Tech Services',
      status: 'COMPLETED',
      startDate: '2024-01-10',
      completedDate: '2024-01-14',
      wage: 800,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Briefcase className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Assignments</h1>
          <p className="text-muted-foreground mt-2">Manage your work assignments</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b">
          <button className="px-4 py-2 border-b-2 border-primary font-medium">All</button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Pending
          </button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
            In Progress
          </button>
          <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
            Completed
          </button>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{assignment.jobTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">by {assignment.employer}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      assignment.status
                    )}`}
                  >
                    {assignment.status.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="text-sm font-medium">{assignment.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Daily Wage</p>
                    <p className="text-sm font-medium">₹{assignment.wage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(assignment.status)}
                      <span className="text-sm font-medium">
                        {assignment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {assignment.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1">
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Reject
                    </Button>
                  </div>
                )}

                {assignment.status === 'IN_PROGRESS' && (
                  <div className="flex gap-3">
                    <Button size="sm" className="flex-1">
                      Mark Complete
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                )}

                {assignment.status === 'COMPLETED' && (
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerAssignments;
