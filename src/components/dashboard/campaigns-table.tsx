"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { gradeData, topSubjectsData } from "@/lib/mock-data";

const GRADE_COLORS = ['#2dd4bf', '#3b82f6', '#fbbd23', '#f87171', '#ef4444'];

const GradeDistributionChart = () => (
  <div className="h-56"> {/* Set a fixed height for the chart area */}
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={gradeData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
        <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))' }}
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
          formatter={(value: number) => [value, "Students"]}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {gradeData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const TopSubjectsList = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Subject</TableHead>
        <TableHead className="text-right">Avg. Score</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {topSubjectsData.sort((a, b) => b.averageScore - a.averageScore).map((subject) => (
        <TableRow key={subject.name} className="hover:bg-muted/50 text-sm">
          <TableCell className="font-medium">{subject.name}</TableCell>
          <TableCell className="text-right">
            <Badge variant="secondary" className={
                subject.averageScore >= 90 ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" :
                subject.averageScore >= 80 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" :
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
            }>
                {subject.averageScore}%
            </Badge>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export function CampaignsTable() {
  return (
    <div className="rounded-lg border bg-card p-4 h-full flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Grade Distribution</h3>
        <GradeDistributionChart />
      </div>
      <div className="border-t pt-2">
        <h3 className="font-semibold text-lg mb-2">Top Subjects</h3>
        <div className="overflow-auto">
            <TopSubjectsList />
        </div>
      </div>
    </div>
  );
}
