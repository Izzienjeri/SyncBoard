import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { StudentPerformanceSummary } from "@/components/dashboard/student-performance-summary";
import { getTotalStudents, getTotalTeachers } from "@/lib/api";
import { Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function DashboardPage() {
  const totalStudents = await getTotalStudents();
  const totalTeachers = await getTotalTeachers();

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
         <StatCard title="Total Students" value={totalStudents.toString()} change="+5%" className="bg-[--color-chart-1]/20 border border-[--color-chart-1]/50" />
         <StatCard title="Total Teachers" value={totalTeachers.toString()} change="+2" className="bg-[--color-chart-2]/20 border border-[--color-chart-2]/50" />
         <StatCard title="Pass Rate" value="85.3%" change="-1.2%" isNegative className="bg-[--color-chart-3]/20 border border-[--color-chart-3]/50" />
         <StatCard title="Avg. Attendance" value="91%" change="This Term" className="bg-[--color-chart-4]/20 border border-[--color-chart-4]/50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <AttendanceChart /> 
        </div>
        <div className="xl:col-span-2">
          <StudentPerformanceSummary /> 
        </div>
      </div>
    </>
  );
}
