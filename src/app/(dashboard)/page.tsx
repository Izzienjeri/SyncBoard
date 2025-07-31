import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { MediaChart } from "@/components/dashboard/media-chart";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { getTotalStudents } from "@/lib/api";
import { Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function DashboardPage() {
  const totalStudents = await getTotalStudents();

  return (
    <>
      <PageHeader title="Student Dashboard">
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
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard title="Total Students" value={totalStudents.toString()} change="+5%" />
         <StatCard title="Pass Rate" value="85.3%" change="-1.2%" isNegative />
         <StatCard title="Assignments Completed" value="76%" change="+3.4%" />
         <StatCard title="Avg. Attendance" value="91%" change="This Term" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <MediaChart /> 
        </div>
        <div className="xl:col-span-2">
          <CampaignsTable /> 
        </div>
      </div>
    </>
  );
}