"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Package, Bell, MessageSquare, AlertCircle, LayoutDashboard, Users, CreditCard, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/products", label: "Products", icon: Package },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/payments", label: "Payments", icon: CreditCard },
];

const notifications = [
    { icon: Package, title: "New Order #1234", description: "From John Doe, 1 minute ago" },
    { icon: AlertCircle, title: "Low Inventory Alert", description: "T-Shirt (Red, M) is low on stock", isWarning: true },
    { icon: MessageSquare, title: "New Customer Query", description: "Regarding order #1229" },
    { icon: Package, title: "Refund Request", description: "For order #1201" },
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
                    <Package className="h-7 w-7 text-primary" />
                    <span className="text-xl">SyncBoard</span>
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
                        <CardDescription>You have 4 unread messages.</CardDescription>
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