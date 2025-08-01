"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getTotalStudents, getTotalTeachers, fetcher } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendanceData } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import type { GradeDistribution } from "@/lib/mock-data";

// Dynamically import chart components with SSR disabled, as they rely on client-side browser APIs.
const AttendanceChart = dynamic(() => import("@/components/dashboard/attendance-chart").then(mod => mod.AttendanceChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] rounded-lg" />,
});
const StudentPerformanceSummary = dynamic(() => import("@/components/dashboard/student-performance-summary").then(mod => mod.StudentPerformanceSummary), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] rounded-lg" />,
});


type Period = "this_term" | "last_term" | "full_year";
type StatsData = {
  passRate: string;
  gradeDistribution: GradeDistribution[];
};


export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("this_term");

  const { data: totalStudents, isLoading: studentsLoading } = useSWR('totalStudents', getTotalStudents);
  const { data: totalTeachers, isLoading: teachersLoading } = useSWR('totalTeachers', getTotalTeachers);
  const { data: statsData, isLoading: statsLoading } = useSWR<StatsData>('/api/stats', fetcher);


  const periodAvgAttendance = {
    this_term: { avgAttendance: "91%", changeLabel: "This Term" },
    last_term: { avgAttendance: "89%", changeLabel: "Last Term" },
    full_year: { avgAttendance: "90%", changeLabel: "Full Year" },
  };
  const currentAvgAttendance = periodAvgAttendance[period];

  // Filters the full year's mock attendance data based on the selected period.
  const getAttendanceDataForPeriod = () => {
    switch (period) {
      case "this_term": return attendanceData.slice(8, 12);
      case "last_term": return attendanceData.slice(4, 8);
      case "full_year": default: return attendanceData;
    }
  };
  const currentAttendanceData = getAttendanceDataForPeriod();

  return (
    <>
      <PageHeader title="Analytics">
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter period" /></SelectTrigger>
          <SelectContent><SelectItem value="this_term">This Term</SelectItem><SelectItem value="last_term">Last Term</SelectItem><SelectItem value="full_year">Full Year</SelectItem></SelectContent>
        </Select>
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {studentsLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <Link href="/students"><StatCard title="Total Students" value={totalStudents?.toString() ?? '0'} change="+5%" className="bg-chart-1/20 border-chart-1/50 hover:border-chart-1 transition-colors" /></Link>}
         {teachersLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <Link href="/teachers"><StatCard title="Total Teachers" value={totalTeachers?.toString() ?? '0'} change="+2" className="bg-chart-2/20 border-chart-2/50 hover:border-chart-2 transition-colors" /></Link>}
         {statsLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <StatCard title="Pass Rate" value={statsData?.passRate ?? 'N/A'} change="Calculated" className="bg-chart-3/20 border-chart-3/50" />}
         <StatCard title="Avg. Attendance" value={currentAvgAttendance.avgAttendance} change={currentAvgAttendance.changeLabel} className="bg-chart-4/20 border-chart-4/50" />
      </div>

      
      <h2 className="sr-only">Performance and Attendance Overview</h2>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <AttendanceChart data={currentAttendanceData} />
        </div>
        <div className="xl:col-span-2">
          {statsLoading 
            ? <Skeleton className="h-full min-h-[400px] rounded-lg" /> 
            : <StudentPerformanceSummary gradeDistribution={statsData?.gradeDistribution} />
          }
        </div>
      </div>
    </>
  );
}
