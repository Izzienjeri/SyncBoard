"use client"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Rectangle, type RectangleProps,
} from "recharts";
import { GradeDistribution, SubjectScore, subjectScoreData } from "@/lib/mock-data";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

const GRADE_COLORS = ['#2dd4bf', '#3b82f6', '#fbbd23', '#f87171', '#ef4444'];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: ValueType }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 text-sm rounded-md border bg-popover text-popover-foreground shadow-md glass-card">
        <p className="font-bold">{`Grade ${label}`}</p>
        <p>{`Number of Students: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ActiveBar = (props: RectangleProps) => {
  const { x = 0, y = 0, width = 0, height = 0, ...rest } = props;
  return <Rectangle {...rest} x={x} width={width} height={height + 5} y={y - 5} />;
};


const GradeDistributionChart = ({ data }: { data: GradeDistribution[] }) => (
  <div className="h-56">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
        <XAxis dataKey="grade" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
        <Tooltip cursor={false} content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} activeBar={<ActiveBar />}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const TopSubjectsList = ({ data }: { data: SubjectScore[] }) => (
  <Table>
    <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead className="text-right">Avg. Score</TableHead></TableRow></TableHeader>
    <TableBody>
      {data.sort((a, b) => b.averageScore - a.averageScore).slice(0, 5).map((subject) => (
        <TableRow key={subject.name} className="hover:bg-muted/50 text-sm">
          <TableCell className="font-medium capitalize">{subject.name.replace(/-/g, ' ')}</TableCell>
          <TableCell className="text-right"><Badge variant="secondary" className={subject.averageScore >= 90 ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : subject.averageScore >= 80 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"}>{subject.averageScore.toFixed(1)}%</Badge></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export function StudentPerformanceSummary({ gradeDistribution }: { gradeDistribution?: GradeDistribution[] }) {
  // Top subjects data can remain static for this exercise
  const currentTopSubjectsData = subjectScoreData["full_year"];

  return (
    <div className="rounded-lg border bg-card p-4 h-full flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-lg mb-2">Grade Distribution</h3>
        {gradeDistribution ? <GradeDistributionChart data={gradeDistribution} /> : <p className="text-center text-muted-foreground p-8">Loading stats...</p>}
      </div>
      <div className="border-t pt-2">
        <h3 className="font-semibold text-lg mb-2">Top Subjects</h3>
        <div className="overflow-auto">
          <TopSubjectsList data={currentTopSubjectsData} />
        </div>
      </div>
    </div>
  );
}
