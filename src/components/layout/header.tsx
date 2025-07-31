"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, MessageSquare, AlertCircle, LayoutDashboard, Users, BookOpen, ClipboardCheck, UserSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/students", label: "Students", icon: Users },
  { href: "/teachers", label: "Teachers", icon: UserSquare },
  { href: "/courses", label: "Courses", icon: BookOpen },
  { href: "/enrollments", label: "Enrollments", icon: ClipboardCheck },
];

const notifications = [
    { icon: ClipboardCheck, title: "New Enrollment: Physics 101", description: "From Terry Medhurst, 1 minute ago" },
    { icon: AlertCircle, title: "Low Capacity: CS 101", description: "Only 3 slots remaining", isWarning: true },
    { icon: MessageSquare, title: "New Parent Query", description: "Regarding student #15" },
    { icon: ClipboardCheck, title: "Withdrawal Request", description: "For student #22 from Math 202" },
]

export function Header() {
  const { toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/50 px-4 backdrop-blur-lg sm:px-6">
      <Button variant="outline" size="icon" className="shrink-0 hidden lg:flex" onClick={toggle}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
             <Button variant="outline" size="icon" className="shrink-0 lg:hidden" >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
             <div className="flex h-16 items-center justify-between border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
                    <BookOpen className="h-7 w-7 text-primary" />
                    <span className="text-xl">EduDash</span>
                </Link>
            </div>
            
            <nav className="flex-1 space-y-2 p-4">
              {navLinks.map((link) => {
                const isActive = (link.href === "/" && pathname === "/") || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
        </SheetContent>
      </Sheet>
      
      <div className="flex w-full items-center justify-end gap-4">
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Notifications</CardTitle>
                        <CardDescription>You have 4 new notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2">
                        <div className="flex flex-col gap-1">
                            {notifications.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 rounded-md p-2 hover:bg-muted transition-colors cursor-pointer">
                                    <item.icon className={cn("h-5 w-5 mt-1 flex-shrink-0", item.isWarning && "text-destructive")}/>
                                    <div>
                                        <p className="font-semibold text-sm">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </PopoverContent>
        </Popover>

        <ThemeToggle />
      </div>
    </header>
  );
}