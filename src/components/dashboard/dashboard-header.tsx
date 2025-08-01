"use client"

import { useSidebar } from "@/hooks/use-sidebar"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
    const { toggle } = useSidebar()

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:px-6 lg:px-8">
            <Button variant="outline" size="icon" className="h-9 w-9 lg:hidden" onClick={toggle}>
                <Menu className="h-5 w-5"/>
                <span className="sr-only">Toggle sidebar</span>
            </Button>
            <div className="flex-1">
              {/* Future search bar location */}
            </div>
            {/* Future user menu / actions location */}
        </header>
    )
}
