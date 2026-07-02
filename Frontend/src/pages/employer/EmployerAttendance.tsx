import { useAttendance } from '@/hooks/useAttendance';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function EmployerAttendance() {
  const { data: attendanceRecords, isLoading } = useAttendance.useGetAll();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'LATE':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'destructive' | 'warning' | 'secondary'> = {
      PRESENT: 'success',
      ABSENT: 'destructive',
      LATE: 'warning',
      ON_LEAVE: 'secondary',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Records</h1>
        <p className="text-muted-foreground">Track worker attendance for your jobs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Records</p>
              <p className="text-2xl font-bold">{attendanceRecords?.length || 0}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-green-600">
                {attendanceRecords?.filter((a) => a.status === 'PRESENT').length || 0}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Absent</p>
              <p className="text-2xl font-bold text-red-600">
                {attendanceRecords?.filter((a) => a.status === 'ABSENT').length || 0}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Late</p>
              <p className="text-2xl font-bold text-yellow-600">
                {attendanceRecords?.filter((a) => a.status === 'LATE').length || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
      </div>

      {/* Attendance List */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Attendance History</h2>
          {!attendanceRecords || attendanceRecords.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Worker</th>
                    <th className="text-left py-3 px-4 font-medium">Job</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Check In</th>
                    <th className="text-left py-3 px-4 font-medium">Check Out</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{record.workerName || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {record.workerId}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{record.jobTitle || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-4">
                        {record.attendanceDate ? formatDate(record.attendanceDate) : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {record.checkInTime ? (
                          <span className="text-sm">{record.checkInTime}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {record.checkOutTime ? (
                          <span className="text-sm">{record.checkOutTime}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          {getStatusBadge(record.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {record.hoursWorked ? (
                          <span className="font-medium">{record.hoursWorked}h</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
