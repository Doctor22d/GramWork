import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/authStore';
import { useAttendance } from '@/hooks';
import { formatDate } from '@/utils';
import { Calendar, CheckCircle } from 'lucide-react';

const WorkerAttendance = () => {
  const { user } = useAuthStore();
  const { workerAttendance, isLoadingWorkerAttendance } = useAttendance(undefined, user?.id);

  if (isLoadingWorkerAttendance) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const totalDaysWorked = workerAttendance?.length || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground mt-2">Your attendance records</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Days Worked</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDaysWorked}</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            {!workerAttendance || workerAttendance.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No attendance records found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workerAttendance.map((attendance) => (
                  <div
                    key={attendance.AttendanceID}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Job ID: {attendance.JobID}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(attendance.WorkDate)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Present
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default WorkerAttendance;
