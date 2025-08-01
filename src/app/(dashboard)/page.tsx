"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { getTotalStudents, getTotalTeachers } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendanceData, periodStats } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceChart = dynamic(() => import("@/components/dashboard/attendance-chart").then(mod => mod.AttendanceChart), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] rounded-lg" />,
});
const StudentPerformanceSummary = dynamic(() => import("@/components/dashboard/student-performance-summary").then(mod => mod.StudentPerformanceSummary), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] rounded-lg" />,
});


type Period = "this_term" | "last_term" | "full_year";

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("this_term");

  const { data: totalStudents, isLoading: studentsLoading } = useSWR('totalStudents', getTotalStudents);
  const { data: totalTeachers, isLoading: teachersLoading } = useSWR('totalTeachers', getTotalTeachers);

  const currentStats = periodStats[period];

  const getAttendanceDataForPeriod = () => {
    switch (period) {
      case "this_term":
        return attendanceData.slice(8, 12);
      case "last_term":
        return attendanceData.slice(4, 8);
      case "full_year":
      default:
        return attendanceData;
    }
  };
  const currentAttendanceData = getAttendanceDataForPeriod();

  return (
    <>
      <PageHeader title="Student Dashboard">
        <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter period" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="this_term">This Term</SelectItem>
            <SelectItem value="last_term">Last Term</SelectItem>
            <SelectItem value="full_year">Full Year</SelectItem>
          </SelectContent>
        </Select>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {studentsLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <Link href="/students"><StatCard title="Total Students" value={totalStudents?.toString() ?? '0'} change="+5%" className="bg-chart-1/20 border-chart-1/50 hover:border-chart-1 transition-colors" /></Link>}
         {teachersLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <Link href="/teachers"><StatCard title="Total Teachers" value={totalTeachers?.toString() ?? '0'} change="+2" className="bg-chart-2/20 border-chart-2/50 hover:border-chart-2 transition-colors" /></Link>}
         <StatCard title="Pass Rate" value={currentStats.passRate} change={currentStats.passRateChange} isNegative={currentStats.isPassRateNegative} className="bg-chart-3/20 border-chart-3/50" />
         <StatCard title="Avg. Attendance" value={currentStats.avgAttendance} change={currentStats.changeLabel} className="bg-chart-4/20 border-chart-4/50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        <div className="xl:col-span-3">
          <AttendanceChart data={currentAttendanceData} />
        </div>
        <div className="xl:col-span-2">
          <StudentPerformanceSummary period={period} />
        </div>
      </div>
    </>
  );
}
