"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3, isGroup: true },
  { href: "/products", label: "Products", icon: Package },
  { href: "/customers", label: "Customers", icon: Users, isGroup: true },
  { href: "/payments", label: "Payments", icon: CreditCard, isGroup: true },
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
          <Package className="h-7 w-7 text-primary" />
          <span className={cn("text-xl", !isOpen && "hidden")}>SyncBoard</span>
        </Link>
        <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggle}>
            {isOpen ? <ChevronLeft className="h-5 w-5"/> : <ChevronRight className="h-5 w-5"/>}
        </Button>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        <TooltipProvider delayDuration={0}>
          {navLinks.map((link) => {
            const isActive = (link.href === "/" && pathname === "/") || (link.href !== "/" && pathname.startsWith(link.href));
            const content = (
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                    isActive && "bg-primary/10 text-primary",
                    !isOpen && "justify-center"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className={cn("font-medium", !isOpen && "hidden")}>{link.label}</span>
                </Link>
            );

            return (
              <div key={link.href}>
                {link.isGroup && <div className={cn("h-4", !isOpen && "hidden")}></div>}
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
          })}
        </TooltipProvider>
      </nav>
    </aside>
  );
}