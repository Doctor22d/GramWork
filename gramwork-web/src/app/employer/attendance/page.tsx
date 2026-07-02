import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export default function EmployerAttendancePage() {
  const attendanceRecords = [
    { id: 1, worker: "Ramesh Kumar", date: "Oct 24, 2026", status: "Pending Approval", hours: "8" },
    { id: 2, worker: "Suresh Singh", date: "Oct 24, 2026", status: "Approved", hours: "8" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Worker Attendance</h1>
        <p className="text-muted-foreground">Review and approve daily attendance logs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Logs</CardTitle>
          <CardDescription>Approve attendance to process payouts accurately.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.worker}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.hours}h</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "Approved" ? "secondary" : "outline"} className={record.status === "Pending Approval" ? "text-orange-500 border-orange-500" : ""}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {record.status === "Pending Approval" && (
                      <Button size="sm">Approve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
