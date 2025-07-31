import { Bell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StudentDashboardHeaderBar() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-gradient">Student Dashboard</h1>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Select defaultValue="this_term">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this_term">This Term</SelectItem>
            <SelectItem value="last_term">Last Term</SelectItem>
            <SelectItem value="full_year">Full Year</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative">
          <Bell className="h-6 w-6 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
      </div>
    </div>
  );
}
