"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { attendanceData } from "@/lib/mock-data";

export function MediaChart() {
  return (
    <div className="rounded-lg border bg-white p-4 h-full flex flex-col">
      <h3 className="font-semibold text-lg mb-2">Monthly Attendance Trends</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={attendanceData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
              }}
              formatter={(value: number) => [`${value}%`, "Attendance"]}
            />
            <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}