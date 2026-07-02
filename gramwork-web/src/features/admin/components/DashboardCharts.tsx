'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const MOCK_GROWTH_DATA = [
  { month: 'Jan', employers: 400, workers: 2400, assignments: 2400 },
  { month: 'Feb', employers: 300, workers: 1398, assignments: 2210 },
  { month: 'Mar', employers: 200, workers: 9800, assignments: 2290 },
  { month: 'Apr', employers: 278, workers: 3908, assignments: 2000 },
  { month: 'May', employers: 189, workers: 4800, assignments: 2181 },
  { month: 'Jun', employers: 239, workers: 3800, assignments: 2500 },
];

const MOCK_STATUS_DATA = [
  { name: 'Completed', value: 400 },
  { name: 'Active', value: 300 },
  { name: 'Pending', value: 300 },
  { name: 'Cancelled', value: 200 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function GrowthChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Platform Growth (Users & Assignments)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_GROWTH_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'hsl(var(--background))' }} />
              <Legend />
              <Line type="monotone" dataKey="workers" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="employers" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="assignments" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AssignmentStatusChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignment Statuses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={MOCK_STATUS_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {MOCK_STATUS_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'hsl(var(--background))' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AttendanceSummaryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance & Check-ins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_GROWTH_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '8px', backgroundColor: 'hsl(var(--background))' }} />
              <Legend />
              <Bar dataKey="workers" name="Successful Check-ins" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
