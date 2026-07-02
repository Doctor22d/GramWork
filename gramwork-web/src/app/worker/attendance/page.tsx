import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";

export default function WorkerAttendancePage() {
  const attendanceRecords = [
    { date: "Oct 24, 2026", status: "Present", hours: "8" },
    { date: "Oct 23, 2026", status: "Present", hours: "8" },
    { date: "Oct 22, 2026", status: "Absent", hours: "0" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
        <p className="text-muted-foreground">Review your logged hours and attendance history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Hours Logged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.date}>
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "Present" ? "default" : "destructive"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{record.hours}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
