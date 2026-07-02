import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils';

const AdminPayments = () => {
  // Mock data
  const payments = [
    {
      id: '1',
      transactionId: 'TXN001',
      worker: 'Ravi Kumar',
      employer: 'Rajesh Singh',
      amount: 7000,
      status: 'COMPLETED',
      method: 'UPI',
      date: '2024-01-15T10:30:00',
    },
    {
      id: '2',
      transactionId: 'TXN002',
      worker: 'Amit Sharma',
      employer: 'Builders Co.',
      amount: 6000,
      status: 'PENDING',
      method: 'BANK_TRANSFER',
      date: '2024-01-14T14:20:00',
    },
  ];

  const stats = [
    { label: 'Total Payments', value: formatCurrency(4200000) },
    { label: 'Pending', value: '12' },
    { label: 'Completed', value: '456' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'PENDING':
      case 'PROCESSING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground mt-2">Monitor all platform payments</p>
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

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium">
                        {payment.worker} ← {payment.employer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.transactionId} • {formatDate(payment.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{payment.method}</p>
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

export default AdminPayments;
