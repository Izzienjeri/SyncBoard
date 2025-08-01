"use client";

import { useState } from "react";
import useSWR from "swr";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { StudentPerformanceSummary } from "@/components/dashboard/student-performance-summary";
import { getTotalStudents, getTotalTeachers } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { attendanceData, periodStats } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

type Period = "this_term" | "last_term" | "full_year";

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>("this_term");

  const { data: totalStudents, isLoading: studentsLoading } = useSWR('totalStudents', getTotalStudents);
  const { data: totalTeachers, isLoading: teachersLoading } = useSWR('totalTeachers', getTotalTeachers);

  const currentStats = periodStats[period];

  const getAttendanceDataForPeriod = () => {
    switch (period) {
      case "this_term":
        return attendanceData.slice(8, 12); // Last 4 months
      case "last_term":
        return attendanceData.slice(4, 8); // Mid 4 months
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
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter period" />
          </SelectTrigger>
          <SelectContent>
             <SelectItem value="this_term">This Term</SelectItem>
            <SelectItem value="last_term">Last Term</SelectItem>
            <SelectItem value="full_year">Full Year</SelectItem>
          </SelectContent>
        </Select>
        
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {studentsLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <StatCard title="Total Students" value={totalStudents?.toString() ?? '0'} change="+5%" className="bg-[--color-chart-1]/20 border border-[--color-chart-1]/50" />}
         {teachersLoading ? <Skeleton className="h-[108px] rounded-lg" /> : <StatCard title="Total Teachers" value={totalTeachers?.toString() ?? '0'} change="+2" className="bg-[--color-chart-2]/20 border border-[--color-chart-2]/50" />}
         <StatCard title="Pass Rate" value={currentStats.passRate} change={currentStats.passRateChange} isNegative={currentStats.isPassRateNegative} className="bg-[--color-chart-3]/20 border border-[--color-chart-3]/50" />
         <StatCard title="Avg. Attendance" value={currentStats.avgAttendance} change={currentStats.changeLabel} className="bg-[--color-chart-4]/20 border border-[--color-chart-4]/50" />
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
