import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Clock, Users, DollarSign } from 'lucide-react';

const WorkerJobs = () => {
  // Mock data - will be replaced with actual API calls
  const nearbyJobs = [
    {
      id: '1',
      title: 'Farm Harvesting Work',
      employer: 'Rajesh Kumar',
      location: 'Haridwar',
      distance: '5 km',
      wage: 700,
      workersNeeded: 5,
      duration: '5 days',
      urgency: 'HIGH',
    },
    {
      id: '2',
      title: 'Construction Helper',
      employer: 'Builders Co.',
      location: 'Dehradun',
      distance: '12 km',
      wage: 600,
      workersNeeded: 3,
      duration: '10 days',
      urgency: 'MEDIUM',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Find Jobs</h1>
          <p className="text-muted-foreground mt-2">Browse nearby job opportunities</p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>All Categories</option>
                  <option>Farming</option>
                  <option>Construction</option>
                  <option>Electrical</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Distance</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Within 10 km</option>
                  <option>Within 25 km</option>
                  <option>Within 50 km</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Wage Range</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>All Wages</option>
                  <option>₹500-₹700</option>
                  <option>₹700-₹1000</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {nearbyJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">by {job.employer}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.urgency === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {job.urgency}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">
                        {job.location} ({job.distance})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Daily Wage</p>
                      <p className="text-sm font-medium">₹{job.wage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Workers Needed</p>
                      <p className="text-sm font-medium">{job.workersNeeded}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{job.duration}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button size="sm" className="flex-1">
                    Apply Now
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WorkerJobs;
