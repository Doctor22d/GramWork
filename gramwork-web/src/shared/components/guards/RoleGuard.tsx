"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { Role } from "@/shared/types/models";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
    } else if (user.role && !allowedRoles.includes(user.role as Role)) {
      const roleStr = String(user.role).toLowerCase();
      router.replace(`/${roleStr}`);
    }
  }, [isAuthenticated, user, allowedRoles, router, isHydrated]);

  if (!isHydrated || !isAuthenticated || !user || !allowedRoles.includes(user.role as Role)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
