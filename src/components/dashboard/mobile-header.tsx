"use client";
import { BookOpen, Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur-lg sm:px-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary rounded-lg">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">SyncBoard</span>
      </div>
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </button>
    </header>
  );
}
