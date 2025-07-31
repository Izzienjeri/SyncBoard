import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row items-start md:items-center justify-between gap-4", className)} {...props}>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-gradient">{title}</span>
        </h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-4 w-full md:w-auto justify-end">{children}</div>}
    </div>
  );
}
