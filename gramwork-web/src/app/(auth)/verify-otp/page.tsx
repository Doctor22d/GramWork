'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { GuestGuard } from '@/shared/components/guards/GuestGuard';
import { zodResolver } from '@hookform/resolvers/zod';
import { otpSchema, OtpFormData } from '@/features/auth/schemas/authSchemas';
import { useAuth } from '@/features/auth/hooks/useAuth';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  
  const { verifyOtp, isVerifyingOtp, sendOtp, isSendingOtp } = useAuth();
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  const handleResend = () => {
    if (!userId) return;
    sendOtp(userId);
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = (data: OtpFormData) => {
    if (!userId) return;
    verifyOtp({ userId, data }, {
      onSuccess: () => {
        router.push('/login');
      }
    });
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Invalid Verification Link</p>
      </div>
    );
  }

  return (
    <GuestGuard>
      <Card className="border-0 shadow-xl w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label htmlFor="otp">Verification Code</Label>
              <Input id="otp" placeholder="123456" maxLength={6} className="text-center tracking-[1em] font-mono text-lg" {...register('otp')} />
              {errors.otp && <p className="text-sm text-destructive">{errors.otp.message}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={isVerifyingOtp}>
              {isVerifyingOtp ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm flex flex-col space-y-2">
            <p className="text-muted-foreground">Didn&apos;t receive the code?</p>
            <Button 
              variant="outline" 
              onClick={handleResend} 
              disabled={isSendingOtp || countdown > 0}
            >
              {countdown > 0 ? `Resend available in ${countdown}s` : 'Resend OTP'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </GuestGuard>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading verification...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
