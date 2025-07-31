"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { salesData } from "@/lib/mock-data";

export function SalesChart() {
  // We need the theme to trigger re-renders and get the correct colors.
  // `resolvedTheme` is better than `theme` because it gives you 'light' or 'dark',
  // even if the user's setting is 'system'.
  const { resolvedTheme } = useTheme();
  const [primaryColor, setPrimaryColor] = useState("#8884d8"); // A default color

  // This effect runs when the component mounts and whenever the theme changes.
  useEffect(() => {
    // We need to wait for the component to mount to safely access `window`.
    // Then we get the computed style of the --primary CSS variable.
    const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    // Recharts expects a valid color string (like 'oklch(0.7 0.2 275)' or '#ffffff')
    // We need to convert the oklch value from the variable into something the `fill` prop understands.
    // The simplest way is to read the HSL version provided in the CSS.
    if (resolvedTheme === 'dark') {
      setPrimaryColor('hsl(275, 70%, 70%)'); // Manually match the oklch intent
    } else {
      setPrimaryColor('hsl(265, 60%, 60%)'); // Manually match the oklch intent
    }
  }, [resolvedTheme]);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={salesData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
          contentStyle={{
            background: "hsl(var(--popover))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius-md)",
          }}
        />
        {/* Use the state variable for the fill color */}
        <Bar dataKey="total" fill={primaryColor} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}