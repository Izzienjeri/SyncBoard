import { StudentDashboardSidebar } from "@/components/dashboard/student-sidebar";
import { StudentDashboardHeaderBar } from "@/components/dashboard/student-header-bar";
import { StatCard } from "@/components/dashboard/stat-card";
import { MediaChart } from "@/components/dashboard/media-chart";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { getTotalStudents } from "@/lib/api";

export default async function StudentDashboardPage() {
  const totalStudents = await getTotalStudents();

  return (
    // 1. Outer Layout: Full screen gradient with padding
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-indigo-600 p-8">
      {/* 2. Card Container: Centered white card with shadow and internal padding */}
      <div className="mx-auto w-full max-w-7xl rounded-2xl bg-white p-6 shadow-xl lg:p-8 flex gap-8">
        
        {/* 3. Sidebar: Vertical navigation inside the card */}
        <StudentDashboardSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* 4. Header Bar: Title, filters, and profile avatar */}
          <StudentDashboardHeaderBar />

          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <StatCard title="Total Students" value={totalStudents.toString()} change="+5%" />
             <StatCard title="Pass Rate" value="85.3%" change="-1.2%" isNegative />
             <StatCard title="Assignments Completed" value="76%" change="+3.4%" />
             <StatCard title="Avg. Attendance" value="91%" change="This Term" />
          </div>

          {/* Charts & Tables Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3">
              {/* This component is now used for the Monthly Attendance Chart */}
              <MediaChart /> 
            </div>

            <div className="xl:col-span-2">
              {/* This component is now used for Grade Distribution and Top Subjects */}
              <CampaignsTable /> 
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
