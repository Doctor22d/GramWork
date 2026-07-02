import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { usePayments } from '@/hooks';
import { formatCurrency, formatDate } from '@/utils';
import { Download, CheckCircle, Clock, XCircle } from 'lucide-react';

const WorkerPayments = () => {
  const { user } = useAuthStore();
  const { workerPayments, isLoadingWorkerPayments } = usePayments(user?.id);

  if (isLoadingWorkerPayments) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

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

  const totalEarnings = workerPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground mt-2">Track your payment history</p>
        </div>

        {/* Total Earnings Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-white">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{formatCurrency(totalEarnings)}</p>
            <p className="text-sm mt-2 text-white/80">
              From {workerPayments?.length || 0} completed jobs
            </p>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {!workerPayments || workerPayments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No payment records found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {workerPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="font-medium">Payment #{payment.transactionId || payment.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payment.paidAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{formatCurrency(payment.amount)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{payment.paymentMethod}</p>
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

export default WorkerPayments;
