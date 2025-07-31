"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserSquare, BookOpen, ClipboardCheck, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/students", icon: Users, label: "Students" },
  { href: "/teachers", icon: UserSquare, label: "Teachers" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
];

export function StudentDashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold">EduDash</span>
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900",
              (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))) && "bg-gray-100 font-semibold text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
         <Link
            href="#"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900"
          >
            <LifeBuoy className="h-5 w-5" />
            Support
          </Link>
      </div>
    </aside>
  );
}
