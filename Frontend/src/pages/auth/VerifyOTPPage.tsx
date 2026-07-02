import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { otpSchema, OTPFormData } from '@/utils/validation';

const VerifyOTPPage = () => {
  const location = useLocation();
  const userId = location.state?.userId;
  const { verifyOTPMutation, sendOTPMutation } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const onSubmit = (data: OTPFormData) => {
    if (userId) {
      verifyOTPMutation.mutate({ userId, data });
    }
  };

  const handleResendOTP = () => {
    if (userId) {
      sendOTPMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your phone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                {...register('otp')}
              />
              {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={verifyOTPMutation.isPending}>
              {verifyOTPMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={sendOTPMutation.isPending}
              >
                {sendOTPMutation.isPending ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOTPPage;
