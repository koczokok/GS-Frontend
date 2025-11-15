"use client";

import { Role } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Trophy,
  FileText,
  User,
  PlusCircle,
  Gavel,
  Target,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    title: "Challenges",
    href: "/dashboard/challenges",
    icon: Target,
    roles: [Role.PARTICIPANT, Role.JUDGE],
  },
  {
    title: "My Submissions",
    href: "/dashboard/submissions",
    icon: FileText,
    roles: [Role.PARTICIPANT],
  },
  {
    title: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: Trophy,
    roles: [Role.PARTICIPANT],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: [Role.PARTICIPANT, Role.JUDGE, Role.ADMIN],
  },
  {
    title: "Create Challenge",
    href: "/dashboard/admin/create-challenge",
    icon: PlusCircle,
    roles: [Role.ADMIN],
  },
  {
    title: "Review Submissions",
    href: "/dashboard/judge/submissions",
    icon: Gavel,
    roles: [Role.JUDGE],
  },
];

interface DashboardNavProps {
  role: Role;
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <nav className="flex flex-col gap-1">
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
