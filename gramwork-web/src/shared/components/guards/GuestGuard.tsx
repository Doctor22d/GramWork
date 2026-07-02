"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated, logout } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (isAuthenticated && user?.role) {
      const roleStr = String(user.role).toLowerCase();
      if (['admin', 'employer', 'worker'].includes(roleStr)) {
        router.replace(`/${roleStr}`);
      } else {
        logout();
      }
    } else if (isAuthenticated && !user?.role) {
      logout();
    }
  }, [isAuthenticated, user, router, isHydrated, logout]);

  if (!isHydrated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If they have a valid role, they will be redirected, so show loading
  if (isAuthenticated && user?.role && ['admin', 'employer', 'worker'].includes(String(user.role).toLowerCase())) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
