"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserSquare, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/students", icon: Users, label: "Students" },
  { href: "/teachers", icon: UserSquare, label: "Teachers" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
];

export function StudentDashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-56 lg:flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary rounded-lg">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold">EduDash</span>
      </div>
      <nav className="flex flex-row lg:flex-col gap-2 flex-grow overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
        {navItems.map((item) => {
          const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
          return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-primary",
              // FIX: Updated active state to better match the screenshot
              isActive && "bg-secondary text-primary font-semibold"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        )})}
      </nav>
    </aside>
  );
}
