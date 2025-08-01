"use client";
import {
  Area,
  Line,
  XAxis,
  YAxis,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';


import { StudentAttendance } from "@/lib/mock-data";

export function AttendanceChart({ data }: { data: StudentAttendance[] }) {
  return (
    <div className="rounded-lg border bg-white p-4 h-[400px] flex flex-col">
      <h3 className="font-semibold text-lg mb-2">Monthly Attendance Trends</h3>
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            {/* Defines the gradient used for the area fill below the line. */}
            <defs>
              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
              }}
              formatter={(value: number) => [`${value}%`, "Attendance"]}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="none"
              fill="url(#colorAttendance)"
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
