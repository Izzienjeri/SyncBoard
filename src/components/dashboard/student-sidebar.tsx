"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserSquare, BookOpen, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/students", icon: Users, label: "Students" },
  { href: "/teachers", icon: UserSquare, label: "Teachers" },
  { href: "/subjects", icon: BookOpen, label: "Subjects" },
];

export function StudentDashboardSidebar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  const navLinks = navItems.map((item) => {
    const isActive = (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
    return (
      <Link
        key={item.label}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-all hover:bg-secondary hover:text-primary",
          isActive && "bg-secondary text-primary font-semibold"
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    )
  });

  return (
    <aside className="w-full lg:w-56 lg:flex-shrink-0">
      <div className="flex justify-between items-center mb-4 lg:mb-8">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-lg">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">SyncBoard</span>
        </div>
        <button
          className="lg:hidden rounded-md p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Toggle menu</span>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      <div
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden lg:hidden",
          isMenuOpen ? 'max-h-screen' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col gap-2 border-t pt-4">
          {navLinks}
        </nav>
      </div>

      <nav className="hidden lg:flex flex-col gap-2">
        {navLinks}
      </nav>
    </aside>
  );
}
