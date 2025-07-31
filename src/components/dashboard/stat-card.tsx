import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isNegative?: boolean;
}

export function StatCard({ title, value, change, isNegative = false }: StatCardProps) {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-foreground my-1">{value}</p>
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
