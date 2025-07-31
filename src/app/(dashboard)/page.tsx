import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { MediaChart } from "@/components/dashboard/media-chart";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { getTotalStudents } from "@/lib/api";

export default async function DashboardPage() {
  const totalStudents = await getTotalStudents();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome Back, Admin!"
        description="Here's a summary of school performance today."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={totalStudents.toString()} change="+5%" />
        <StatCard title="Pass Rate" value="85.3%" change="-1.2%" isNegative />
        <StatCard title="Assignments Completed" value="76%" change="+3.4%" />
        <StatCard title="Classes per Term" value="6" change="Term 2" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
            {/* This is the Monthly Attendance Chart now */}
            <MediaChart />
        </div>
        <div className="xl:col-span-2">
            {/* This now contains Grade Distribution and Top Subjects */}
            <CampaignsTable />
        </div>
      </div>
    </div>
  );
}