import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useJob, useMatching } from '@/hooks';
import { JobLocationMap } from '@/components/maps';
import { formatCurrency, geoJsonToLatLng } from '@/utils';
import { ArrowLeft, MapPin, Users, DollarSign, Calendar, Star } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { job, isLoading } = useJob(id);
  const { matches, isLoading: isLoadingMatches } = useMatching(id, 10);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Job not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const [jobLat, jobLng] = geoJsonToLatLng(job.location);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-muted-foreground mt-2">{job.category}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {job.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{job.description}</p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Workers Needed</p>
                      <p className="font-medium">
                        {job.hiredWorkers}/{job.requiredWorkers}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Daily Wage</p>
                      <p className="font-medium">{formatCurrency(job.wage)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(job.startDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{job.village || job.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Job Location</CardTitle>
              </CardHeader>
              <CardContent>
                <JobLocationMap latitude={jobLat} longitude={jobLng} jobTitle={job.title} />
              </CardContent>
            </Card>
          </div>

          {/* AI Matching Results */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Top Matching Workers</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingMatches ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : matches && matches.length > 0 ? (
                  <div className="space-y-4">
                    {matches.slice(0, 5).map((match, index) => (
                      <div key={match.userId} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">Worker #{index + 1}</p>
                            <p className="text-sm text-muted-foreground">{match.workerSkills}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">
                              {(match.totalScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>Skill Match: {(match.skillScore * 100).toFixed(0)}%</p>
                          <p>Distance: {(match.distanceScore * 100).toFixed(0)}%</p>
                          <p>Availability: {(match.availabilityScore * 100).toFixed(0)}%</p>
                        </div>
                        <Button size="sm" className="w-full mt-3">
                          Assign Worker
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    No matching workers found
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobDetail;
