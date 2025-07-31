"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  LucideProps,
  UserSquare,
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { ForwardRefExoticComponent, RefAttributes } from "react";

type NavLink = 
  | { label: string; isHeader: true }
  | { 
      href: string; 
      label: string; 
      icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    };

const navLinks: NavLink[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { label: "Management", isHeader: true },
  { href: "/students", label: "Students", icon: Users },
  { href: "/teachers", label: "Teachers", icon: UserSquare },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/enrollments", label: "Enrollments", icon: ClipboardCheck },
];

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background/50 backdrop-blur-lg transition-all duration-300 ease-in-out lg:flex",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/" className={cn("flex items-center gap-2 font-bold tracking-tight", !isOpen && "justify-center")}>
          <BookOpen className="h-7 w-7 text-primary" />
          <span className={cn("text-xl", !isOpen && "hidden")}>EduDash</span>
        </Link>
        <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggle}>
            {isOpen ? <ChevronLeft className="h-5 w-5"/> : <ChevronRight className="h-5 w-5"/>}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        <TooltipProvider delayDuration={0}>
          {navLinks.map((link) => {
            if ("isHeader" in link) {
              return (
                <div key={link.label} className={cn(
                    "px-3 pt-4 pb-2 text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider",
                    !isOpen && "hidden"
                )}>
                    {link.label}
                </div>
              );
            } else {
              const isActive = (link.href === "/" && pathname === "/") || (link.href !== "/" && pathname.startsWith(link.href));
              const LinkIcon = link.icon;
              
              const content = (
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                      isActive && "bg-primary/10 text-primary",
                      !isOpen && "justify-center"
                    )}
                  >
                    <LinkIcon className="h-5 w-5" />
                    <span className={cn("font-medium", !isOpen && "hidden")}>{link.label}</span>
                  </Link>
              );

              return (
                <div key={link.href}>
                  {isOpen ? (
                      content
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>{content}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            }
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}