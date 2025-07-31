import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

export function StatCard({ title, value, change, isNegative = false }: StatCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg text-center py-4 px-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 my-1">{value}</p>
      <p
        className={cn(
          "text-xs font-semibold",
          isNegative ? "text-red-500" : "text-green-500"
        )}
      >
        {change}
      </p>
    </div>
  );
}
