"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/types";

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.role) {
      const role = session.role as Role;
      // Redirect based on role
      switch (role) {
        case Role.PARTICIPANT:
          router.push("/dashboard/challenges");
          break;
        case Role.JUDGE:
          router.push("/dashboard/challenges");
          break;
        case Role.ADMIN:
          router.push("/dashboard/admin/create-challenge");
          break;
        default:
          router.push("/dashboard/challenges");
      }
    }
  }, [session, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
}
